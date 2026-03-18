// components/Layout/ProfileDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  UserCircleIcon,
  BellIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef(null);

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Machine Status Update',
      message: 'KMD3 is now running at 101% utilization',
      time: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
      read: false,
      icon: CheckCircleIcon,
      color: 'text-green-500'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Downtime Alert',
      message: 'IM17 has been down for 7 hours',
      time: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      read: false,
      icon: ExclamationCircleIcon,
      color: 'text-red-500'
    },
    {
      id: 3,
      type: 'info',
      title: 'Attendance Update',
      message: 'Shift A attendance rate: 95%',
      time: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: true,
      icon: CheckCircleIcon,
      color: 'text-blue-500'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Low Stock Alert',
      message: '5 items are below reorder level',
      time: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      read: true,
      icon: ExclamationCircleIcon,
      color: 'text-yellow-500'
    }
  ]);

  // Mock messages data
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'Eric Abes',
      fromInitials: 'EA',
      message: 'Machine KMD1 needs maintenance check',
      time: new Date(Date.now() - 1000 * 60 * 10),
      read: false,
      avatar: null
    },
    {
      id: 2,
      from: 'Mary Rose Albia',
      fromInitials: 'MA',
      message: 'Production target for today is updated',
      time: new Date(Date.now() - 1000 * 60 * 25),
      read: false,
      avatar: null
    },
    {
      id: 3,
      from: 'Nancy Atienza',
      fromInitials: 'NA',
      message: 'Shift B attendance report is ready',
      time: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
      avatar: null
    }
  ]);

  // Mock registered users for messenger
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: 1, name: 'Eric Abes', role: 'Production Operator', department: 'Thermoforming', online: true, lastSeen: new Date() },
    { id: 2, name: 'Mary Rose Albia', role: 'Production Supervisor', department: 'MS P1', online: true, lastSeen: new Date() },
    { id: 3, name: 'Nancy Atienza', role: 'Quality Inspector', department: 'QMD', online: false, lastSeen: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 4, name: 'Roselyn Alcazaren', role: 'Machine Operator', department: 'Thermo Lids', online: true, lastSeen: new Date() },
    { id: 5, name: 'Genelyn Agon', role: 'Production Staff', department: 'Injection', online: false, lastSeen: new Date(Date.now() - 1000 * 60 * 45) },
    { id: 6, name: 'Rose Marie Abasula', role: 'Machine Operator', department: 'ICM', online: true, lastSeen: new Date() },
  ]);

  // Mock user profile data
  const [userProfile, setUserProfile] = useState({
    name: user?.name || 'Test User',
    email: user?.email || 'test.user@glades.com',
    role: user?.role || 'Administrator',
    department: 'Production Management',
    employeeId: 'GLD-2024-001',
    joinDate: '2024-01-15',
    phone: '+63 912 345 6789',
    location: 'Plant 1 - Main Office',
    avatar: null,
    bio: 'Production manager overseeing Plant 1 and Plant 2 operations. Focus on efficiency and quality control.'
  });

  // Mock conversation
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowNotifications(false);
        setShowMessages(false);
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markMessageAsRead = (messageId) => {
    setMessages(messages.map(m => 
      m.id === messageId ? { ...m, read: true } : m
    ));
  };

  const startChat = (user) => {
    setActiveChat(user);
    if (!chatMessages[user.id]) {
      setChatMessages({
        ...chatMessages,
        [user.id]: [
          {
            id: 1,
            from: user.name,
            message: `Hello! How can I help you?`,
            time: new Date(),
            isMe: false
          }
        ]
      });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const message = {
      id: Date.now(),
      from: 'Me',
      message: newMessage,
      time: new Date(),
      isMe: true
    };

    setChatMessages({
      ...chatMessages,
      [activeChat.id]: [...(chatMessages[activeChat.id] || []), message]
    });

    setNewMessage('');

    // Simulate reply after 1 second
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        from: activeChat.name,
        message: 'Thanks for your message. I\'ll get back to you shortly.',
        time: new Date(),
        isMe: false
      };
      setChatMessages({
        ...chatMessages,
        [activeChat.id]: [...(chatMessages[activeChat.id] || []), reply]
      });
    }, 1000);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold">
            {userProfile.name.charAt(0)}
          </div>
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">{userProfile.name}</p>
          <p className="text-xs text-gray-500">{userProfile.role}</p>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                {userProfile.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold">{userProfile.name}</p>
                <p className="text-sm text-blue-100">{userProfile.role}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex border-b">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowMessages(false);
                setShowProfile(false);
              }}
              className={`flex-1 py-3 text-center hover:bg-gray-50 transition-colors relative ${
                showNotifications ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
            >
              <BellIcon className="h-5 w-5 mx-auto" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1/4 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
                setShowProfile(false);
              }}
              className={`flex-1 py-3 text-center hover:bg-gray-50 transition-colors relative ${
                showMessages ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
            >
              <ChatBubbleLeftIcon className="h-5 w-5 mx-auto" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1/4 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
                setShowMessages(false);
              }}
              className={`flex-1 py-3 text-center hover:bg-gray-50 transition-colors ${
                showProfile ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
            >
              <UserCircleIcon className="h-5 w-5 mx-auto" />
            </button>
          </div>

          {/* Content Area */}
          <div className="max-h-96 overflow-y-auto">
            {/* Notifications Panel */}
            {showNotifications && (
              <div>
                <div className="flex justify-between items-center p-3 border-b bg-gray-50">
                  <h3 className="font-semibold text-gray-700">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <BellIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <notification.icon className={`h-5 w-5 ${notification.color} mt-0.5`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDistanceToNow(notification.time, { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Messages Panel */}
            {showMessages && (
              <div>
                <div className="p-3 border-b bg-gray-50">
                  <h3 className="font-semibold text-gray-700">Messages</h3>
                </div>
                {activeChat ? (
                  <div className="h-96 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setActiveChat(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ← Back
                        </button>
                        <div>
                          <p className="font-medium">{activeChat.name}</p>
                          <p className="text-xs text-gray-500">{activeChat.department}</p>
                        </div>
                      </div>
                      <span className={`text-xs ${activeChat.online ? 'text-green-600' : 'text-gray-500'}`}>
                        {activeChat.online ? '● Online' : `Last seen ${formatDistanceToNow(activeChat.lastSeen, { addSuffix: true })}`}
                      </span>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {chatMessages[activeChat.id]?.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg ${
                              msg.isMe
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-900 rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${msg.isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                              {formatDistanceToNow(msg.time, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-3 border-t">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 input-field text-sm"
                        />
                        <button
                          onClick={sendMessage}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Registered Users List */}
                    <div className="p-3 border-b bg-gray-50">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Registered Users • {registeredUsers.length} online
                      </h4>
                    </div>
                    {registeredUsers.map(user => (
                      <div
                        key={user.id}
                        onClick={() => startChat(user)}
                        className="p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                              user.online ? 'bg-green-400' : 'bg-gray-400'
                            }`}></span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.role} • {user.department}</p>
                          </div>
                          {user.online && (
                            <span className="text-xs text-green-600">Online</span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Recent Messages */}
                    <div className="p-3 border-b bg-gray-50">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Recent Messages
                      </h4>
                    </div>
                    {messages.map(message => (
                      <div
                        key={message.id}
                        onClick={() => markMessageAsRead(message.id)}
                        className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                          !message.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm">
                            {message.fromInitials}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{message.from}</p>
                            <p className="text-xs text-gray-600 truncate">{message.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(message.time, { addSuffix: true })}
                            </p>
                          </div>
                          {!message.read && (
                            <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Profile Panel */}
            {showProfile && (
              <div className="p-4">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-2">
                    {userProfile.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-lg">{userProfile.name}</h3>
                  <p className="text-sm text-gray-500">{userProfile.role}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{userProfile.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{userProfile.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{userProfile.department}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Joined {new Date(userProfile.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">Employee ID: {userProfile.employeeId}</p>
                  <p className="text-xs text-gray-500 mb-2">Location: {userProfile.location}</p>
                  <p className="text-xs text-gray-600 mt-2">{userProfile.bio}</p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Link
                    to="/profile"
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    View Full Profile
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t p-2">
            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Cog6ToothIcon className="h-4 w-4 mr-3" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;