import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// =============================================
// SEED DATA
// =============================================

const users = [
  { name: 'Super Admin',  email: 'admin@zapster.com', password: 'Admin@123', role: 'ADMIN' },
  { name: 'Rahul Sharma', email: 'rahul@gmail.com',   password: 'User@123',  role: 'CUSTOMER' },
  { name: 'Priya Patel',  email: 'priya@gmail.com',   password: 'User@123',  role: 'CUSTOMER' },
  { name: 'Amit Kumar',   email: 'amit@gmail.com',    password: 'User@123',  role: 'CUSTOMER' },
  { name: 'Sneha Verma',  email: 'sneha@gmail.com',   password: 'User@123',  role: 'CUSTOMER' },
];

const categories = [
  { name: 'Mobiles',     slug: 'mobiles',     image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600' },
  { name: 'Laptops',     slug: 'laptops',     image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600' },
  { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
  { name: 'Wearables',   slug: 'wearables',   image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
  { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600' },
];

const brands = [
  { name: 'Apple',   slug: 'apple',   image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600' },
  { name: 'Samsung', slug: 'samsung', image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600' },
  { name: 'Sony',    slug: 'sony',    image: 'https://images.unsplash.com/photo-1511268559489-34b624fbfcf5?w=600' },
  { name: 'Dell',    slug: 'dell',    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600' },
  { name: 'Nike',    slug: 'nike',    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
];

const products = [
  {
    name: 'iPhone 15 Pro',
    description: 'Apple iPhone 15 Pro with A17 Pro chip, titanium design, and 48MP camera system.',
    price: 134900,
    stock: 25,
    category: 'Mobiles',
    brand: 'Apple',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484429be?w=600',
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung flagship with Snapdragon 8 Gen 3, 200MP camera, and S Pen support.',
    price: 129999,
    stock: 18,
    category: 'Mobiles',
    brand: 'Samsung',
    imageUrl: 'https://images.unsplash.com/photo-1707194083854-a81e69c3bb77?w=600',
  },
  {
    name: 'MacBook Pro 14" M3',
    description: 'Apple MacBook Pro with M3 chip, 14-inch Liquid Retina XDR display.',
    price: 198900,
    stock: 10,
    category: 'Laptops',
    brand: 'Apple',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
  },
  {
    name: 'Dell XPS 15',
    description: 'Dell XPS 15 with Intel Core i9, OLED display, and NVIDIA RTX 4070.',
    price: 189999,
    stock: 8,
    category: 'Laptops',
    brand: 'Dell',
    imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancelling wireless headphones with 30hr battery.',
    price: 29990,
    stock: 40,
    category: 'Electronics',
    brand: 'Sony',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Apple Watch with S9 chip, Double Tap gesture, and Always-On Retina display.',
    price: 41900,
    stock: 30,
    category: 'Wearables',
    brand: 'Apple',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
  },
  {
    name: 'Samsung Galaxy Watch 6',
    description: 'Samsung Galaxy Watch 6 with advanced health tracking and Wear OS.',
    price: 28999,
    stock: 22,
    category: 'Wearables',
    brand: 'Samsung',
    imageUrl: 'https://images.unsplash.com/photo-1579721606093-1e9fc2f41d3e?w=600',
  },
  {
    name: 'AirPods Pro (2nd Gen)',
    description: 'Apple AirPods Pro with Adaptive Audio, USB-C charging case.',
    price: 24900,
    stock: 50,
    category: 'Accessories',
    brand: 'Apple',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600',
  },
];

// =============================================
// SEED FUNCTION
// =============================================
async function seed() {
  console.log('🌱 Starting database seed...\n');

  // --- Users ---
  console.log('👤 Seeding users...');
  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      // Update password and role to ensure credentials are correct
      const hashed = await bcrypt.hash(u.password, 10);
      await prisma.user.update({
        where: { email: u.email },
        data: { password: hashed, role: u.role, name: u.name }
      });
      console.log(`  ↻ Updated  [${u.role.padEnd(8)}] ${u.name} — ${u.email}`);
    } else {
      const hashed = await bcrypt.hash(u.password, 10);
      await prisma.user.create({
        data: { name: u.name, email: u.email, password: hashed, role: u.role }
      });
      console.log(`  ✅ Created  [${u.role.padEnd(8)}] ${u.name} — ${u.email}`);
    }
  }

  // --- Categories ---
  console.log('\n🏷️  Seeding categories...');
  for (const c of categories) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: { slug: c.slug, image: c.image },
      create: { name: c.name, slug: c.slug, image: c.image },
    });
    console.log(`  ✅ ${c.name}`);
  }

  // --- Brands ---
  console.log('\n🏢 Seeding brands...');
  for (const b of brands) {
    await prisma.brand.upsert({
      where: { name: b.name },
      update: { slug: b.slug, image: b.image },
      create: { name: b.name, slug: b.slug, image: b.image },
    });
    console.log(`  ✅ ${b.name}`);
  }

  // --- Products ---
  console.log('\n📦 Seeding products...');
  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({ data: p });
      console.log(`  ✅ ${p.name} — ₹${p.price.toLocaleString('en-IN')}`);
    } else {
      console.log(`  ⚠️  Skipped (exists) ${p.name}`);
    }
  }

  // --- Summary ---
  console.log('\n🎉 Seeding complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 LOGIN CREDENTIALS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👑 ADMIN    : admin@zapster.com  | Admin@123');
  console.log('👤 Customer : rahul@gmail.com    | User@123');
  console.log('👤 Customer : priya@gmail.com    | User@123');
  console.log('👤 Customer : amit@gmail.com     | User@123');
  console.log('👤 Customer : sneha@gmail.com    | User@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
