import React from 'react';
import Sidebar from '../components/Chat/Sidebar';
import ChatBox from '../components/Chat/ChatBox';

const ChatPage = () => {
  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar />
      <ChatBox />
    </div>
  );
};

export default ChatPage;