// components/Layout/Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProfileDropdown from './ProfileDropdown';
import NotificationsDropdown from './NotificationsDropdown';
import { BellIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import companyLogo from '../../assets/images/image.png'; // Use your existing image

const Layout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(4); // Mock unread count
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with Notifications */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            {!logoError ? (
              <img 
                src={companyLogo} 
                alt="Glades International Corporation" 
                className="h-10 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="h-10 w-10 bg-gradient-to-r from-blue-900 to-blue-700 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">GIC</span>
              </div>
            )}
            <h2 className="text-lg font-semibold text-gray-800">
              GLADES INTERNATIONAL CORPORATION
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Messages Button */}
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <ChatBubbleLeftIcon className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full"></span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-lg relative"
              >
                <BellIcon className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <NotificationsDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>
            
            {/* Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;