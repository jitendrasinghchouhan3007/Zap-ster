# 🛍️ Zapster E-Commerce Platform

A full-stack e-commerce web application built with **React + Vite** (frontend) and **Node.js + Express + PostgreSQL (via Prisma)** (backend).

---

## 🚀 Features

- 🔐 JWT Authentication (Register / Login / Admin)
- 🛒 Product Browsing, Cart & Wishlist
- 📦 Order Placement & Management
- 🏷️ Category & Brand Management
- 👑 Admin Dashboard (Products, Users, Orders, Categories, Brands)
- 📱 Fully Responsive Design
- 🗄️ PostgreSQL database via Prisma ORM (Supabase hosted)

---

## 📁 Folder Structure

```
Zapster-Ecommerce/
├── client/                     # React + Vite Frontend
│   ├── public/
│   └── src/
│       ├── components/         # Reusable UI components
│       │   ├── Admin/          # Admin panel components
│       │   └── Layout/         # Header, Footer, etc.
│       ├── context/            # Auth context (React Context API)
│       ├── pages/
│       │   ├── Admin/          # Admin pages (Dashboard, Products, Users...)
│       │   ├── MainPages/      # Public pages (Home, Login, Register...)
│       │   └── Profile/        # User profile pages
│       ├── App.jsx
│       └── main.jsx
│
└── server/                     # Node.js + Express Backend
    ├── prisma/
    │   ├── schema.prisma       # Database schema
    │   └── seed.js             # Sample seed data
    ├── src/
    │   ├── controllers/        # Route handlers
    │   ├── db/                 # Prisma client setup
    │   ├── middleware/         # Auth middleware (JWT verify)
    │   └── routes/             # Express route definitions
    ├── seed.js                 # Root-level seed script
    ├── index.js                # Main Express server entry point
    ├── .env.example            # Environment variable template
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **PostgreSQL** database (or use the provided Supabase URL)

---

## 🛠️ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/zapster-ecommerce.git
cd zapster-ecommerce
```

### 2. Setup the Backend (Server)

```bash
cd server
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your actual values (see `.env.example` for reference).

Generate Prisma client and push schema to database:

```bash
npm run prisma:generate
npm run db:push
```

Seed the database with sample data:

```bash
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

Server runs at: **http://localhost:4545**

---

### 3. Setup the Frontend (Client)

Open a **new terminal**:

```bash
cd client
npm install
```

Copy the environment file:

```bash
cp .env.example .env
```

Start the frontend dev server:

```bash
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | `admin@zapster.com` | `Admin@123` |
| 👤 Customer | `rahul@gmail.com` | `User@123` |
| 👤 Customer | `priya@gmail.com` | `User@123` |
| 👤 Customer | `amit@gmail.com` | `User@123` |
| 👤 Customer | `sneha@gmail.com` | `User@123` |

---

## 🗄️ Database Schema

The database uses **PostgreSQL** managed via **Prisma ORM**.

### Models

| Model | Description |
|-------|-------------|
| `User` | Stores user accounts with roles (ADMIN / CUSTOMER) |
| `Product` | E-commerce products with price, stock, category, brand |
| `Category` | Product categories with slug and image |
| `Brand` | Product brands with slug and image |
| `Order` | Customer orders with status (PENDING / COMPLETED / CANCELLED) |
| `OrderItem` | Line items within an order (product + quantity + price) |

See full schema: [`server/prisma/schema.prisma`](./server/prisma/schema.prisma)

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register a new user | ❌ |
| POST | `/api/v1/auth/login` | Login & get JWT token | ❌ |
| GET | `/api/v1/auth/me` | Get current user profile | ✅ |
| GET | `/api/v1/auth/all-users` | Get all users (admin) | ✅ |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/product/all-products` | Get all products (paginated) | ❌ |
| GET | `/api/v1/product/featured-products` | Get featured products | ❌ |
| POST | `/api/v1/product/create-product` | Create a product (admin) | ✅ |
| DELETE | `/api/v1/product/delete-product/:id` | Delete a product (admin) | ✅ |

### Categories & Brands
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/category/all-categories` | Get all categories | ❌ |
| POST | `/api/v1/category/create-category` | Create category (admin) | ✅ |
| GET | `/api/v1/brand/all-brands` | Get all brands | ❌ |
| POST | `/api/v1/brand/create-brand` | Create brand (admin) | ✅ |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/order/create-order` | Place an order | ✅ |
| GET | `/api/v1/auth/myOrders` | Get user's orders | ✅ |
| GET | `/api/v1/order/all-orders` | Get all orders (admin) | ✅ |

---

## 🧪 Running the Seed

```bash
cd server
node seed.js
```

This creates 1 admin + 4 customer accounts with hashed passwords.

---

## 📬 Postman Collection

Import the file [`Zapster-API.postman_collection.json`](./Zapster-API.postman_collection.json) into Postman to test all API endpoints.

---

## 🛡️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| State | React Context API + TanStack Query |

---

## 📄 License

MIT © 2026 Zapster
