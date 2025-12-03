import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Message = ({ message }) => {
  const { user } = useAuth();
  const isOwnMessage = message.sender._id === user._id;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Show sender name for group chats (other users' messages)
  const shouldShowSenderName = !isOwnMessage && message.chat?.isGroupChat;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isOwnMessage
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none shadow-lg'
          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow'
      }`}>
        
        {/* Sender Name - Show for group chats (other users' messages) */}
        {shouldShowSenderName && (
          <div className="flex items-center space-x-2 mb-1">
            <img
              src={message.sender.profilePic}
              alt={message.sender.name}
              className="w-4 h-4 rounded-full"
            />
            <p className="text-xs font-semibold text-gray-600">
              {message.sender.name}
            </p>
          </div>
        )}
        
        {/* Message Content */}
        <p className="text-sm break-words">{message.content}</p>
        
        {/* Message Time */}
        <p className={`text-xs mt-1 text-right ${
          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default Message;