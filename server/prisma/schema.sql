-- =============================================
-- Zapster E-Commerce Platform
-- Database Schema (PostgreSQL)
-- =============================================
-- Generated from: server/prisma/schema.prisma
-- Run this ONLY if you are not using Prisma migrations.
-- Recommended: Use `npm run db:push` in the server folder instead.
-- =============================================

-- Enums
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CUSTOMER');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- Users table
CREATE TABLE "users" (
  "id"             TEXT        NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "name"           TEXT        NOT NULL,
  "email"          TEXT        NOT NULL,
  "password"       TEXT        NOT NULL,
  "role"           "Role"      NOT NULL DEFAULT 'CUSTOMER',
  "mobile"         TEXT,
  "profilePicture" TEXT,
  "createdAt"      TIMESTAMP   NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMP   NOT NULL DEFAULT NOW(),

  CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "users_email_key" UNIQUE ("email")
);

-- Products table
CREATE TABLE "products" (
  "id"          TEXT      NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "name"        TEXT      NOT NULL,
  "description" TEXT      NOT NULL,
  "price"       FLOAT     NOT NULL,
  "stock"       INT       NOT NULL,
  "category"    TEXT      NOT NULL,
  "brand"       TEXT,
  "imageUrl"    TEXT,
  "createdAt"   TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- Categories table
CREATE TABLE "categories" (
  "id"        TEXT      NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "name"      TEXT      NOT NULL,
  "slug"      TEXT      NOT NULL,
  "image"     TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT "categories_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "categories_name_key" UNIQUE ("name"),
  CONSTRAINT "categories_slug_key" UNIQUE ("slug")
);

-- Brands table
CREATE TABLE "brands" (
  "id"        TEXT      NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "name"      TEXT      NOT NULL,
  "slug"      TEXT      NOT NULL,
  "image"     TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT "brands_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "brands_name_key" UNIQUE ("name"),
  CONSTRAINT "brands_slug_key" UNIQUE ("slug")
);

-- Orders table
CREATE TABLE "orders" (
  "id"          TEXT          NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"      TEXT          NOT NULL,
  "totalAmount" FLOAT         NOT NULL,
  "status"      "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt"   TIMESTAMP     NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMP     NOT NULL DEFAULT NOW(),

  CONSTRAINT "orders_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "users"("id") ON DELETE CASCADE
);

-- Order Items table
CREATE TABLE "order_items" (
  "id"        TEXT      NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "orderId"   TEXT      NOT NULL,
  "productId" TEXT      NOT NULL,
  "quantity"  INT       NOT NULL,
  "unitPrice" FLOAT     NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT "order_items_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId")
    REFERENCES "orders"("id") ON DELETE CASCADE,
  CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId")
    REFERENCES "products"("id") ON DELETE RESTRICT
);

-- =============================================
-- Indexes for performance
-- =============================================
CREATE INDEX "orders_userId_idx" ON "orders"("userId");
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");
CREATE INDEX "products_category_idx" ON "products"("category");
CREATE INDEX "products_brand_idx" ON "products"("brand");
