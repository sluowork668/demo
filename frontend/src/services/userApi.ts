// src/services/userApi.ts

import api from '../utils/api';

// 用户信息更新接口
export interface UpdateUserRequest {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// 用户信息响应接口
export interface UserResponse {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  role: string;
  enabled: boolean;
}

// 更新用户信息
export const updateUserProfile = async (data: UpdateUserRequest): Promise<UserResponse> => {
  const response = await api.put('/api/users/profile', data);
  return response.data;
};

// 获取用户信息
export const getUserProfile = async (): Promise<UserResponse> => {
  const response = await api.get('/api/users/profile');
  return response.data;
}; 