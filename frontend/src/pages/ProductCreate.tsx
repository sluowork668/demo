import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  Card,
  message,
  Space,
  Typography,
  Divider,
  Alert,
} from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { CreateProductRequest } from '../services/productApi';
import { useProductStore } from '../store/product';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ProductCreate: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [imageList, setImageList] = useState<any[]>([]);
  
  const { createProduct, loading, error, clearError } = useProductStore();

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      clearError();
      
      // Extract image files from the upload component
      const images = imageList
        .filter(item => item.originFileObj)
        .map(item => item.originFileObj);

      if (images.length === 0) {
        message.error('Please upload at least one image');
        return;
      }

      const productData: CreateProductRequest = {
        title: values.title,
        description: values.description,
        price: values.price,
        images: images,
      };

      await createProduct(productData);
      
      message.success('Product created successfully!');
      navigate('/'); // Redirect to home page
    } catch (error: any) {
      console.error('Error creating product:', error);
      // Error is already handled by the store
    }
  };

  // Handle image upload
  const handleImageChange = ({ fileList }: any) => {
    console.log('Image list updated:', fileList); // Debug log
    setImageList(fileList);
  };

  // Upload button for images
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload Image</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Card>
        <Title level={2}>Create New Product</Title>
        <Text type="secondary">
          Fill in the details below to list your item for sale
        </Text>
        
        <Divider />
        
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={clearError}
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            price: 0,
          }}
        >
          {/* Product Title */}
          <Form.Item
            label="Product Title"
            name="title"
            rules={[
              { required: true, message: 'Please enter a product title' },
              { min: 3, message: 'Title must be at least 3 characters' },
              { max: 100, message: 'Title cannot exceed 100 characters' },
            ]}
          >
            <Input 
              placeholder="Enter a descriptive title for your product"
              size="large"
            />
          </Form.Item>

          {/* Product Description */}
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: 'Please enter a product description' },
              { min: 10, message: 'Description must be at least 10 characters' },
              { max: 1000, message: 'Description cannot exceed 1000 characters' },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Describe your product in detail (condition, features, etc.)"
              showCount
              maxLength={1000}
            />
          </Form.Item>

          {/* Price */}
          <Form.Item
            label="Price ($)"
            name="price"
            rules={[
              { required: true, message: 'Please enter a price' },
              { type: 'number', min: 0, message: 'Price must be positive' },
            ]}
          >
            <InputNumber
              placeholder="0.00"
              min={0}
              step={0.01}
              precision={2}
              style={{ width: '100%' }}
              size="large"
            />
          </Form.Item>

          {/* Image Upload */}
          <Form.Item
            label="Product Images"
            required
          >
            <Upload
              listType="picture-card"
              fileList={imageList}
              onChange={handleImageChange}
              beforeUpload={() => false} // Prevent auto upload
              accept="image/*"
              multiple
            >
              {imageList.length >= 8 ? null : uploadButton}
            </Upload>
            <Text type="secondary">
              Upload up to 8 images. First image will be the main display image.
            </Text>
            {imageList.length === 0 && (
              <Text type="danger" style={{ fontSize: '12px' }}>
                Please upload at least one image
              </Text>
            )}
          </Form.Item>

          {/* Submit Buttons */}
          <Form.Item>
            <Space size="middle">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<UploadOutlined />}
                disabled={imageList.length === 0}
              >
                Create Product
              </Button>
              <Button
                size="large"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProductCreate; 