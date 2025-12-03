import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
          <div className="px-6 py-8 -mt-16">
            <div className="text-center">
              <img
                src={user.profilePic}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto"
              />
              <h2 className="text-2xl font-bold text-gray-900 mt-4">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-4 flex justify-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></span>
                  {user.isOnline ? 'Online' : 'Offline'}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Member since {new Date(user.createdAt).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;