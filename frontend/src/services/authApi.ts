// src/services/authApi.ts

// This file contains API functions for user authentication, including login and register requests

import api from '../utils/api';

// Login API call with email and password
export const loginApi = (data: { email: string; password: string }) => {
  return api.post("/api/auth/login", data).then((res) => res.data); // Return server response
};

// Register API call with complete user data
export const registerApi = (data: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  role: string;
}) => {
  return api.post("/api/auth/signup", data).then((res) => res.data); // Return server response
};

