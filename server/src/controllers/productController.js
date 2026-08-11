import { prisma, memoryDb, isPrismaConnected } from '../db/prisma.js';

const getBrandName = (p) => {
  const n = p.name.toLowerCase();
  if (n.includes('apple') || n.includes('macbook') || n.includes('iphone') || n.includes('ipad') || n.includes('apple watch')) return 'Apple';
  if (n.includes('samsung') || n.includes('galaxy')) return 'Samsung';
  if (n.includes('sony')) return 'Sony';
  if (n.includes('oneplus')) return 'OnePlus';
  if (n.includes('dell') || n.includes('xps')) return 'Dell';
  if (n.includes('asus') || n.includes('rog') || n.includes('zephyrus')) return 'ASUS';
  if (n.includes('hp') || n.includes('spectre')) return 'HP';
  if (n.includes('pixel')) return 'Google';
  return p.category || 'Zapster';
};

const mapProductForUI = (p) => {
  if (!p) return null;
  const brandName = getBrandName(p);
  const charSum = (p.id || p.name).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const ratingVal = parseFloat((4.0 + (charSum % 10) * 0.1).toFixed(1));
  const discountVal = 10 + (charSum % 5) * 10;
  const originalPrice = Math.round(p.price * (1 + discountVal / 100));
  const img = p.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';

  return {
    ...p,
    _id: p.id,
    slug: p.id,
    images: [img],
    brand: { name: brandName, image: img },
    category: { _id: p.category || 'general', name: p.category || 'General' },
    originalPrice: originalPrice,
    discountPrice: p.price,
    discount: discountVal,
    ratings: { averageRating: ratingVal, numberOfReviews: 15 + (charSum % 150) },
    reviews: [],
    tags: [p.category || 'General', brandName],
    quantity: p.stock
  };
};

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      sort,
      rating,
      discount
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    let allProducts = [];
    if (isPrismaConnected) {
      allProducts = await prisma.product.findMany();
    } else {
      allProducts = [...memoryDb.products];
    }

    let mapped = allProducts.map(mapProductForUI);

    if (search) {
      const q = search.toLowerCase();
      mapped = mapped.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      mapped = mapped.filter(p => p.category.name.toLowerCase() === category.toLowerCase());
    }

    if (minPrice) {
      mapped = mapped.filter(p => p.discountPrice >= parseFloat(minPrice));
    }
    if (maxPrice) {
      mapped = mapped.filter(p => p.discountPrice <= parseFloat(maxPrice));
    }

    if (rating) {
      const minRating = parseFloat(rating);
      if (!isNaN(minRating)) {
        mapped = mapped.filter(p => p.ratings.averageRating >= minRating);
      }
    }

    if (discount) {
      const minDiscount = parseFloat(discount);
      if (!isNaN(minDiscount)) {
        mapped = mapped.filter(p => p.discount >= minDiscount);
      }
    }

    const effectiveSort = sort || (sortBy === 'price' ? (sortOrder === 'asc' ? 'priceLowToHigh' : 'priceHighToLow') : 'latest');
    if (effectiveSort === 'priceLowToHigh') {
      mapped.sort((a, b) => a.discountPrice - b.discountPrice);
    } else if (effectiveSort === 'priceHighToLow') {
      mapped.sort((a, b) => b.discountPrice - a.discountPrice);
    } else if (effectiveSort === 'latest') {
      mapped.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    const totalProducts = mapped.length;
    const paginated = mapped.slice(skip, skip + limitNum);

    return res.json({
      products: paginated,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalProducts / limitNum) || 1,
        totalProducts,
        limit: limitNum
      },
      hasMore: (skip + limitNum) < totalProducts,
      limit: limitNum
    });
  } catch (error) {
    console.error('getProducts error:', error);
    return res.status(500).json({ message: 'Error retrieving products.', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    let product;
    if (isPrismaConnected) {
      product = await prisma.product.findUnique({ where: { id } });
    } else {
      product = memoryDb.products.find(p => p.id === id);
    }

    if (!product) {
      return res.status(404).json({ message: `Product with ID '${id}' not found.` });
    }

    return res.json({ product: mapProductForUI(product) });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving product details.', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;

    if (!name || !description || price === undefined || stock === undefined || !category) {
      return res.status(400).json({ message: 'Name, description, price, stock, and category are required.' });
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);

    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ message: 'Price must be a positive number.' });
    }

    if (isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({ message: 'Stock must be a non-negative integer.' });
    }

    let product;
    if (isPrismaConnected) {
      product = await prisma.product.create({
        data: {
          name,
          description,
          price: priceNum,
          stock: stockNum,
          category,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=60'
        }
      });
    } else {
      product = {
        id: `p-${Date.now()}`,
        name,
        description,
        price: priceNum,
        stock: stockNum,
        category,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=60',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryDb.products.unshift(product);
    }

    return res.status(201).json({
      message: 'Product created successfully',
      product: mapProductForUI(product)
    });
  } catch (error) {
    console.error('createProduct error:', error);
    return res.status(500).json({ message: 'Error creating product.', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, imageUrl } = req.body;

    let existing;
    if (isPrismaConnected) {
      existing = await prisma.product.findUnique({ where: { id } });
    } else {
      existing = memoryDb.products.find(p => p.id === id);
    }

    if (!existing) {
      return res.status(404).json({ message: `Product with ID '${id}' not found.` });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum < 0) return res.status(400).json({ message: 'Invalid price.' });
      updateData.price = priceNum;
    }
    if (stock !== undefined) {
      const stockNum = parseInt(stock, 10);
      if (isNaN(stockNum) || stockNum < 0) return res.status(400).json({ message: 'Invalid stock count.' });
      updateData.stock = stockNum;
    }
    if (category !== undefined) updateData.category = category;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    updateData.updatedAt = new Date();

    let updatedProduct;
    if (isPrismaConnected) {
      updatedProduct = await prisma.product.update({
        where: { id },
        data: updateData
      });
    } else {
      const index = memoryDb.products.findIndex(p => p.id === id);
      memoryDb.products[index] = { ...memoryDb.products[index], ...updateData };
      updatedProduct = memoryDb.products[index];
    }

    return res.json({
      message: 'Product updated successfully',
      product: mapProductForUI(updatedProduct)
    });
  } catch (error) {
    console.error('updateProduct error:', error);
    return res.status(500).json({ message: 'Error updating product.', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let existing;
    if (isPrismaConnected) {
      existing = await prisma.product.findUnique({ where: { id } });
    } else {
      existing = memoryDb.products.find(p => p.id === id);
    }

    if (!existing) {
      return res.status(404).json({ message: `Product with ID '${id}' not found.` });
    }

    if (isPrismaConnected) {
      await prisma.product.delete({ where: { id } });
    } else {
      memoryDb.products = memoryDb.products.filter(p => p.id !== id);
    }

    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    return res.status(500).json({ message: 'Error deleting product.', error: error.message });
  }
};

// Cart and Wishlist Controllers
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productIds = memoryDb.carts[userId] || [];
    let products = [];
    if (isPrismaConnected) {
      products = await prisma.product.findMany({
        where: { id: { in: productIds } }
      });
    } else {
      products = memoryDb.products.filter(p => productIds.includes(p.id));
    }
    return res.json({ products: products.map(mapProductForUI) });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching cart.', error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    if (!memoryDb.carts[userId]) {
      memoryDb.carts[userId] = [];
    }
    if (!memoryDb.carts[userId].includes(productId)) {
      memoryDb.carts[userId].push(productId);
    }
    return res.json({ success: true, message: 'Added to cart.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding to cart.', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    if (memoryDb.carts[userId]) {
      memoryDb.carts[userId] = memoryDb.carts[userId].filter(id => id !== productId);
    }
    return res.json({ success: true, message: 'Removed from cart.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing from cart.', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    memoryDb.carts[userId] = [];
    return res.json({ success: true, message: 'Cart cleared.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error clearing cart.', error: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productIds = memoryDb.wishlists[userId] || [];
    let products = [];
    if (isPrismaConnected) {
      products = await prisma.product.findMany({
        where: { id: { in: productIds } }
      });
    } else {
      products = memoryDb.products.filter(p => productIds.includes(p.id));
    }
    return res.json({ products: products.map(mapProductForUI) });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching wishlist.', error: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    if (!memoryDb.wishlists[userId]) {
      memoryDb.wishlists[userId] = [];
    }
    if (!memoryDb.wishlists[userId].includes(productId)) {
      memoryDb.wishlists[userId].push(productId);
    }
    return res.json({ success: true, message: 'Added to wishlist.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding to wishlist.', error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    if (memoryDb.wishlists[userId]) {
      memoryDb.wishlists[userId] = memoryDb.wishlists[userId].filter(id => id !== productId);
    }
    return res.json({ success: true, message: 'Removed from wishlist.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing from wishlist.', error: error.message });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    memoryDb.wishlists[userId] = [];
    return res.json({ success: true, message: 'Wishlist cleared.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error clearing wishlist.', error: error.message });
  }
};

export const getSimilarProducts = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    let products = [];
    if (isPrismaConnected) {
      products = await prisma.product.findMany({
        where: {
          category: { equals: cid, mode: 'insensitive' },
          id: { not: pid }
        },
        take: 4
      });
    } else {
      products = memoryDb.products.filter(p => p.category.toLowerCase() === cid.toLowerCase() && p.id !== pid).slice(0, 4);
    }
    return res.json({ products: products.map(mapProductForUI) });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching similar products.', error: error.message });
  }
};
