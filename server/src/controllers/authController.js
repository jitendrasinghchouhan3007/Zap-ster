import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { prisma, memoryDb, isPrismaConnected } from '../db/prisma.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-e-commerce-jwt-key-2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userRole = role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';

    // Check existing email
    let existingUser;
    if (isPrismaConnected) {
      existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    } else {
      existingUser = memoryDb.users.find(u => u.email === normalizedEmail);
    }

    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email address already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;

    if (isPrismaConnected) {
      newUser = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          password: hashedPassword,
          role: userRole
        }
      });
    } else {
      newUser = {
        id: `u-${Date.now()}`,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: userRole,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryDb.users.push(newUser);
    }

    const token = generateToken(newUser);
    const { password: _, ...userPayload } = newUser;

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userPayload
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user;
    if (isPrismaConnected) {
      user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    } else {
      user = memoryDb.users.find(u => u.email === normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    const { password: _, ...userPayload } = user;

    return res.json({
      message: 'Login successful',
      token,
      user: userPayload
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  return res.json({ user: req.user });
};
