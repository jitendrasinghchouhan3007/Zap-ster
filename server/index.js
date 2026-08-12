import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import { memoryDb, isPrismaConnected, prisma } from './src/db/prisma.js';
import { verifyToken } from './src/middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup for in-memory admin uploads (no disk write needed for stubs)
const upload = multer({ storage: multer.memoryStorage() });

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4545;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health & System Info Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    system: 'E-Commerce Product & Order Management System API',
    version: '1.0.0'
  });
});

// --- Legacy Frontend Compatibility Stub Endpoints ---

// Categories: /api/v1/category/all-categories
const CATEGORIES = [
  {
    _id: 'cat-mobiles',
    name: 'Mobiles',
    slug: 'mobiles',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80'
  },
  {
    _id: 'cat-laptops',
    name: 'Laptops',
    slug: 'Laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'
  },
  {
    _id: 'cat-electronics',
    name: 'Electronics',
    slug: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
  },
  {
    _id: 'cat-wearables',
    name: 'Wearables',
    slug: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
  },
  {
    _id: 'cat-accessories',
    name: 'Accessories',
    slug: 'Accessories',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80'
  },
];

app.get('/api/v1/category/all-categories', (req, res) => {
  const limitVal = parseInt(req.query.limit) || 20;
  const pageVal = parseInt(req.query.page);
  const skipVal = !isNaN(pageVal) ? (pageVal - 1) * limitVal : (parseInt(req.query.skip) || 0);

  // Deduplicate by _id / name and preserve newest order
  const uniqueMap = new Map();
  [...CATEGORIES].reverse().forEach(c => {
    const key = c._id || c.name.toLowerCase();
    if (!uniqueMap.has(key)) uniqueMap.set(key, c);
  });
  const list = Array.from(uniqueMap.values());

  const page = list.slice(skipVal, skipVal + limitVal);
  res.json({ categories: page, hasMore: skipVal + limitVal < list.length, limit: limitVal, total: list.length });
});

// Create category (admin)
app.post('/api/v1/category/create-category', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = req.file
      ? `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80`
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

    let newCat = { _id: `cat-${Date.now()}`, name, slug, image: imageUrl };

    if (isPrismaConnected) {
      try {
        const created = await prisma.category.create({
          data: { name, slug, image: imageUrl }
        });
        newCat._id = created.id;
      } catch (err) {
        if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Category Already Exists' });
      }
    }
    CATEGORIES.unshift(newCat);
    return res.status(201).json({ success: true, message: 'New category created', category: newCat });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Error creating category', error: e.message });
  }
});

// Update category (admin) - in-memory stub
app.put('/api/v1/category/update-category/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const idx = CATEGORIES.findIndex(c => c._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Category not found' });
    CATEGORIES[idx] = { ...CATEGORIES[idx], name, slug: name.toLowerCase().replace(/\s+/g, '-') };
    return res.status(200).json({ success: true, message: 'Category updated successfully', category: CATEGORIES[idx] });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to update category', error: e.message });
  }
});

// Delete category (admin) - in-memory stub
app.delete('/api/v1/category/delete-category/:id', (req, res) => {
  try {
    const { id } = req.params;
    const idx = CATEGORIES.findIndex(c => c._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Category not found' });
    const deleted = CATEGORIES.splice(idx, 1)[0];
    return res.status(200).json({ success: true, message: 'Category deleted successfully', category: deleted });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to delete category', error: e.message });
  }
});

// Get single category by slug
app.get('/api/v1/category/:slug', (req, res) => {
  const { slug } = req.params;
  const category = CATEGORIES.find(c => c.slug === slug || c._id === slug);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  return res.json({ success: true, category });
});

// Brands: /api/v1/brand/all-brands
const BRANDS = [
  { _id: 'brand-apple', name: 'Apple', slug: 'Apple', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&auto=format&fit=crop&q=80' },
  { _id: 'brand-samsung', name: 'Samsung', slug: 'Samsung', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&auto=format&fit=crop&q=80' },
  { _id: 'brand-sony', name: 'Sony', slug: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80' },
  { _id: 'brand-dell', name: 'Dell', slug: 'Dell', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&auto=format&fit=crop&q=80' },
  { _id: 'brand-asus', name: 'ASUS', slug: 'ASUS', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&auto=format&fit=crop&q=80' },
  { _id: 'brand-oneplus', name: 'OnePlus', slug: 'OnePlus', image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&auto=format&fit=crop&q=80' },
];

app.get('/api/v1/brand/all-brands', (req, res) => {
  const limitVal = parseInt(req.query.limit) || 20;
  const pageVal = parseInt(req.query.page);
  const skipVal = !isNaN(pageVal) ? (pageVal - 1) * limitVal : (parseInt(req.query.skip) || 0);

  // Deduplicate by _id / name and preserve newest order
  const uniqueMap = new Map();
  [...BRANDS].reverse().forEach(b => {
    const key = b._id || b.name.toLowerCase();
    if (!uniqueMap.has(key)) uniqueMap.set(key, b);
  });
  const list = Array.from(uniqueMap.values());

  const page = list.slice(skipVal, skipVal + limitVal);
  res.json({ brands: page, hasMore: skipVal + limitVal < list.length, limit: limitVal, total: list.length });
});

// Create brand (admin)
app.post('/api/v1/brand/create-brand', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const imageUrl = 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&auto=format&fit=crop&q=80';

    let newBrand = { _id: `brand-${Date.now()}`, name, slug, image: imageUrl };

    if (isPrismaConnected) {
      try {
        const created = await prisma.brand.create({
          data: { name, slug, image: imageUrl }
        });
        newBrand._id = created.id;
      } catch (err) {
        if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Brand Already Exists' });
      }
    }
    BRANDS.unshift(newBrand);
    return res.status(201).json({ success: true, message: 'New brand created', brand: newBrand });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Error creating brand', error: e.message });
  }
});

// Update brand (admin) - in-memory stub
app.put('/api/v1/brand/update-brand/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const idx = BRANDS.findIndex(b => b._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Brand not found' });
    BRANDS[idx] = { ...BRANDS[idx], name, slug: name.toLowerCase().replace(/\s+/g, '-') };
    return res.status(200).json({ success: true, message: 'Brand updated successfully', brand: BRANDS[idx] });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to update brand', error: e.message });
  }
});

// Delete brand (admin) - in-memory stub
app.delete('/api/v1/brand/delete-brand/:id', (req, res) => {
  try {
    const { id } = req.params;
    const idx = BRANDS.findIndex(b => b._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Brand not found' });
    const deleted = BRANDS.splice(idx, 1)[0];
    return res.status(200).json({ success: true, message: 'Brand deleted successfully', brand: deleted });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to delete brand', error: e.message });
  }
});

// Get brand details by slug/name
app.get('/api/v1/brand/:slug', (req, res) => {
  const { slug } = req.params;
  const brand = BRANDS.find(b => b.name.toLowerCase() === slug.toLowerCase() || b._id.toLowerCase().includes(slug.toLowerCase())) || {
    _id: `brand-${slug}`,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    slug: slug,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&auto=format&fit=crop&q=80'
  };
  return res.json({ brand });
});

const getBrandName = (p) => {
  const nameLower = p.name.toLowerCase();
  if (nameLower.includes('apple') || nameLower.includes('macbook') || nameLower.includes('iphone') || nameLower.includes('ipad') || nameLower.includes('apple watch')) return 'Apple';
  if (nameLower.includes('samsung') || nameLower.includes('galaxy')) return 'Samsung';
  if (nameLower.includes('sony')) return 'Sony';
  if (nameLower.includes('oneplus')) return 'OnePlus';
  if (nameLower.includes('dell') || nameLower.includes('xps')) return 'Dell';
  if (nameLower.includes('asus') || nameLower.includes('rog') || nameLower.includes('zephyrus')) return 'ASUS';
  if (nameLower.includes('hp') || nameLower.includes('spectre')) return 'HP';
  if (nameLower.includes('pixel')) return 'Google';
  return p.category || 'Zapster';
};

// Helper to map product for UI with deterministic rating & discount
const mapProductForUI = (p) => {
  if (!p) return null;
  const brandName = getBrandName(p);
  const charSum = (p.id || p.name).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const ratingVal = parseFloat((4.0 + (charSum % 10) * 0.1).toFixed(1));
  const discountVal = 10 + (charSum % 5) * 10; // 10%, 20%, 30%, 40%, 50%
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

// Helper to apply filters to product list
const applyProductFilters = (products, { sort, rating, discount, keyword }) => {
  let result = [...products];

  if (keyword && keyword.trim()) {
    const q = keyword.trim().toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.name.toLowerCase().includes(q)
    );
  }

  if (rating) {
    const minRating = parseFloat(rating);
    if (!isNaN(minRating)) {
      result = result.filter(p => p.ratings.averageRating >= minRating);
    }
  }

  if (discount) {
    const minDiscount = parseFloat(discount);
    if (!isNaN(minDiscount)) {
      result = result.filter(p => p.discount >= minDiscount);
    }
  }

  if (sort) {
    if (sort === 'priceLowToHigh') {
      result.sort((a, b) => a.discountPrice - b.discountPrice);
    } else if (sort === 'priceHighToLow') {
      result.sort((a, b) => b.discountPrice - a.discountPrice);
    } else if (sort === 'latest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
  }

  return result;
};

// Featured products
app.get('/api/v1/product/featured-products', async (req, res) => {
  try {
    let products = [];
    if (isPrismaConnected) {
      products = await prisma.product.findMany({ take: 8, orderBy: { createdAt: 'desc' } });
    } else {
      // Newest first for featured
    products = [...memoryDb.products].reverse().slice(0, 8);
    }
    return res.json({ products: products.map(mapProductForUI) });
  } catch (e) {
    return res.status(500).json({ message: 'Error fetching featured products.' });
  }
});

// Products by category (with filters)
app.get('/api/v1/product/productsByCategory/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { sort, rating, discount, keyword } = req.query;

    let products = [];
    if (isPrismaConnected) {
      products = await prisma.product.findMany({
        where: { category: { contains: category, mode: 'insensitive' } }
      });
    } else {
      products = memoryDb.products.filter(p =>
        p.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    let mapped = products.map(mapProductForUI);
    mapped = applyProductFilters(mapped, { sort, rating, discount, keyword });
    return res.json({ products: mapped });
  } catch (e) {
    return res.status(500).json({ message: 'Error fetching products by category.' });
  }
});

// Products by brand (with filters)
app.get('/api/v1/product/productsByBrand/:brand', async (req, res) => {
  try {
    const { brand } = req.params;
    const { sort, rating, discount, keyword } = req.query;

    let allProducts = [];
    if (isPrismaConnected) {
      allProducts = await prisma.product.findMany();
    } else {
      allProducts = [...memoryDb.products];
    }

    let mapped = allProducts.map(mapProductForUI);
    const bLower = brand.toLowerCase();
    let filtered = mapped.filter(p =>
      p.brand.name.toLowerCase() === bLower ||
      p.name.toLowerCase().includes(bLower)
    );

    filtered = applyProductFilters(filtered, { sort, rating, discount, keyword });
    return res.json({ products: filtered });
  } catch (e) {
    return res.status(500).json({ message: 'Error fetching products by brand.' });
  }
});

// Create order alias for frontend
app.post('/api/v1/product/create-order', verifyToken, async (req, res, next) => {
  req.url = '/';
  // Forward to order routes handler via app
  app._router.handle({ ...req, url: '/', path: '/', originalUrl: '/api/orders' }, res, next);
});

// Create product (admin)
app.post('/api/v1/product/create-product', upload.array('images'), async (req, res) => {
  try {
    const { name, description, originalPrice, discount, category, brand, quantity } = req.body;
    if (!name || !description || !originalPrice || !category) {
      return res.status(400).json({ success: false, message: 'Name, description, price, and category are required' });
    }
    const discountVal = parseFloat(discount) || 10;
    const origPrice = parseFloat(originalPrice);
    const discountPrice = Math.round(origPrice * (1 - discountVal / 100));
    const imageUrl = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';

    let newProduct = {
      id: `prod-${Date.now()}`,
      name,
      description,
      price: discountPrice,
      imageUrl,
      category,
      brand: brand || '',
      stock: parseInt(quantity) || 10,
      createdAt: new Date().toISOString(),
    };

    if (isPrismaConnected) {
      const created = await prisma.product.create({
        data: {
          name,
          description,
          price: discountPrice,
          stock: parseInt(quantity) || 10,
          category,
          brand: brand || '',
          imageUrl,
        }
      });
      newProduct.id = created.id;
    }
    memoryDb.products.unshift(newProduct);
    const mapped = mapProductForUI(newProduct);
    return res.status(201).json({ success: true, message: 'Product created successfully', product: mapped });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Error creating product', error: e.message });
  }
});

// Update product (admin) - Prisma + memoryDb
app.put('/api/v1/product/update-product/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, description, originalPrice, discount, category, brand, quantity } = req.body;

    if (isPrismaConnected) {
      const existing = await prisma.product.findFirst({
        where: { OR: [{ id: slug }, { name: { equals: slug, mode: 'insensitive' } }] }
      });
      if (!existing) return res.status(404).json({ success: false, message: 'Product not found' });

      const updateData = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (originalPrice) {
        const origPrice = parseFloat(originalPrice);
        const discountVal = parseFloat(discount) || 10;
        updateData.price = Math.round(origPrice * (1 - discountVal / 100));
      }
      if (category) updateData.category = category;
      if (quantity) updateData.stock = parseInt(quantity) || existing.stock;

      const updated = await prisma.product.update({ where: { id: existing.id }, data: updateData });
      return res.status(200).json({ success: true, message: 'Product updated', product: mapProductForUI(updated) });
    }

    const idx = memoryDb.products.findIndex(p => p.id === slug || p.name.toLowerCase().replace(/\s+/g, '-') === slug);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
    memoryDb.products[idx] = { ...memoryDb.products[idx], ...req.body };
    return res.status(200).json({ success: true, message: 'Product updated', product: mapProductForUI(memoryDb.products[idx]) });
  } catch (e) {
    console.error('Update product error:', e);
    return res.status(500).json({ success: false, message: 'Failed to update product', error: e.message });
  }
});

// Delete product (admin) - Prisma + memoryDb
app.delete('/api/v1/product/delete/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    if (isPrismaConnected) {
      const existing = await prisma.product.findFirst({
        where: { OR: [{ id: productId }, { name: { equals: productId, mode: 'insensitive' } }] }
      });
      if (!existing) return res.status(404).json({ success: false, message: 'Product not found' });
      await prisma.product.delete({ where: { id: existing.id } });
      return res.status(200).json({ success: true, message: 'Product deleted successfully', product: mapProductForUI(existing) });
    }

    const idx = memoryDb.products.findIndex(p => p.id === productId);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
    const deleted = memoryDb.products.splice(idx, 1)[0];
    return res.status(200).json({ success: true, message: 'Product deleted successfully', product: mapProductForUI(deleted) });
  } catch (e) {
    console.error('Delete product error:', e);
    return res.status(500).json({ success: false, message: 'Failed to delete product', error: e.message });
  }
});

// All products with filters and pagination (newest first)
app.get('/api/v1/product/all-products', async (req, res) => {
  try {
    const { sort, rating, discount, keyword } = req.query;
    const limitVal = parseInt(req.query.limit) || 8;
    const skipVal = parseInt(req.query.skip) || 0;
    let products = [];
    if (isPrismaConnected) {
      products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    } else {
      // Newest first: reverse so newly created products appear at top
      products = [...memoryDb.products].reverse();
    }
    let mapped = products.map(mapProductForUI);
    mapped = applyProductFilters(mapped, { sort, rating, discount, keyword });
    const paginated = mapped.slice(skipVal, skipVal + limitVal);
    return res.json({
      products: paginated,
      total: mapped.length,
      hasMore: skipVal + limitVal < mapped.length,
      limit: limitVal,
    });
  } catch (e) {
    return res.status(500).json({ message: 'Error fetching products.' });
  }
});

// All users (admin) - in-memory stub with rich demo data
const DEMO_USERS = [
  {
    _id: 'u-admin-1',
    fullname: 'System Admin',
    email: 'admin@zapster.com',
    mobile: '+91 98765 43210',
    role: 'ADMIN',
    profilePicture: 'https://i.pravatar.cc/150?img=1',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    _id: 'u-customer-1',
    fullname: 'Arjun Sharma',
    email: 'arjun.sharma@gmail.com',
    mobile: '+91 99887 76655',
    role: 'CUSTOMER',
    profilePicture: 'https://i.pravatar.cc/150?img=3',
    createdAt: new Date('2024-02-10').toISOString(),
  },
  {
    _id: 'u-customer-2',
    fullname: 'Priya Patel',
    email: 'priya.patel@outlook.com',
    mobile: '+91 91234 56789',
    role: 'CUSTOMER',
    profilePicture: 'https://i.pravatar.cc/150?img=5',
    createdAt: new Date('2024-03-05').toISOString(),
  },
  {
    _id: 'u-customer-3',
    fullname: 'Rahul Verma',
    email: 'rahul.verma@yahoo.com',
    mobile: '+91 87654 32109',
    role: 'CUSTOMER',
    profilePicture: 'https://i.pravatar.cc/150?img=7',
    createdAt: new Date('2024-04-20').toISOString(),
  },
  {
    _id: 'u-customer-4',
    fullname: 'Sneha Gupta',
    email: 'sneha.gupta@gmail.com',
    mobile: '+91 76543 21098',
    role: 'CUSTOMER',
    profilePicture: 'https://i.pravatar.cc/150?img=9',
    createdAt: new Date('2024-05-12').toISOString(),
  },
  {
    _id: 'u-customer-5',
    fullname: 'Vikram Singh',
    email: 'vikram.singh@zapster.com',
    mobile: '+91 65432 10987',
    role: 'CUSTOMER',
    profilePicture: 'https://i.pravatar.cc/150?img=11',
    createdAt: new Date('2024-06-01').toISOString(),
  },
  {
    _id: 'u-customer-6',
    fullname: 'Kavya Nair',
    email: 'kavya.nair@gmail.com',
    mobile: '+91 54321 09876',
    role: 'CUSTOMER',
    profilePicture: 'https://i.pravatar.cc/150?img=20',
    createdAt: new Date('2024-07-15').toISOString(),
  },
  {
    _id: 'u-customer-7',
    fullname: 'Mohan Das',
    email: 'mohan.das@rediffmail.com',
    mobile: '+91 43210 98765',
    role: 'CUSTOMER',
    profilePicture: 'https://i.pravatar.cc/150?img=15',
    createdAt: new Date('2024-08-03').toISOString(),
  },
];

app.get('/api/v1/auth/all-users', async (req, res) => {
  try {
    let usersList = [];
    if (isPrismaConnected) {
      const dbUsers = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
      usersList = dbUsers.map(u => ({
        _id: u.id,
        fullname: u.name,
        email: u.email,
        mobile: u.mobile || '+91 98765 43210',
        role: u.role,
        profilePicture: u.profilePicture,
        createdAt: u.createdAt
      }));
    } else {
      usersList = [...DEMO_USERS].reverse();
    }
    return res.json({ success: true, data: usersList, total: usersList.length });
  } catch (e) {
    return res.json({ success: true, data: DEMO_USERS, total: DEMO_USERS.length });
  }
});

// API Routes with aliases for seamless frontend compatibility
app.use('/api/auth', authRoutes);
app.use('/api/v1/auth', authRoutes);

app.use('/api/products', productRoutes);
app.use('/api/product', productRoutes);
app.use('/api/v1/product', productRoutes);

app.use('/api/orders', orderRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/v1/order', orderRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route '${req.originalUrl}' not found on server.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 E-Commerce Backend running on http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
