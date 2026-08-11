import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdmin() {
  const hashed = await bcrypt.hash('Admin@123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zapster.com' },
    update: { password: hashed, role: 'ADMIN', name: 'Super Admin' },
    create: { email: 'admin@zapster.com', password: hashed, role: 'ADMIN', name: 'Super Admin' }
  });
  
  console.log('✅ Admin reset:', admin.email, '| Role:', admin.role);
  console.log('🔑 Login: admin@zapster.com | Admin@123');
  await prisma.$disconnect();
}

resetAdmin().catch(e => { console.error(e); process.exit(1); });
