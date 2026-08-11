import axios from 'axios';
import {
  AuthResponse,
  User,
  Product,
  Order,
  ProductsApiResponse,
  OrdersApiResponse,
  ProductFilterParams
} from '../types';

const API_BASE_URL = 'http://localhost:4545/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Authorization Bearer header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },

  register: async (name: string, email: string, password: string, role: string = 'CUSTOMER'): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', { name, email, password, role });
    return res.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const res = await api.get<{ user: User }>('/auth/me');
    return res.data;
  }
};

// Product Services
export const productService = {
  getProducts: async (params: ProductFilterParams = {}): Promise<ProductsApiResponse> => {
    const res = await api.get<ProductsApiResponse>('/products', { params });
    return res.data;
  },

  getProductById: async (id: string): Promise<{ product: Product }> => {
    const res = await api.get<{ product: Product }>(`/products/${id}`);
    return res.data;
  },

  createProduct: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ message: string; product: Product }> => {
    const res = await api.post<{ message: string; product: Product }>('/products', productData);
    return res.data;
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<{ message: string; product: Product }> => {
    const res = await api.put<{ message: string; product: Product }>(`/products/${id}`, productData);
    return res.data;
  },

  deleteProduct: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/products/${id}`);
    return res.data;
  }
};

// Order Services
export const orderService = {
  createOrder: async (items: Array<{ productId: string; quantity: number }>): Promise<{ message: string; order: Order }> => {
    const res = await api.post<{ message: string; order: Order }>('/orders', { items });
    return res.data;
  },

  getOrders: async (params: { status?: string; page?: number; limit?: number } = {}): Promise<OrdersApiResponse> => {
    const res = await api.get<OrdersApiResponse>('/orders', { params });
    return res.data;
  },

  getOrderById: async (id: string): Promise<{ order: Order }> => {
    const res = await api.get<{ order: Order }>(`/orders/${id}`);
    return res.data;
  },

  cancelOrder: async (id: string): Promise<{ message: string; order: Order }> => {
    const res = await api.patch<{ message: string; order: Order }>(`/orders/${id}/cancel`);
    return res.data;
  }
};

export default api;
