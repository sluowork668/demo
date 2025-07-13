// src/services/productApi.ts

// This file contains API functions for product management, including creating products and uploading images

import api from '../utils/api';

// Interface for product creation request
export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  images: File[];
}

// Interface for product response
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  sellerId: number;
  sellerUsername: string; // 添加卖家用户名
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  createdAt: string;
  updatedAt: string;
}

// Create product API call
export const createProductApi = async (data: CreateProductRequest): Promise<Product> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('price', data.price.toString());
  formData.append('category', 'Electronics'); // 默认分类，后续可以添加分类选择
  
  // Append each image file
  data.images.forEach((image) => {
    formData.append('images', image);
  });

  const response = await api.post("/items", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Get product by ID
export const getProductApi = (id: string): Promise<Product> => {
  return api.get(`/items/${id}`).then((res) => res.data);
};

// Get products list with filters
export const getProductsApi = (params?: {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  page?: number;
  size?: number;
}): Promise<{
  total: number;
  page: number;
  size: number;
  items: Product[];
}> => {
  return api.get("/items", { params }).then((res) => res.data);
};

// Delete product by ID
export const deleteProductApi = (id: string): Promise<void> => {
  return api.delete(`/items/${id}`).then((res) => res.data);
}; 