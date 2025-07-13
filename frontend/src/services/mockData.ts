// src/services/mockData.ts

// Mock data for development when backend is not available

import { Product } from './productApi';

// 初始静态商品数据
const initialMockProducts: Product[] = [
  {
    id: 1,
    title: 'iPhone 13 Pro - Excellent Condition',
    description: 'iPhone 13 Pro in excellent condition. 256GB storage, Pacific Blue. Includes original box and charger. No scratches or damage.',
    price: 799.99,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'
    ],
    sellerId: 123,
    sellerUsername: 'techseller',
    status: 'AVAILABLE',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'MacBook Air M1 - Like New',
    description: 'MacBook Air with M1 chip, 8GB RAM, 256GB SSD. Purchased 6 months ago, barely used. Perfect for students or professionals.',
    price: 899.99,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop'
    ],
    sellerId: 456,
    sellerUsername: 'macseller',
    status: 'AVAILABLE',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z'
  },
  {
    id: 3,
    title: 'Nike Air Jordan 1 Retro High',
    description: 'Nike Air Jordan 1 Retro High OG in Chicago colorway. Size 10, worn only a few times. Original box included.',
    price: 299.99,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop'
    ],
    sellerId: 789,
    sellerUsername: 'sneakerhead',
    status: 'AVAILABLE',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: 4,
    title: 'Sony WH-1000XM4 Headphones',
    description: 'Sony WH-1000XM4 wireless noise-canceling headphones. Excellent sound quality, great battery life. Includes carrying case.',
    price: 249.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    sellerId: 101,
    sellerUsername: 'audiofan',
    status: 'SOLD',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: 5,
    title: 'Canon EOS R6 Camera Body',
    description: 'Canon EOS R6 mirrorless camera body. Excellent condition, low shutter count. Perfect for photography enthusiasts.',
    price: 1899.99,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop'
    ],
    sellerId: 202,
    sellerUsername: 'photographer',
    status: 'RESERVED',
    createdAt: '2024-01-11T11:30:00Z',
    updatedAt: '2024-01-11T11:30:00Z'
  },
  {
    id: 6,
    title: 'IKEA Desk and Chair Set',
    description: 'IKEA desk and ergonomic office chair set. Perfect for home office setup. Both items in great condition.',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    ],
    sellerId: 303,
    sellerUsername: 'furnitureguy',
    status: 'AVAILABLE',
    createdAt: '2024-01-10T13:20:00Z',
    updatedAt: '2024-01-10T13:20:00Z'
  }
];

// localStorage key for user products
const USER_PRODUCTS_KEY = 'user_products';

// 从localStorage获取用户创建的商品
const getUserProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem(USER_PRODUCTS_KEY);
    console.log('localStorage data:', stored);
    const parsed = stored ? JSON.parse(stored) : [];
    console.log('Parsed user products:', parsed);
    return parsed;
  } catch (error) {
    console.error('Failed to parse user products from localStorage:', error);
    return [];
  }
};

// 保存用户创建的商品到localStorage
const saveUserProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(USER_PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Failed to save user products to localStorage:', error);
  }
};

// 获取完整的商品列表（静态 + 用户创建）
const getDynamicProducts = (): Product[] => {
  const userProducts = getUserProducts();
  return [...userProducts, ...initialMockProducts];
};

// 导出静态商品列表（用于商品详情页查找）
export const mockProducts = initialMockProducts;

// Mock API functions that return mock data
export const mockCreateProduct = async (data: any): Promise<Product> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 处理上传的图片文件，转换为base64字符串
  const processImages = async (imageFiles: File[]): Promise<string[]> => {
    const imagePromises = imageFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });
    
    return Promise.all(imagePromises);
  };
  
  // 处理图片文件
  const imageUrls = await processImages(data.images || []);
  
  // 如果没有上传图片，使用默认图片
  const finalImages = imageUrls.length > 0 ? imageUrls : [
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
  ];
  
  // 获取当前用户信息
  const useAuthStore = await import('../store/auth');
  const authState = useAuthStore.default.getState();
  const currentUserEmail = authState.user?.email || 'user@example.com';
  
  // 使用邮箱的哈希值作为sellerId，确保一致性
  const emailHash = currentUserEmail.split('@')[0]; // 使用邮箱前缀作为sellerId
  const numericSellerId = emailHash.charCodeAt(0) * 1000 + emailHash.length; // 转换为数字ID
  

  
  const newProduct: Product = {
    id: Date.now(),
    title: data.title,
    description: data.description,
    price: data.price,
    images: finalImages,
    sellerId: numericSellerId, // 使用基于邮箱的数字ID
    sellerUsername: authState.user?.username || emailHash, // 使用用户名
    status: 'AVAILABLE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  console.log('Creating product with seller info:', {
    email: currentUserEmail,
    username: authState.user?.username,
    sellerUsername: newProduct.sellerUsername
  });
  
  // 将新商品添加到用户商品列表并保存到localStorage
  const userProducts = getUserProducts();
  const updatedUserProducts = [newProduct, ...userProducts];
  saveUserProducts(updatedUserProducts);
  
  return newProduct;
};

export const mockGetProducts = async (params?: any): Promise<{
  total: number;
  page: number;
  size: number;
  items: Product[];
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredProducts = getDynamicProducts(); // 获取完整商品列表
  
  // Apply filters if provided
  if (params?.keyword) {
    const keyword = params.keyword.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword)
    );
  }
  
  if (params?.status) {
    filteredProducts = filteredProducts.filter(product =>
      product.status === params.status
    );
  }
  
  if (params?.minPrice) {
    filteredProducts = filteredProducts.filter(product =>
      product.price >= params.minPrice
    );
  }
  
  if (params?.maxPrice) {
    filteredProducts = filteredProducts.filter(product =>
      product.price <= params.maxPrice
    );
  }
  
  return {
    total: filteredProducts.length,
    page: params?.page || 1,
    size: params?.size || 10,
    items: filteredProducts
  };
};

// Mock delete product function
export const mockDeleteProduct = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 从用户商品列表中移除商品
  const userProducts = getUserProducts();
  const updatedUserProducts = userProducts.filter(product => product.id.toString() !== id);
  saveUserProducts(updatedUserProducts);
};

// 导出获取动态商品列表的函数（用于商品详情页）
export const getDynamicProductsForDetail = (): Product[] => {
  const userProducts = getUserProducts();
  return [...userProducts, ...initialMockProducts];
}; 