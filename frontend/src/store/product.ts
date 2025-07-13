import { create } from 'zustand';
import { Product, CreateProductRequest, createProductApi, getProductsApi, getProductApi, deleteProductApi } from '../services/productApi';
import { mockCreateProduct, mockGetProducts, mockProducts, mockDeleteProduct, getDynamicProductsForDetail } from '../services/mockData';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  createProduct: (data: CreateProductRequest) => Promise<void>;
  fetchProducts: (params?: any) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentProduct: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,

  createProduct: async (data: CreateProductRequest) => {
    try {
      set({ loading: true, error: null });
      const newProduct = await mockCreateProduct(data);
      
      // 新商品已经保存到localStorage，直接更新状态
      set((state) => ({
        products: [newProduct, ...state.products],
        loading: false,
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Failed to create product',
      });
      throw error;
    }
  },

  fetchProducts: async (params?: any) => {
    try {
      set({ loading: true, error: null });
      const response = await mockGetProducts(params);
      set({
        products: response.items,
        loading: false,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch products',
      });
    }
  },

  fetchProduct: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      // 从完整的商品列表中查找商品（包括localStorage中的用户商品）
      const allProducts = getDynamicProductsForDetail();
      const product = allProducts.find(p => p.id.toString() === id);
      
      if (product) {
        set({
          currentProduct: product,
          loading: false,
        });
      } else {
        set({
          loading: false,
          error: 'Product not found',
        });
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch product',
      });
    }
  },

  deleteProduct: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await mockDeleteProduct(id);
      
      // 从当前状态中移除商品
      set((state) => ({
        products: state.products.filter(product => product.id.toString() !== id),
        currentProduct: state.currentProduct?.id.toString() === id ? null : state.currentProduct,
        loading: false,
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Failed to delete product',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },
})); 