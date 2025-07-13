import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  chatRoomId: number;
  content: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
}

interface ChatState {
  messages: Record<number, ChatMessage[]>; // chatRoomId -> messages
  addMessage: (chatRoomId: number, message: ChatMessage) => void;
  setMessages: (chatRoomId: number, messages: ChatMessage[]) => void;
  clearMessages: (chatRoomId: number) => void;
  getMessages: (chatRoomId: number) => ChatMessage[];
}

const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: {},
      
      addMessage: (chatRoomId: number, message: ChatMessage) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [chatRoomId]: [
              ...(state.messages[chatRoomId] || []),
              message
            ]
          }
        }));
      },
      
      setMessages: (chatRoomId: number, messages: ChatMessage[]) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [chatRoomId]: messages
          }
        }));
      },
      
      clearMessages: (chatRoomId: number) => {
        set((state) => {
          const newMessages = { ...state.messages };
          delete newMessages[chatRoomId];
          return { messages: newMessages };
        });
      },
      
      getMessages: (chatRoomId: number) => {
        return get().messages[chatRoomId] || [];
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ messages: state.messages }),
    }
  )
);

export default useChatStore; 