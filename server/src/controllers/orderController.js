import { prisma, memoryDb, isPrismaConnected } from '../db/prisma.js';

const mapOrderForUI = (o) => {
  if (!o) return null;
  return {
    ...o,
    _id: o.id,
    paymentMethod: o.paymentMethod || 'Online',
    paymentStatus: o.status === 'COMPLETED' ? 'Completed' : o.status === 'CANCELLED' ? 'Cancelled' : 'Pending',
    orderStatus: o.status === 'COMPLETED' ? 'Delivered' : o.status === 'CANCELLED' ? 'Cancelled' : 'Processing',
    totalPrice: o.totalAmount,
    createdAt: o.createdAt,
    deliveredAt: o.updatedAt || o.createdAt,
    user: {
      profilePicture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      email: o.user?.email || 'customer@example.com',
      fullname: o.user?.name || 'Customer'
    },
    orderItems: o.items ? o.items.map(item => ({
      _id: item.id,
      quantity: item.quantity,
      price: item.unitPrice,
      product: {
        name: item.product?.name || 'Product',
        images: [item.product?.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=60']
      }
    })) : []
  };
};

export const createOrder = async (req, res) => {
  try {
    let items = req.body.items;
    if (req.body.orderItems && Array.isArray(req.body.orderItems)) {
      items = req.body.orderItems.map(item => ({
        productId: item.product || item.productId,
        quantity: item.quantity || 1
      }));
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    // Validate input structure
    for (const item of items) {
      if (!item.productId || !item.quantity || parseInt(item.quantity, 10) <= 0) {
        return res.status(400).json({ message: 'Each item must have a valid productId and quantity greater than 0.' });
      }
    }

    if (isPrismaConnected) {
      // Execute in Prisma Transaction for full ACID compliance
      const result = await prisma.$transaction(async (tx) => {
        let calculatedTotal = 0;
        const processedItems = [];

        // 1. Fetch & validate product stocks
        for (const item of items) {
          const qty = parseInt(item.quantity, 10);
          const product = await tx.product.findUnique({ where: { id: item.productId } });

          if (!product) {
            throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`);
          }

          if (product.stock < qty) {
            throw new Error(`INSUFFICIENT_STOCK:${product.name}:${product.stock}:${qty}`);
          }

          const lineTotal = product.price * qty;
          calculatedTotal += lineTotal;

          processedItems.push({
            productId: product.id,
            quantity: qty,
            unitPrice: product.price,
            product
          });
        }

        // 2. Create Order
        const newOrder = await tx.order.create({
          data: {
            userId: req.user.id,
            totalAmount: parseFloat(calculatedTotal.toFixed(2)),
            status: 'PENDING',
            items: {
              create: processedItems.map(pi => ({
                productId: pi.productId,
                quantity: pi.quantity,
                unitPrice: pi.unitPrice
              }))
            }
          },
          include: {
            items: {
              include: {
                product: true
              }
            },
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        });

        // 3. Reduce Inventory Stock
        for (const pi of processedItems) {
          await tx.product.update({
            where: { id: pi.productId },
            data: {
              stock: { decrement: pi.quantity }
            }
          });
        }

        return newOrder;
      });

      return res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order: result
      });
    } else {
      // In-Memory Transaction simulation
      let calculatedTotal = 0;
      const processedItems = [];

      for (const item of items) {
        const qty = parseInt(item.quantity, 10);
        const product = memoryDb.products.find(p => p.id === item.productId);

        if (!product) {
          return res.status(404).json({ message: `Product '${item.productId}' not found.` });
        }

        if (product.stock < qty) {
          return res.status(400).json({
            message: `Insufficient stock for product '${product.name}'. Requested: ${qty}, Available in stock: ${product.stock}.`
          });
        }

        const lineTotal = product.price * qty;
        calculatedTotal += lineTotal;

        processedItems.push({
          productId: product.id,
          quantity: qty,
          unitPrice: product.price,
          product
        });
      }

      // Deduct stock
      for (const pi of processedItems) {
        const pIndex = memoryDb.products.findIndex(p => p.id === pi.productId);
        if (pIndex !== -1) {
          memoryDb.products[pIndex].stock -= pi.quantity;
        }
      }

      // Create Order
      const newOrderId = `ord-${Date.now()}`;
      const newOrder = {
        id: newOrderId,
        userId: req.user.id,
        user: { id: req.user.id, name: req.user.name, email: req.user.email },
        totalAmount: parseFloat(calculatedTotal.toFixed(2)),
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: processedItems.map((pi, idx) => ({
          id: `oi-${Date.now()}-${idx}`,
          orderId: newOrderId,
          productId: pi.productId,
          product: pi.product,
          quantity: pi.quantity,
          unitPrice: pi.unitPrice
        }))
      };

      memoryDb.orders.unshift(newOrder);

      return res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order: newOrder
      });
    }
  } catch (error) {
    if (error.message.startsWith('INSUFFICIENT_STOCK:')) {
      const parts = error.message.split(':');
      const name = parts[1];
      const avail = parts[2];
      const reqQty = parts[3];
      return res.status(400).json({
        message: `Insufficient stock for product '${name}'. Requested: ${reqQty}, Available in stock: ${avail}.`
      });
    }
    if (error.message.startsWith('PRODUCT_NOT_FOUND:')) {
      const pId = error.message.split(':')[1];
      return res.status(404).json({ message: `Product with ID '${pId}' not found.` });
    }

    console.error('createOrder error:', error);
    return res.status(500).json({ message: 'Error processing order.', error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    if (isPrismaConnected) {
      const where = {};
      // If customer, only see own orders
      if (req.user.role !== 'ADMIN') {
        where.userId = req.user.id;
      }
      if (status && status !== 'ALL') {
        where.status = status;
      }

      const totalOrders = await prisma.order.count({ where });
      const orders = await prisma.order.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: true } }
        }
      });

      const mappedOrders = orders.map(mapOrderForUI);
      if (req.originalUrl.includes('myOrders')) {
        return res.json({ myOrders: mappedOrders });
      }
      return res.json(mappedOrders);
    } else {
      let filtered = [...memoryDb.orders];

      if (req.user.role !== 'ADMIN') {
        filtered = filtered.filter(o => o.userId === req.user.id);
      }

      if (status && status !== 'ALL') {
        filtered = filtered.filter(o => o.status === status);
      }

      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const totalOrders = filtered.length;
      const paginated = filtered.slice(skip, skip + limitNum);
      const mappedOrders = paginated.map(mapOrderForUI);

      if (req.originalUrl.includes('myOrders')) {
        return res.json({ myOrders: mappedOrders });
      }
      return res.json(mappedOrders);
    }
  } catch (error) {
    console.error('getOrders error:', error);
    return res.status(500).json({ message: 'Error retrieving orders.', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    let order;
    if (isPrismaConnected) {
      order = await prisma.order.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: true } }
        }
      });
    } else {
      order = memoryDb.orders.find(o => o.id === id);
    }

    if (!order) {
      return res.status(404).json({ message: `Order with ID '${id}' not found.` });
    }

    // Authorization check: User can only see own order unless Admin
    if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to this order.' });
    }

    return res.json({ order });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching order details.', error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (isPrismaConnected) {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!order) {
        return res.status(404).json({ message: `Order with ID '${id}' not found.` });
      }

      if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden. You can only cancel your own orders.' });
      }

      if (order.status === 'CANCELLED') {
        return res.status(400).json({ message: 'This order has already been cancelled.' });
      }

      // Transaction: Restore inventory stock and update order status to CANCELLED
      const updatedOrder = await prisma.$transaction(async (tx) => {
        // 1. Update Order Status
        const cancelled = await tx.order.update({
          where: { id },
          data: { status: 'CANCELLED' },
          include: {
            user: { select: { id: true, name: true, email: true } },
            items: { include: { product: true } }
          }
        });

        // 2. Restore Inventory Stock for each item
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity }
            }
          });
        }

        return cancelled;
      });

      return res.json({
        message: 'Order cancelled successfully and inventory stock restored.',
        order: updatedOrder
      });
    } else {
      const order = memoryDb.orders.find(o => o.id === id);

      if (!order) {
        return res.status(404).json({ message: `Order with ID '${id}' not found.` });
      }

      if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden. You can only cancel your own orders.' });
      }

      if (order.status === 'CANCELLED') {
        return res.status(400).json({ message: 'This order has already been cancelled.' });
      }

      // Update status
      order.status = 'CANCELLED';
      order.updatedAt = new Date();

      // Restore Inventory Stock
      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          const pIndex = memoryDb.products.findIndex(p => p.id === item.productId);
          if (pIndex !== -1) {
            memoryDb.products[pIndex].stock += item.quantity;
          }
        }
      }

      return res.json({
        message: 'Order cancelled successfully and inventory stock restored.',
        order
      });
    }
  } catch (error) {
    console.error('cancelOrder error:', error);
    return res.status(500).json({ message: 'Error cancelling order.', error: error.message });
  }
};
