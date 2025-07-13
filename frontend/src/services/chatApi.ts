// src/services/chatApi.ts

// This file contains API functions for chat functionality

import api from '../utils/api';

export interface ChatRoom {
  id: number;
  name: string;
  buyer: string;
  seller: string;
  itemId: number;
  closed: boolean;
  createdAt: string;
}

export interface ChatRoomSummary {
  id: number;
  name: string;
  itemId: number;
  closed: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface Message {
  id: number;
  chatRoomId: number;
  sender: string;
  content: string;
  messageType: string;
  createdAt: string;
}

// Create or get chat room
export const createChatRoomApi = (data: {
  buyer: string;
  seller: string;
  itemId: number;
}): Promise<ChatRoom> => {
  return api.post("/chatRooms", data).then((res) => res.data);
};

// Get chat rooms by user
export const getChatRoomsByUserApi = (username: string): Promise<ChatRoomSummary[]> => {
  return api.get(`/chatRooms/user/${username}`).then((res) => res.data);
};

// Get chat room info
export const getChatRoomInfoApi = (id: number): Promise<ChatRoom> => {
  return api.get(`/chatRooms/${id}/info`).then((res) => res.data);
};

// Get chat room messages
export const getChatRoomMessagesApi = (chatRoomId: number): Promise<Message[]> => {
  return api.get(`/chatRooms/${chatRoomId}`).then((res) => res.data);
};

// Send message
export const sendMessageApi = (chatRoomId: number, data: {
  sender: string;
  content: string;
  messageType: string;
}): Promise<Message> => {
  return api.post(`/chatRooms/${chatRoomId}/messages`, data).then((res) => res.data);
};

// Close chat room
export const closeChatRoomApi = (id: number): Promise<void> => {
  return api.put(`/chatRooms/${id}/close`).then((res) => res.data);
};

// Get messages grouped by chat room
export const getMessagesGroupedByChatRoomApi = (sender: string): Promise<Record<number, Message[]>> => {
  return api.get(`/chatRooms/messages/bySender/${sender}`).then((res) => res.data);
}; 