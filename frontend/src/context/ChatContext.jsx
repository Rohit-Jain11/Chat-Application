import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { chatAPI, messageAPI } from '../services/api';
import { socket } from '../services/socket';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
      socket.emit('join chat', selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message received', (newMessage) => {
      if (selectedChat && selectedChat._id === newMessage.chat._id) {
        setMessages(prev => [...prev, newMessage]);
      } else {
        setNotifications(prev => [newMessage, ...prev]);
      }

      // Update latestMessage in chat list
      setChats(prev =>
        prev.map(chat =>
          chat._id === newMessage.chat._id
            ? { ...chat, latestMessage: newMessage }
            : chat
        )
      );
    });

    return () => socket.off('message received');
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getChats();
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await messageAPI.getMessages(chatId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const accessChat = async (userId) => {
    try {
      const response = await chatAPI.accessChat(userId);

      // Add new chat to list if not already there
      if (!chats.find(chat => chat._id === response.data._id)) {
        setChats(prev => [response.data, ...prev]);
      }

      setSelectedChat(response.data);
      return { success: true };
    } catch (error) {
      console.error('Error accessing chat:', error);
      return { success: false, message: error.response?.data?.message };
    }
  };

  const sendMessage = async (content) => {
    if (!selectedChat || !content.trim()) return;

    try {
      const response = await messageAPI.sendMessage({
        content: content.trim(),
        chatId: selectedChat._id,
      });

      socket.emit('new message', response.data);

      setMessages(prev => [...prev, response.data]);

      // Update latestMessage in chat list
      setChats(prev =>
        prev.map(chat =>
          chat._id === selectedChat._id
            ? { ...chat, latestMessage: response.data }
            : chat
        )
      );

      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, message: error.response?.data?.message };
    }
  };

  const createGroupChat = async (name, users) => {
    try {
      const response = await chatAPI.createGroup({
        name,
        users: JSON.stringify(users),
      });

      setChats(prev => [response.data, ...prev]);
      setSelectedChat(response.data);

      return { success: true };
    } catch (error) {
      console.error('Error creating group:', error);
      return { success: false, message: error.response?.data?.message };
    }
  };

  const value = {
    user,               // ✅ FIXED — now available inside ChatList
    chats,
    selectedChat,
    messages,
    loading,
    notifications,
    searchResults,
    setSelectedChat,
    setMessages,
    fetchChats,
    fetchMessages,
    accessChat,
    sendMessage,
    createGroupChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
