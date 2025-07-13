// src/App.tsx

/*
  This is the root entry component of the React application.
  It configures routing using react-router-dom and wraps all pages with a Layout.
*/

import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Page Components
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductCreate from "./pages/ProductCreate";
import ProductDetail from "./pages/ProductDetail";
import Chat from "./pages/Chat";
import Home from "./pages/Home";

// Layout Component
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Store
import useAuthStore from "./store/auth";

const App: React.FC = () => {
  const { initialize } = useAuthStore();

  // Initialize auth state on app start
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    // Router Container
    <Router>
      <Routes>
        {/* Wrap all routes with a common layout */}
        <Route path="/" element={<Layout />}>
          {/* Default route shows home page */}
          <Route index element={<Home />} />

          {/* Define routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Product routes */}
          <Route path="product/:id" element={<ProductDetail />} />
          
          {/* Chat route */}
          <Route 
            path="chat/:productId" 
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected routes - require authentication */}
          <Route 
            path="product/new" 
            element={
              <ProtectedRoute>
                <ProductCreate />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
