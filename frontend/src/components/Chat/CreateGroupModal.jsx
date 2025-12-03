import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { toast } from 'react-hot-toast';

const CreateGroupModal = ({ onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { searchUsers } = useAuth();
  const { createGroupChat } = useChat();

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    console.log('Searching for users:', searchTerm);
    try {
      const users = await searchUsers(searchTerm);
      console.log('Search results:', users);
      setSearchResults(users);
      
      if (users.length === 0) {
        toast.error('No users found');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search users');
    }
  };

  const handleUserSelect = (user) => {
    console.log('User selected:', user);
    if (!selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
      toast.success(`Added ${user.name} to group`);
    } else {
      toast.error('User already added');
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleUserRemove = (userId) => {
    console.log('Removing user:', userId);
    setSelectedUsers(selectedUsers.filter(user => user._id !== userId));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    console.log('Creating group with:', {
      name: groupName,
      users: selectedUsers.map(u => u._id),
      selectedUsers
    });

    if (!groupName.trim() || selectedUsers.length < 2) {
      toast.error('Group name and at least 2 users are required');
      return;
    }

    setLoading(true);
    try {
      const result = await createGroupChat(
        groupName,
        selectedUsers.map(user => user._id)
      );

      console.log('Create group result:', result);

      if (result.success) {
        toast.success('Group created successfully!');
        onClose();
      } else {
        toast.error(result.message || 'Failed to create group');
      }
    } catch (error) {
      console.error('Error in handleCreateGroup:', error);
      toast.error('An error occurred while creating the group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Create Group Chat</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition p-2"
              type="button" // Important: specify type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* MAIN FORM - handles group creation */}
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter group name"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Users
              </label>
              
              {/* SEARCH SECTION - No form tag, just div */}
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Search users..."
                  disabled={loading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Prevent form submission
                      handleSearch(e);
                    }
                  }}
                />
                <button
                  type="button" // Important: type="button" not "submit"
                  onClick={handleSearch}
                  disabled={loading || !searchTerm.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                  Search
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="border border-gray-200 rounded-lg max-h-32 overflow-y-auto mb-3">
                  {searchResults.map(user => (
                    <div
                      key={user._id}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                      onClick={() => handleUserSelect(user)}
                    >
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div>
                  <p className="text-sm text-gray-700 mb-2">Selected Users ({selectedUsers.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map(user => (
                      <div
                        key={user._id}
                        className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{user.name}</span>
                        <button
                          type="button" // Important: type="button"
                          onClick={() => handleUserRemove(user._id)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          disabled={loading}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button" // Important: type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit" // This is the ONLY submit button in the form
                disabled={loading || !groupName.trim() || selectedUsers.length < 2}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Group'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;