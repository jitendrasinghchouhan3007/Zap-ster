import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { prisma, memoryDb, isPrismaConnected } from '../db/prisma.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-e-commerce-jwt-key-2026';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    let user;
    if (isPrismaConnected) {
      user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, role: true }
      });
    } else {
      user = memoryDb.users.find(u => u.id === decoded.id);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        user = userWithoutPassword;
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'User account no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden. Admin privileges are required to perform this action.' });
  }
  next();
};
