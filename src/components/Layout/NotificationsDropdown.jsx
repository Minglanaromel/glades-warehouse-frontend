// components/Layout/NotificationsDropdown.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  ClockIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

const NotificationsDropdown = ({ onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Production Target Achieved',
      message: 'Plant 1 exceeded daily target by 12%',
      time: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      read: false,
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/production-dashboard'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Machine Downtime Alert',
      message: 'IM17 has been down for 7 hours - Maintenance required',
      time: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      read: false,
      icon: ExclamationCircleIcon,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      link: '/downtime-monitor'
    },
    {
      id: 3,
      type: 'info',
      title: 'Shift Change Reminder',
      message: 'Shift B starts in 30 minutes',
      time: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      read: false,
      icon: ClockIcon,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/attendance'
    },
    {
      id: 4,
      type: 'info',
      title: 'New Employee Added',
      message: 'Juan Dela Cruz has joined the Injection department',
      time: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: false,
      icon: InformationCircleIcon,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      link: '/users'
    },
    {
      id: 5,
      type: 'success',
      title: 'OTIF Performance Update',
      message: 'Overall OTIF improved to 94% this week',
      time: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      read: true,
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/reports'
    },
    {
      id: 6,
      type: 'warning',
      title: 'Low Stock Alert',
      message: '5 items are below reorder level - Check inventory',
      time: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
      read: true,
      icon: ExclamationCircleIcon,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      link: '/stock-items'
    }
  ]);

  const [filter, setFilter] = useState('all'); // 'all', 'unread'

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BellIcon className="h-5 w-5" />
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex border-b bg-gray-50 p-2">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${
            filter === 'all' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${
            filter === 'unread' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <>
            {unreadCount > 0 && filter === 'all' && (
              <div className="p-2 border-b bg-gray-50">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark all as read
                </button>
              </div>
            )}

            {filteredNotifications.map((notification) => (
              <Link
                key={notification.id}
                to={notification.link}
                onClick={() => markAsRead(notification.id)}
                className={`block p-4 border-b hover:bg-gray-50 transition-colors ${
                  !notification.read ? notification.bgColor : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className={`flex-shrink-0 ${notification.textColor}`}>
                    <notification.icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className={`text-sm font-medium ${
                        !notification.read ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {notification.title}
                      </p>
                      <button
                        onClick={(e) => deleteNotification(notification.id, e)}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(notification.time, { addSuffix: true })}
                    </p>
                  </div>

                  {/* Unread Dot */}
                  {!notification.read && (
                    <span className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></span>
                  )}
                </div>
              </Link>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50 rounded-b-lg">
        <Link
          to="/notifications"
          className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          onClick={onClose}
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationsDropdown;