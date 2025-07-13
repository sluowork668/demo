// src/components/Layout.tsx

/*
  This is the layout component that provides shared navigation and content outlet.
  It renders navigation links and wraps the current page using <Outlet />.
*/

import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Button, Space } from "antd";
import { PlusOutlined, UserOutlined, LoginOutlined, HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import useAuthStore from "../store/auth";

const Layout: React.FC = () => {
  const { token, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <nav style={{ 
        padding: "16px 24px", 
        borderBottom: "1px solid #f0f0f0",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <Space size="middle">
          <Link to="/">
            <Button type="text" icon={<HomeOutlined />}>
              Home
            </Button>
          </Link>
          
          {token ? (
            // Logged in user navigation
            <>
              <Link to="/product/new">
                <Button type="primary" icon={<PlusOutlined />}>
                  Sell Item
                </Button>
              </Link>
              <Link to="/profile">
                <Button type="text" icon={<UserOutlined />}>
                  Profile
                </Button>
              </Link>
              <Button 
                type="text" 
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            // Guest user navigation
            <>
              <Link to="/login">
                <Button type="text" icon={<LoginOutlined />}>
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button type="text">
                  Register
                </Button>
              </Link>
            </>
          )}
        </Space>
      </nav>
      <div style={{ padding: 20 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
