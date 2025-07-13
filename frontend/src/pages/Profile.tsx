// src/pages/Profile.tsx

import React, { useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Button,
  Space,
  Form,
  Input,
  Row,
  Col,
  Divider,
  message,
  Modal,
  Descriptions,
} from "antd";
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import useAuthStore from "../store/auth";
import { updateUserProfile, UpdateUserRequest } from "../services/userApi";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Profile: React.FC = () => {
  const { user, token, login } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Temporary login function for testing
  const handleTestLogin = () => {
    const testUser = {
      id: 1,
      email: "test@example.com",
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      phoneNumber: "123-456-7890",
      address: "123 Test St",
      city: "Test City",
      state: "Test State",
      zipCode: "12345",
      country: "Test Country",
      nickname: "Test User",
      avatar: undefined
    };
    login("test-token", testUser);
  };

  // Handle form submission
  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // 调用API更新用户信息
      const updateData: UpdateUserRequest = {
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        address: values.address,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        country: values.country,
      };
      
      const updatedUserData = await updateUserProfile(updateData);
      
      // 更新本地状态
      const updatedUser = {
        ...user,
        ...updatedUserData
      };
      login(token!, updatedUser);
      
      message.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  // if user didn't login yet
  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>Please log in first</Text>
        <br />
        <Space style={{ marginTop: 16 }}>
          <Button type="primary" onClick={handleTestLogin}>
            Test Login (Temporary)
          </Button>
        </Space>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={2}>Profile</Title>
          {!isEditing && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>

        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              username: user.username,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              phoneNumber: user.phoneNumber || '',
              address: user.address || '',
              city: user.city || '',
              state: user.state || '',
              zipCode: user.zipCode || '',
              country: user.country || '',
            }}
            onFinish={handleSave}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: 'Please enter username' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                >
                  <Input value={user.email} disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: 'Please enter first name' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: 'Please enter last name' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

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
              <TextArea rows={2} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="City"
                  name="city"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="State"
                  name="state"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Zip Code"
                  name="zipCode"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Country"
              name="country"
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  Save Changes
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              <Avatar size={64} src={user.avatar} icon={<UserOutlined />} />
              <div style={{ marginLeft: 16 }}>
                <Title level={3}>{user.firstName} {user.lastName}</Title>
                <Text type="secondary">@{user.username}</Text>
              </div>
            </div>

            <Divider />

            <Descriptions title="Personal Information" column={2}>
              <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="First Name">{user.firstName || 'Not provided'}</Descriptions.Item>
              <Descriptions.Item label="Last Name">{user.lastName || 'Not provided'}</Descriptions.Item>
              <Descriptions.Item label="Phone Number">{user.phoneNumber || 'Not provided'}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Address Information" column={2}>
              <Descriptions.Item label="Address" span={2}>
                {user.address || 'Not provided'}
              </Descriptions.Item>
              <Descriptions.Item label="City">{user.city || 'Not provided'}</Descriptions.Item>
              <Descriptions.Item label="State">{user.state || 'Not provided'}</Descriptions.Item>
              <Descriptions.Item label="Zip Code">{user.zipCode || 'Not provided'}</Descriptions.Item>
              <Descriptions.Item label="Country">{user.country || 'Not provided'}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile;
