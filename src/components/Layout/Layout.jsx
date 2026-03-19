// components/Layout/Layout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProfileDropdown from './ProfileDropdown';
import { BellIcon, ChatBubbleLeftIcon, XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import companyLogo from '../../assets/images/image.png';

const Layout = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(4);
  const [messageCount, setMessageCount] = useState(1);
  const [logoError, setLogoError] = useState(false);
  
  // Refs for dropdowns
  const notificationRef = useRef(null);
  const messagesRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const messagesButtonRef = useRef(null);

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Production Target Achieved',
      message: 'Plant 1 exceeded daily target by 12%',
      time: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Machine Downtime Alert',
      message: 'IM17 has been down for 7 hours - Maintenance required',
      time: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      icon: ExclamationCircleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: 3,
      type: 'info',
      title: 'Shift Change Reminder',
      message: 'Shift B starts in 30 minutes',
      time: new Date(Date.now() - 1000 * 60 * 45),
      read: false,
      icon: ClockIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 4,
      type: 'success',
      title: 'OTIF Performance Update',
      message: 'Overall OTIF improved to 94% this week',
      time: new Date(Date.now() - 1000 * 60 * 120),
      read: true,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]);

  // Mock messages data
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'John Santos',
      avatar: 'JS',
      message: 'Production report for today is ready',
      time: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      department: 'Production'
    },
    {
      id: 2,
      sender: 'Maria Cruz',
      avatar: 'MC',
      message: 'Meeting at 3 PM regarding inventory',
      time: new Date(Date.now() - 1000 * 60 * 30),
      read: true,
      department: 'Inventory'
    },
    {
      id: 3,
      sender: 'Pedro Reyes',
      avatar: 'PR',
      message: 'Machine maintenance scheduled for tomorrow',
      time: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
      department: 'Maintenance'
    }
  ]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target) &&
        !notificationButtonRef.current?.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (
        messagesRef.current && 
        !messagesRef.current.contains(event.target) &&
        !messagesButtonRef.current?.contains(event.target)
      ) {
        setShowMessages(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update unread counts
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
    setMessageCount(messages.filter(m => !m.read).length);
  }, [notifications, messages]);

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
    
    // Navigate to notifications page
    navigate('/notifications');
    setShowNotifications(false);
  };

  const handleViewAllNotifications = () => {
    navigate('/notifications');
    setShowNotifications(false);
  };

  const handleMessageClick = (message) => {
    // Mark as read
    setMessages(messages.map(m => 
      m.id === message.id ? { ...m, read: true } : m
    ));
    
    // Navigate to messages page (you can create this page)
    navigate('/messages');
    setShowMessages(false);
  };

  const handleViewAllMessages = () => {
    navigate('/messages');
    setShowMessages(false);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with Notifications */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6 relative">
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
            <div className="relative">
              <button
                ref={messagesButtonRef}
                onClick={() => {
                  setShowMessages(!showMessages);
                  setShowNotifications(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors duration-200"
              >
                <ChatBubbleLeftIcon className="h-5 w-5 text-gray-600" />
                {messageCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {messageCount}
                  </span>
                )}
              </button>

              {/* Messages Dropdown */}
              {showMessages && (
                <div
                  ref={messagesRef}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50"
                >
                  <div className="p-3 border-b bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-t-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold flex items-center">
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                        Messages ({messageCount} unread)
                      </h3>
                      <button
                        onClick={() => setShowMessages(false)}
                        className="text-white hover:text-gray-200"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          onClick={() => handleMessageClick(message)}
                          className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                            !message.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                !message.read 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-300 text-gray-600'
                              }`}>
                                {message.avatar}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-gray-900">
                                  {message.sender}
                                </p>
                                <span className="text-xs text-gray-400">
                                  {formatDistanceToNow(message.time, { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {message.department}
                              </p>
                              <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                                {message.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <ChatBubbleLeftIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No messages</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 border-t bg-gray-50 rounded-b-lg">
                    <button
                      onClick={handleViewAllMessages}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2 font-medium"
                    >
                      View all messages
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                ref={notificationButtonRef}
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMessages(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors duration-200"
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
                <div
                  ref={notificationRef}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50"
                >
                  <div className="p-3 border-b bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-t-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold flex items-center">
                        <BellIcon className="h-4 w-4 mr-2" />
                        Notifications ({unreadCount} unread)
                      </h3>
                      <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllNotificationsAsRead}
                            className="text-xs bg-blue-800 hover:bg-blue-900 px-2 py-1 rounded transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-white hover:text-gray-200"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.filter(n => !n.read).length > 0 ? (
                      <>
                        {/* Unread notifications */}
                        {notifications.filter(n => !n.read).map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className="p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors bg-blue-50/50"
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-full ${notification.bgColor} ${notification.color} flex-shrink-0`}>
                                <notification.icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <p className="text-sm font-medium text-gray-900">
                                    {notification.title}
                                  </p>
                                  <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {formatDistanceToNow(notification.time, { addSuffix: true })}
                                </p>
                                <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Read notifications (show less) */}
                        {notifications.filter(n => n.read).length > 0 && (
                          <>
                            <div className="p-2 bg-gray-50 border-b">
                              <p className="text-xs text-gray-500 font-medium">Earlier</p>
                            </div>
                            {notifications.filter(n => n.read).slice(0, 2).map((notification) => (
                              <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className="p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`p-2 rounded-full ${notification.bgColor} ${notification.color} flex-shrink-0`}>
                                    <notification.icon className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                      {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {formatDistanceToNow(notification.time, { addSuffix: true })}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                      {notification.message}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </>
                    ) : (
                      <div className="p-8 text-center">
                        <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No new notifications</p>
                        {notifications.filter(n => n.read).length > 0 && (
                          <button
                            onClick={() => navigate('/notifications')}
                            className="text-blue-600 text-sm hover:text-blue-800 mt-2"
                          >
                            View history
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 border-t bg-gray-50 rounded-b-lg">
                    <button
                      onClick={handleViewAllNotifications}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2 font-medium"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
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