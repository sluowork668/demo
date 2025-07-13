import React from 'react';
import { Card, Tag, Space, Typography, Button, message, Modal } from 'antd';
import { DollarOutlined, UserOutlined, CalendarOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Product } from '../services/productApi';
import useAuthStore from '../store/auth';

const { Title, Text } = Typography;
const { Meta } = Card;

interface ProductCardProps {
  product: Product;
  onContact?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
  onDelete?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onContact, 
  onViewDetails,
  onDelete
}) => {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'green';
      case 'RESERVED':
        return 'orange';
      case 'SOLD':
        return 'red';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleContact = () => {
    if (!token) {
      message.info('Please log in to contact sellers');
      navigate('/login');
      return;
    }
    onContact?.(product.id.toString());
  };

  const handleViewDetails = () => {
    onViewDetails?.(product.id.toString());
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete Product',
      content: `Are you sure you want to delete "${product.title}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        onDelete?.(product.id.toString());
      },
    });
  };

  const { user } = useAuthStore();
  const isOwner = token && user && product.sellerUsername === user.username;

  return (
    <Card
      hoverable
      style={{ width: 300, margin: '8px' }}
      cover={
        product.images && product.images.length > 0 ? (
          <img
            alt={product.title}
            src={product.images[0]}
            style={{ height: 200, objectFit: 'cover' }}
          />
        ) : (
          <div 
            style={{ 
              height: 200, 
              backgroundColor: '#f5f5f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <Text type="secondary">No Image</Text>
          </div>
        )
      }
      actions={[
        <Button 
          type="primary" 
          onClick={handleViewDetails}
        >
          View Details
        </Button>,
        product.status === 'AVAILABLE' && !isOwner && (
          <Button 
            onClick={handleContact}
          >
            {token ? 'Contact Seller' : 'Login to Contact'}
          </Button>
        ),
        isOwner && (
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        )
      ].filter(Boolean)}
    >
      <Meta
        title={
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4} style={{ margin: 0 }}>
              {product.title}
            </Title>
            <Space>
              <Tag color={getStatusColor(product.status)}>
                {product.status}
              </Tag>
            </Space>
          </Space>
        }
        description={
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary" ellipsis>
              {product.description}
            </Text>
            <Space>
              <DollarOutlined />
              <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                ${product.price.toFixed(2)}
              </Text>
            </Space>
            <Space>
              <UserOutlined />
              <Text type="secondary">Seller: {product.sellerUsername}</Text>
            </Space>
            <Space>
              <CalendarOutlined />
              <Text type="secondary">
                Listed: {formatDate(product.createdAt)}
              </Text>
            </Space>
          </Space>
        }
      />
    </Card>
  );
};

export default ProductCard; 