// src/pages/Chat.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
  Space,
  Avatar,
  Divider,
  message,
  Spin,
} from 'antd';
import {
  SendOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductStore } from '../store/product';
import useAuthStore from '../store/auth';
import useChatStore, { ChatMessage } from '../store/chat';
import { 
  createChatRoomApi, 
  getChatRoomMessagesApi, 
  sendMessageApi,
  Message as ApiMessage 
} from '../services/chatApi';

const { Text, Title } = Typography;
const { TextArea } = Input;

const Chat: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchProduct } = useProductStore();
  const { 
    messages: storedMessages, 
    addMessage, 
    setMessages, 
    getMessages 
  } = useChatStore();
  
  const [product, setProduct] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 获取当前聊天室的消息
  const messages = chatRoomId ? getMessages(chatRoomId) : [];

  useEffect(() => {
    if (productId && user) {
      loadProduct();
    }
  }, [productId, user]);

  useEffect(() => {
    if (product && user && chatRoomId) {
      loadMessages();
      
      // 设置定时刷新消息
      const interval = setInterval(() => {
        loadMessages();
      }, 3000); // 每3秒刷新一次
      
      return () => clearInterval(interval);
    }
  }, [product, user, chatRoomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      await fetchProduct(productId!);
      const currentProduct = useProductStore.getState().currentProduct;
      setProduct(currentProduct);
      
      // 创建或获取聊天室
      if (currentProduct && user) {
        await createOrGetChatRoom(currentProduct, user);
      }
    } catch (error) {
      message.error('Failed to load product information');
    } finally {
      setLoading(false);
    }
  };

  const createOrGetChatRoom = async (product: any, user: any) => {
    try {
      const chatRoom = await createChatRoomApi({
        buyer: user.username,
        seller: product.sellerUsername,
        itemId: product.id
      });
      setChatRoomId(chatRoom.id);
    } catch (error) {
      console.error('Failed to create/get chat room:', error);
      message.error('Failed to create chat room');
    }
  };

  const loadMessages = async () => {
    if (!chatRoomId) return;
    
    try {
      const apiMessages: ApiMessage[] = await getChatRoomMessagesApi(chatRoomId);
      
      // 转换API消息格式为前端格式
      const convertedMessages: ChatMessage[] = apiMessages.map(msg => ({
        id: msg.id.toString(),
        chatRoomId: chatRoomId,
        content: msg.content,
        sender: msg.sender,
        timestamp: new Date(msg.createdAt),
        isOwn: msg.sender === user?.username
      }));
      
      // 更新本地存储的消息
      setMessages(chatRoomId, convertedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      // 不显示错误消息，避免频繁弹窗
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatRoomId || !user) return;

    try {
      // 发送消息到后端
      const sentMessage: ApiMessage = await sendMessageApi(chatRoomId, {
        sender: user.username,
        content: newMessage,
        messageType: 'TEXT'
      });

      // 添加消息到本地状态
      const message: ChatMessage = {
        id: sentMessage.id.toString(),
        chatRoomId: chatRoomId,
        content: sentMessage.content,
        sender: sentMessage.sender,
        timestamp: new Date(sentMessage.createdAt),
        isOwn: true,
      };

      addMessage(chatRoomId, message);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      message.error('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text>Please log in to access chat</Text>
        <br />
        <Button type="primary" onClick={() => navigate('/login')} style={{ marginTop: 16 }}>
          Login
        </Button>
      </div>
    );
  }

  if (!product || loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading chat...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <Card>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ marginRight: 16 }}
          >
            Back
          </Button>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Chat with {product.sellerUsername}
            </Title>
            <Text type="secondary">About: {product.title}</Text>
          </div>
        </div>

        <Divider />

        {/* Product Info */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Space>
            <img
              src={product.images?.[0]}
              alt={product.title}
              style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
            />
            <div>
              <Text strong>{product.title}</Text>
              <br />
              <Text type="danger" strong>${product.price}</Text>
            </div>
          </Space>
        </Card>

        {/* Messages */}
        <div
          style={{
            height: 400,
            overflowY: 'auto',
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            padding: 16,
            marginBottom: 16,
            backgroundColor: '#fafafa',
          }}
        >
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', marginTop: 100 }}>
              <Text>No messages yet. Start the conversation!</Text>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '8px 12px',
                    borderRadius: 12,
                    backgroundColor: msg.isOwn ? '#1890ff' : '#fff',
                    color: msg.isOwn ? '#fff' : '#000',
                    border: msg.isOwn ? 'none' : '1px solid #d9d9d9',
                  }}
                >
                  <div style={{ marginBottom: 4 }}>
                    <Text
                      style={{
                        fontSize: '12px',
                        color: msg.isOwn ? 'rgba(255,255,255,0.8)' : '#999',
                      }}
                    >
                      {msg.sender}
                    </Text>
                  </div>
                  <div>{msg.content}</div>
                  <div style={{ marginTop: 4 }}>
                    <Text
                      style={{
                        fontSize: '10px',
                        color: msg.isOwn ? 'rgba(255,255,255,0.6)' : '#999',
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </Text>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div style={{ display: 'flex', gap: 8 }}>
          <TextArea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || loading}
            style={{ alignSelf: 'flex-end' }}
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Chat; 