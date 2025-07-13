import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Space,
  Divider,
  Spin,
  Alert,
  Image,
  Carousel,
  message,
  Descriptions,
  Modal,
} from 'antd';
import {
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useProductStore } from '../store/product';
import useAuthStore from '../store/auth';

const { Title, Text, Paragraph } = Typography;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchProduct, deleteProduct, loading, error } = useProductStore();
  
  const [product, setProduct] = useState<any>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      await fetchProduct(id!);
      // 从store中获取当前商品
      const currentProduct = useProductStore.getState().currentProduct;
      setProduct(currentProduct);
    } catch (error) {
      console.error('Failed to load product:', error);
      message.error('Failed to load product details');
    }
  };

  const handleDelete = async () => {
    if (!product || !user) return;
    
    setDeleteLoading(true);
    try {
      await deleteProduct(product.id.toString());
      message.success('Product deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Failed to delete product:', error);
      message.error('Failed to delete product');
    } finally {
      setDeleteLoading(false);
      setDeleteModalVisible(false);
    }
  };

  const canDelete = user && product && product.sellerUsername === user.username;
  


  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          }
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Product Not Found"
          description="The product you are looking for does not exist."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/')}
        style={{ marginBottom: '24px' }}
      >
        Back to Home
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card>
            {product.images && product.images.length > 0 ? (
              <Carousel autoplay>
                {product.images.map((image: string, index: number) => (
                  <div key={index}>
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '400px',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                }}
              >
                No images available
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card>
            <Title level={2}>{product.title}</Title>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text type="danger" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  <DollarOutlined /> ${product.price}
                </Text>
              </div>

              <div>
                <Text type="secondary">
                  <UserOutlined /> Seller: {product.sellerUsername}
                </Text>
              </div>

              <div>
                <Text type="secondary">
                  <CalendarOutlined /> Listed: {new Date(product.createdAt).toLocaleDateString()}
                </Text>
              </div>

              <div>
                <Tag color="blue">{product.category}</Tag>
                <Tag color={product.condition === 'new' ? 'green' : 'orange'}>
                  {product.condition}
                </Tag>
              </div>

              <Paragraph>{product.description}</Paragraph>

              <Space>
                <Button
                  type="primary"
                  icon={<MessageOutlined />}
                  size="large"
                  onClick={() => navigate(`/chat/${product.id}`)}
                >
                  Contact Seller
                </Button>
                
                {canDelete && (
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="large"
                    onClick={() => setDeleteModalVisible(true)}
                  >
                    Delete
                  </Button>
                )}
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card title="Product Details">
        <Descriptions column={2}>
          <Descriptions.Item label="Category">{product.category}</Descriptions.Item>
          <Descriptions.Item label="Condition">{product.condition}</Descriptions.Item>
          <Descriptions.Item label="Price">${product.price}</Descriptions.Item>
          <Descriptions.Item label="Seller">{product.sellerUsername}</Descriptions.Item>
          <Descriptions.Item label="Listed Date">
            {new Date(product.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Product ID">{product.id}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        confirmLoading={deleteLoading}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this product?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default ProductDetail; 