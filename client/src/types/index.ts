export type Role = 'ADMIN' | 'CUSTOMER';
export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  createdAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalProducts?: number;
  totalOrders?: number;
  limit: number;
}

export interface ProductsApiResponse {
  products: Product[];
  pagination: PaginationMeta;
}

export interface OrdersApiResponse {
  orders: Order[];
  pagination: PaginationMeta;
}

export interface ProductFilterParams {
  search?: string;
  category?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
