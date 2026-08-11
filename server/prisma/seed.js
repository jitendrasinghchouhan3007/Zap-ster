import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database tables in PostgreSQL via Prisma...');

  // Clean existing tables safely
  try {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.log('Clean table warning:', e.message);
  }

  // 1. Seed Users
  const passHash = await bcrypt.hash('password123', 10);
  const usersData = [
    { name: 'System Admin', email: 'admin@zapster.com', password: passHash, role: 'ADMIN', mobile: '+91 98765 43210' },
    { name: 'Arjun Sharma', email: 'arjun.sharma@gmail.com', password: passHash, role: 'CUSTOMER', mobile: '+91 99887 76655' },
    { name: 'Priya Patel', email: 'priya.patel@outlook.com', password: passHash, role: 'CUSTOMER', mobile: '+91 91234 56789' },
    { name: 'Rahul Verma', email: 'rahul.verma@yahoo.com', password: passHash, role: 'CUSTOMER', mobile: '+91 87654 32109' },
    { name: 'Sneha Gupta', email: 'sneha.gupta@gmail.com', password: passHash, role: 'CUSTOMER', mobile: '+91 76543 21098' },
    { name: 'Vikram Singh', email: 'vikram.singh@zapster.com', password: passHash, role: 'CUSTOMER', mobile: '+91 65432 10987' },
    { name: 'Kavya Nair', email: 'kavya.nair@gmail.com', password: passHash, role: 'CUSTOMER', mobile: '+91 54321 09876' },
    { name: 'Mohan Das', email: 'mohan.das@rediffmail.com', password: passHash, role: 'CUSTOMER', mobile: '+91 43210 98765' },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const user = await prisma.user.create({ data: u });
    createdUsers.push(user);
  }
  console.log(`👤 Seeded ${createdUsers.length} Users into database.`);

  // 2. Seed Categories
  const categoriesData = [
    { name: 'Mobiles', slug: 'mobiles', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80' },
    { name: 'Laptops', slug: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80' },
    { name: 'Electronics', slug: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
    { name: 'Wearables', slug: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80' },
    { name: 'Accessories', slug: 'Accessories', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80' },
  ];

  for (const c of categoriesData) {
    await prisma.category.create({ data: c });
  }
  console.log(`🏷️ Seeded ${categoriesData.length} Categories into database.`);

  // 3. Seed Brands
  const brandsData = [
    { name: 'Apple', slug: 'Apple', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&auto=format&fit=crop&q=80' },
    { name: 'Samsung', slug: 'Samsung', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&auto=format&fit=crop&q=80' },
    { name: 'Sony', slug: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80' },
    { name: 'Dell', slug: 'Dell', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&auto=format&fit=crop&q=80' },
    { name: 'ASUS', slug: 'ASUS', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&auto=format&fit=crop&q=80' },
    { name: 'OnePlus', slug: 'OnePlus', image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&auto=format&fit=crop&q=80' },
  ];

  for (const b of brandsData) {
    await prisma.brand.create({ data: b });
  }
  console.log(`🏢 Seeded ${brandsData.length} Brands into database.`);

  // 4. Seed Products
  const productsData = [
    {
      name: 'AirPods Pro',
      description: 'Apple AirPods Pro (2nd Generation) with Active Noise Cancellation.',
      price: 249.00,
      stock: 20,
      category: 'Accessories',
      brand: 'Apple',
      imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: '14s 12th Gen',
      description: 'HP 14s Intel Core i5 12th Gen Thin & Light Laptop.',
      price: 650.00,
      stock: 12,
      category: 'Laptops',
      brand: 'Dell',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'iPad Air',
      description: 'Apple iPad Air M1 Chip with Liquid Retina Display.',
      price: 599.00,
      stock: 15,
      category: 'Electronics',
      brand: 'Apple',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Galaxy Tab S9',
      description: 'Samsung Galaxy Tab S9 Ultra AMOLED Display with S-Pen.',
      price: 799.00,
      stock: 8,
      category: 'Electronics',
      brand: 'Samsung',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Rockerz 450',
      description: 'boAt Rockerz 450 Bluetooth On-Ear Headphones with HD Sound.',
      price: 49.00,
      stock: 35,
      category: 'Accessories',
      brand: 'Sony',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Wanderer Smart Watch',
      description: 'Fitness tracker watch with heart rate sensor and 14-day battery.',
      price: 89.00,
      stock: 25,
      category: 'Wearables',
      brand: 'Sony',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const createdProducts = [];
  for (const p of productsData) {
    const prod = await prisma.product.create({ data: p });
    createdProducts.push(prod);
  }
  console.log(`📦 Seeded ${createdProducts.length} Products into database.`);

  // 5. Seed Order
  const customerUser = createdUsers[1];
  const order = await prisma.order.create({
    data: {
      userId: customerUser.id,
      totalAmount: 298.00,
      status: 'PENDING',
      items: {
        create: [
          { productId: createdProducts[0].id, quantity: 1, unitPrice: createdProducts[0].price },
          { productId: createdProducts[4].id, quantity: 1, unitPrice: createdProducts[4].price },
        ],
      },
    },
  });
  console.log(`🧾 Seeded sample order (${order.id}).`);

  console.log('✨ All tables seeded successfully in PostgreSQL!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
