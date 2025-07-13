// src/components/AuthForm.tsx

/* 
  This is the reusable login/register form component.
  It handles both login and registration logic with form submission.
*/

import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginApi, registerApi } from '../services/authApi';
import useAuthStore from '../store/auth';

interface Props {
  type: "login" | "register"; // determine form mode
}

// Reusable authentication form for login/register
const AuthForm: React.FC<Props> = ({ type }) => {
  const navigate = useNavigate(); // for redirection after success
  const location = useLocation(); // to get the redirect location
  const login = useAuthStore((state) => state.login); // Zustand action to set login state

  // Handle form submit
  const onFinish = async (values: any) => {
    try {
      let res;
      if (type === "login") {
        res = await loginApi(values); // call login API
      } else {
        // 为注册准备完整的数据
        const registerData = {
          username: values.email, // 使用email作为username
          email: values.email,
          password: values.password,
          firstName: values.firstName || '',
          lastName: values.lastName || '',
          phoneNumber: values.phoneNumber || '',
          address: values.address || '',
          city: values.city || '',
          state: values.state || '',
          zipCode: values.zipCode || '',
          country: values.country || '',
          role: 'USER'
        };
        res = await registerApi(registerData); // call register API
      }

      // Show success message and store user info + token
      message.success(`${type === "login" ? "Login" : "Register"} successful`);
      
      // 基于邮箱生成用户ID，确保一致性
      const emailHash = values.email.split('@')[0];
      const numericUserId = emailHash.charCodeAt(0) * 1000 + emailHash.length;
      
      // 构造用户信息对象
      let userInfo;
      
      if (type === "register") {
        // 注册时使用用户输入的username
        userInfo = {
          id: numericUserId,
          email: values.email,
          username: values.username,
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
          address: values.address,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          country: values.country,
          nickname: `${values.firstName} ${values.lastName}`,
          avatar: undefined
        };
      } else {
        // 登录时，如果没有输入username，使用邮箱前缀
        // 或者尝试从localStorage恢复之前的用户信息
        const storedUser = localStorage.getItem("user");
        let storedUsername = null;
        
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.email === values.email) {
              storedUsername = parsedUser.username;
            }
          } catch (error) {
            console.error('Failed to parse stored user:', error);
          }
        }
        
        userInfo = {
          id: numericUserId,
          email: values.email,
          username: values.username || storedUsername || values.email.split('@')[0],
          nickname: "User",
          avatar: undefined
        };
      }
      
      console.log('AuthForm Debug:', {
        type: type,
        inputUsername: values.username,
        finalUsername: userInfo.username,
        email: values.email
      });
      
      login(res.token, userInfo); // update store
      
      // Redirect to the intended page or home
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err: any) {
      // Show error message if request fails
      message.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Form
      name="authForm"
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 400, margin: "auto", marginTop: "3rem" }}
    >
      {/* Username input field - 只在注册时必填 */}
      <Form.Item
        label="Username"
        name="username"
        rules={[
          { 
            required: type === "register", 
            message: type === "register" ? "Please enter a username" : undefined 
          }
        ]}
      >
        <Input placeholder={type === "login" ? "Optional" : "Required"} />
      </Form.Item>

      {/* Email input field */}
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please enter your email" }]}
      >
        <Input />
      </Form.Item>

      {/* Password input field */}
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your password" }]}
      >
        <Input.Password />
      </Form.Item>

      {/* 注册时显示额外字段 */}
      {type === "register" && (
        <>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter your first name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="State"
            name="state"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Zip Code"
            name="zipCode"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
          >
            <Input />
          </Form.Item>
        </>
      )}

      {/* Submit button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {type === "login" ? "Log In" : "Register"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AuthForm;
