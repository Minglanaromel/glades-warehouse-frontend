// components/Messages/MessagesPage.jsx
import React from 'react';
import { useMessages } from '../../context/MessageContext';
import MessageModal from './MessageModal';
import ComposeMessageModal from './ComposeMessageModal';
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const MessagesPage = () => {
  const {
    messages,
    selectedMessage,
    setSelectedMessage,
    showMessageModal,
    setShowMessageModal,
    composeModal,
    setComposeModal,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    markAsRead,
    deleteMessage,
    archiveMessage,
    sendMessage
  } = useMessages();

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <StarIcon className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'work': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-blue-100 mt-1">
              {unreadCount > 0 ? `You have ${unreadCount} unread messages` : 'No unread messages'}
            </p>
          </div>
          <button
            onClick={() => setComposeModal(true)}
            className="flex items-center px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition"
          >
            <PaperAirplaneIcon className="h-5 w-5 mr-2" />
            Compose Message
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="social">Social</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => handleMessageClick(message)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                  !message.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    !message.read ? 'bg-gradient-to-r from-blue-600 to-blue-800' : 'bg-gray-400'
                  }`}>
                    {message.senderAvatar}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{message.sender}</span>
                        {!message.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-1">
                      {getPriorityIcon(message.priority)}
                      <span className="text-sm font-medium text-gray-900">{message.subject}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate">{message.preview}</p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(message.category)}`}>
                        {message.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showMessageModal && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setShowMessageModal(false)}
          onDelete={deleteMessage}
          onArchive={archiveMessage}
        />
      )}

      {composeModal && (
        <ComposeMessageModal
          onClose={() => setComposeModal(false)}
          onSend={sendMessage}
        />
      )}
    </div>
  );
};

export default MessagesPage;