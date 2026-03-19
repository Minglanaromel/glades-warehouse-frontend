// components/Layout/Header.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMessages } from '../../context/MessageContext'; // Add this import
import { useNavigate } from 'react-router-dom'; // Add this for navigation
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  BellIcon,
  EnvelopeIcon, // Add EnvelopeIcon for Messages
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import companyLogo from '../../assets/images/image.png'; // Use your existing image

const Header = () => {
  const { user, logout } = useAuth();
  const { messages } = useMessages(); // Get messages from context
  const navigate = useNavigate(); // For navigation
  const [logoError, setLogoError] = React.useState(false);

  // Calculate unread messages count
  const unreadMessagesCount = messages.filter(m => !m.read).length;
  const unreadNotificationsCount = 4; // Your existing notifications count

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-3">
          {/* Logo */}
          {!logoError ? (
            <img 
              src={companyLogo} 
              alt="Glades International" 
              className="h-10 w-auto object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="h-10 w-10 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">GIC</span>
            </div>
          )}
          <h2 className="text-lg font-semibold text-gray-800">
            Welcome back, {user?.name}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* Messages Button */}
          <button 
            onClick={() => handleNavigation('/messages')}
            className="relative p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all group"
          >
            <EnvelopeIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Notifications Button */}
          <button className="relative p-2 text-gray-400 hover:text-yellow-600 rounded-lg hover:bg-yellow-50 transition-all group">
            <BellIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button 
            onClick={() => handleNavigation('/settings')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all group"
          >
            <Cog6ToothIcon className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  <p className="text-xs text-gray-400 mt-1">{user?.role || 'Administrator'}</p>
                </div>

                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                        Your Profile
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleNavigation('/messages')}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700`}
                      >
                        <div className="flex items-center">
                          <EnvelopeIcon className="mr-3 h-5 w-5 text-gray-400" />
                          Messages
                        </div>
                        {unreadMessagesCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadMessagesCount}
                          </span>
                        )}
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleNavigation('/notifications')}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700`}
                      >
                        <div className="flex items-center">
                          <BellIcon className="mr-3 h-5 w-5 text-gray-400" />
                          Notifications
                        </div>
                        {unreadNotificationsCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadNotificationsCount}
                          </span>
                        )}
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleNavigation('/settings')}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                        Settings
                      </button>
                    )}
                  </Menu.Item>
                </div>

                <div className="border-t border-gray-100 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50`}
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;