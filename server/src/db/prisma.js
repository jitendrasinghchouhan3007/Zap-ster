import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

let db;
let isPrismaConnected = false;

// Initialize standard PrismaClient targeting PostgreSQL
const prisma = new PrismaClient();

// In-Memory Storage Fallback for zero-setup execution if PostgreSQL is unavailable
const memoryDb = {
  users: [
    {
      id: 'u-admin-1',
      name: 'System Admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'u-customer-1',
      name: 'John Customer',
      email: 'customer@example.com',
      password: await bcrypt.hash('customer123', 10),
      role: 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  products: [
    // ─── Mobiles ────────────────────────────────────────────────
    {
      id: 'p-mob-01',
      name: 'Galaxy S25 Ultra',
      description: '• 6.8" Dynamic AMOLED 2X display • Snapdragon 8 Elite processor • 200MP pro-grade camera system • 5000mAh battery with 45W fast charging • Built-in S Pen',
      price: 84999,
      stock: 20,
      category: 'mobiles',
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p-mob-02',
      name: 'iPhone 16 Pro Max',
      description: '• 6.9" Super Retina XDR OLED display • A18 Pro chip • 48MP Fusion camera with 5x optical zoom • Action Button & Camera Control • Titanium design',
      price: 134900,
      stock: 15,
      category: 'mobiles',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p-mob-03',
      name: 'OnePlus 12 5G',
      description: '• 6.82" LTPO AMOLED 120Hz display • Snapdragon 8 Gen 3 • Hasselblad-tuned triple camera • 5400mAh with 100W SUPERVOOC charging • OxygenOS 14',
      price: 64999,
      stock: 30,
      category: 'mobiles',
      imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p-mob-04',
      name: 'Pixel 9 Pro',
      description: '• 6.3" LTPO OLED display • Google Tensor G4 chip • 50MP main with Best Take, Magic Eraser • AI-powered assistant features • 7 years OS updates guaranteed',
      price: 79999,
      stock: 12,
      category: 'mobiles',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // ─── Laptops ─────────────────────────────────────────────────
    {
      id: 'p-lap-01',
      name: 'MacBook Pro 14" M4 Pro',
      description: '• M4 Pro chip with 12-core CPU and 20-core GPU • 14.2" Liquid Retina XDR display • 24GB unified memory • 512GB SSD • Up to 24 hours battery life',
      price: 199900,
      stock: 10,
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p-lap-02',
      name: 'Dell XPS 15 OLED',
      description: '• Intel Core Ultra 9 processor • 15.6" 3.5K OLED touch display • 32GB DDR5 RAM • NVIDIA GeForce RTX 4060 • 1TB NVMe SSD • Thunderbolt 4 ports',
      price: 159999,
      stock: 8,
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p-lap-03',
      name: 'ASUS ROG Zephyrus G16',
      description: '• AMD Ryzen AI 9 HX 370 • 16" QHD+ 240Hz ROG Nebula display • 32GB LPDDR5X RAM • RTX 4090 GPU • 1TB PCIe SSD • MUX Switch & Advanced Optimus',
      price: 219999,
      stock: 6,
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p-lap-04',
      name: 'HP Spectre x360 14',
      description: '• Intel Core Ultra 7 155H processor • 14" 2.8K OLED touch 2-in-1 display • 32GB RAM • 2TB SSD • Intel Arc graphics • Bang & Olufsen audio',
      price: 139999,
      stock: 14,
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // ─── Electronics ─────────────────────────────────────────────
    {
      id: 'p-ele-01',
      name: 'Sony WH-1000XM5',
      description: '• Industry-leading noise cancellation • 30-hour battery life • Multipoint connection (2 devices) • Crystal clear hands-free calling • Hi-Res Audio & LDAC',
      price: 24990,
      stock: 25,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p-ele-02',
      name: 'Samsung 55" Neo QLED 4K TV',
      description: '• 4K Neo QLED with Quantum HDR 32X • Real Depth Enhancer technology • Object Tracking Sound+ • 144Hz gaming mode • Smart TV with Tizen OS',
      price: 109990,
      stock: 7,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p-ele-03',
      name: 'iPad Pro 13" M4',
      description: '• M4 chip with 10-core CPU • Ultra Retina XDR OLED display (first ever) • Apple Pencil Pro support • Nano-texture glass option • 5G connectivity',
      price: 109900,
      stock: 18,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p-ele-04',
      name: 'Mechanical RGB Keyboard Pro',
      description: '• Full RGB per-key illumination with 16.8M colors • Hot-swappable switches • Aluminum top frame • USB-C detachable cable • 100% anti-ghosting',
      price: 8999,
      stock: 40,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p-ele-05',
      name: '27" QHD Gaming Monitor',
      description: '• 2560x1440 QHD IPS panel • 165Hz refresh rate • 1ms MPRT response time • AMD FreeSync Premium • HDR10 support • Height-adjustable stand',
      price: 29999,
      stock: 11,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // ─── Wearables ────────────────────────────────────────────────
    {
      id: 'p-wear-01',
      name: 'Apple Watch Ultra 2',
      description: '• 49mm titanium case • Ultra-bright 3000 nit always-on Retina display • Precision GPS with dual-frequency • 60-hour battery in Low Power Mode • Depth & temperature sensors',
      price: 89900,
      stock: 9,
      category: 'Wearables',
      imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p-wear-02',
      name: 'Galaxy Watch 7 Pro',
      description: '• Advanced health monitoring with BioActive Sensor 3.0 • 3nm Exynos W1000 chip • Sapphire crystal glass • 60-hour battery with 10W wireless charging • Titanium chassis',
      price: 44999,
      stock: 17,
      category: 'Wearables',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p-wear-03',
      name: 'Sony WF-1000XM5 TWS',
      description: '• World-class ANC with QN2e processor • 8-hour battery + 16-hour case • LDAC Hi-Res audio streaming • Multipoint pairing • IPX4 splash resistant',
      price: 19990,
      stock: 22,
      category: 'Wearables',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // ─── Accessories ──────────────────────────────────────────────
    {
      id: 'p-acc-01',
      name: '140W GaN USB-C Charger',
      description: '• 4-port design: 2x USB-C PD + 2x USB-A QC • 140W max output • GaN III technology for compact size • Universal compatibility • Dynamic power sharing',
      price: 4999,
      stock: 60,
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p-acc-02',
      name: 'MagSafe Leather Wallet Case',
      description: '• Full-grain Italian leather • MagSafe compatible magnetic attachment • RFID blocking • Holds up to 3 cards • Available in multiple colors • Wireless charging compatible',
      price: 2499,
      stock: 45,
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'p-acc-03',
      name: 'Webcam 4K HDR Pro',
      description: '• 4K 30fps / 1080p 60fps • Sony STARVIS sensor • AI-powered auto framing • Dual noise-canceling mics • HDR & low-light correction • USB-C plug-and-play',
      price: 12999,
      stock: 18,
      category: 'Accessories',
      imageUrl: 'https://images.unsplash.com/photo-1612630741022-b29ec5d6fbc6?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ],
  orders: [],
  orderItems: [],
  carts: {},
  wishlists: {}
};

// Seed initial demo orders into memoryDb
memoryDb.orders.push({
  id: 'ord-1001',
  userId: 'u-customer-1',
  user: memoryDb.users[1],
  totalAmount: 109897,
  status: 'PENDING',
  items: [
    {
      id: 'oi-1',
      orderId: 'ord-1001',
      productId: 'p-mob-01',
      product: memoryDb.products[0],
      quantity: 1,
      unitPrice: 84999,
    },
    {
      id: 'oi-2',
      orderId: 'ord-1001',
      productId: 'p-ele-01',
      product: memoryDb.products[8],
      quantity: 1,
      unitPrice: 24990,
    }
  ],
  createdAt: new Date(Date.now() - 3600000 * 5),
  updatedAt: new Date(Date.now() - 3600000 * 5)
});

// Attempt PostgreSQL connection check at startup
try {
  await prisma.$connect();
  isPrismaConnected = true;
  console.log('✅ Connected to PostgreSQL database via Prisma ORM.');
} catch (err) {
  isPrismaConnected = false;
  console.warn('⚠️  PostgreSQL connection unavailable. Falling back to active in-memory relational engine.');
}

export { prisma, memoryDb, isPrismaConnected };
