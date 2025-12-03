import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import ChatList from './ChatList';
import CreateGroupModal from './CreateGroupModal';

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const { user, logout, searchUsers } = useAuth();
  const { accessChat } = useChat();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const users = await searchUsers(searchTerm);
    setSearchResults(users);
  };

  const handleUserSelect = async (userId) => {
    await accessChat(userId);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-blue-100 text-sm">Online</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
              title="Create Group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={logout}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="p-4 border-b border-gray-200">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="border-b border-gray-200 max-h-60 overflow-y-auto">
          <p className="text-sm text-gray-500 px-4 py-2">Search Results:</p>
          {searchResults.map((user) => (
            <div
              key={user._id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3"
              onClick={() => handleUserSelect(user._id)}
            >
              <img
                src={user.profilePic}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <ChatList />
      </div>

      {/* Create Group Modal */}
      {isGroupModalOpen && (
        <CreateGroupModal onClose={() => setIsGroupModalOpen(false)} />
      )}
    </div>
  );
};

export default Sidebar;