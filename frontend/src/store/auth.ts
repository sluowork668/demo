// src/store/auth.ts

// This file defines the global auth state management using Zustand
// It stores user info and token, and provides login/logout methods

import { create } from 'zustand';

// User info interface
interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  nickname?: string;
  avatar?: string;
}

// Zustand state shape for authentication
interface AuthState {
  user: User | null; // Currently logged-in user
  token: string | null; // Authentication token
  login: (token: string, user: User) => void; // Login method
  logout: () => void; // Logout method
  initialize: () => void; // Initialize auth state from localStorage
}

// Create Zustand store 
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"), // Initialize token from localStorage
  login: (token, user) => {
    set({ token, user }); // Update auth state
    localStorage.setItem("token", token); // Store token in localStorage
    localStorage.setItem("user", JSON.stringify(user)); // Store user info in localStorage
  },
  logout: () => {
    set({ token: null, user: null }); // Clear auth state
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("user"); // Remove user info from localStorage
  },
  initialize: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ token, user });
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        // 如果解析失败，使用默认用户信息
        const email = "user@example.com";
        const emailHash = email.split('@')[0];
        const numericUserId = emailHash.charCodeAt(0) * 1000 + emailHash.length;
        
        const defaultUser: User = {
          id: numericUserId,
          email: email,
          username: "testuser",
          firstName: "Test",
          lastName: "User",
          phoneNumber: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          nickname: "Test User",
          avatar: undefined
        };
        set({ token, user: defaultUser });
      }
    }
  },
}));

export default useAuthStore;
