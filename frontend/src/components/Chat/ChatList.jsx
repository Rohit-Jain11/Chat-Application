import React from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';   // ✔️ IMPORT FIX

const ChatList = () => {
  const { chats, selectedChat, setSelectedChat } = useChat();
  const { user } = useAuth();                          // ✔️ GET LOGGED-IN USER

  if (!user) {
    return <p className="p-4 text-center text-gray-500">Loading user...</p>;
  }

  const getChatName = (chat) => {
    if (chat.isGroupChat) return chat.chatName;

    const otherUser = chat.users.find(u => u._id !== user._id);
    return otherUser?.name || "Unknown User";
  };

  const getChatAvatar = (chat) => {
    if (chat.isGroupChat) return chat.groupProfilePic;

    const otherUser = chat.users.find(u => u._id !== user._id);
    return otherUser?.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  };

  const getLastMessage = (chat) => {
    if (chat.latestMessage) {
      const prefix = chat.isGroupChat ? `${chat.latestMessage.sender.name}: ` : '';
      return prefix + chat.latestMessage.content;
    }
    return 'Start a conversation...';
  };

  const getTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-2">
      {chats.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>No chats yet</p>
          <p className="text-sm">Start a new conversation!</p>
        </div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat._id}
            className={`p-3 rounded-lg cursor-pointer mb-2 transition-all ${
              selectedChat?._id === chat._id
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-800 hover:shadow-md'
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            <div className="flex items-center space-x-3">
              <img
                src={getChatAvatar(chat)}
                alt={getChatName(chat)}
                className="w-12 h-12 rounded-full border-2 border-white shadow"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold truncate text-sm">
                    {getChatName(chat)}
                  </p>
                  <span className={`text-xs ${
                    selectedChat?._id === chat._id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {getTime(chat.updatedAt)}
                  </span>
                </div>
                <p className={`text-xs truncate ${
                  selectedChat?._id === chat._id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {getLastMessage(chat)}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;
