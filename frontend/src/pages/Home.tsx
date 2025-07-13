import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Space,
  Typography,
  Row,
  Col,
  Empty,
  Spin,
  Alert,
  Card,
  message,
} from 'antd';
import { PlusOutlined, ReloadOutlined, LoginOutlined } from '@ant-design/icons';
import ProductCard from '../components/ProductCard';
import { useProductStore } from '../store/product';
import useAuthStore from '../store/auth';

const { Title, Text } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { products, loading, error, fetchProducts, deleteProduct, clearError } = useProductStore();
  const { token } = useAuthStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreateProduct = () => {
    if (!token) {
      message.info('Please log in to sell items');
      navigate('/login', { state: { from: '/product/new' } });
      return;
    }
    navigate('/product/new');
  };

  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleContact = (productId: string) => {
    if (!token) {
      message.info('Please log in to contact sellers');
      navigate('/login');
      return;
    }
    navigate(`/chat/${productId}`);
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      message.success('Product deleted successfully');
    } catch (error: any) {
      message.error(error.message || 'Failed to delete product');
    }
  };

  const handleRefresh = () => {
    clearError();
    fetchProducts();
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>Second-Hand Market</Title>
            <Text type="secondary">
              Find great deals on used items or sell your own
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={handleCreateProduct}
              >
                Sell Your Item
              </Button>
              {!token && (
                <Button
                  icon={<LoginOutlined />}
                  onClick={handleLogin}
                >
                  Login
                </Button>
              )}
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Error Alert */}
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

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>Loading products...</Text>
          </div>
        </div>
      ) : products.length > 0 ? (
        <Row gutter={[16, 16]} justify="start">
          {products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <ProductCard
                product={product}
                onContact={handleContact}
                onViewDetails={handleViewDetails}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <Empty
            description="No products available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Space direction="vertical" size="middle">
              <Text type="secondary">
                {token 
                  ? "Be the first to sell an item!" 
                  : "Log in to be the first to sell an item!"
                }
              </Text>
              <Space>
                <Button type="primary" onClick={handleCreateProduct}>
                  Sell Your Item
                </Button>
                {!token && (
                  <Button onClick={handleLogin}>
                    Login First
                  </Button>
                )}
              </Space>
            </Space>
          </Empty>
        </Card>
      )}
    </div>
  );
};

export default Home; 