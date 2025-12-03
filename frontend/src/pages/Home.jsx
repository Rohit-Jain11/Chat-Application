import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg mr-3"></div>
              <span className="text-white text-xl font-bold">Chat App</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-white hover:text-gray-200 px-4 py-2 rounded-lg transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Real-time Chat
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            Made Simple
          </span>
        </h1>
        <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
          Experience seamless real-time messaging with one-on-one and group chats. 
          Built with the modern MERN stack and powered by Socket.io for instant communication.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition duration-200 shadow-2xl"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transform hover:scale-105 transition duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white border border-white/20">
            <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">One-on-One Chat</h3>
            <p className="text-blue-100">Private conversations with instant messaging and real-time updates.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white border border-white/20">
            <div className="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Group Chats</h3>
            <p className="text-blue-100">Create groups and chat with multiple people simultaneously.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white border border-white/20">
            <div className="w-12 h-12 bg-pink-400 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time</h3>
            <p className="text-blue-100">Instant message delivery with Socket.io powered real-time communication.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;