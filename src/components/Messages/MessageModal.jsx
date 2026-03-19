// components/Messages/MessageModal.jsx
import React from 'react';
import {
  XMarkIcon,
  StarIcon,
  ArchiveBoxIcon,
  TrashIcon,
  ArrowLeftIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const MessageModal = ({ message, onClose, onDelete, onArchive }) => {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'medium': return <StarIcon className="h-4 w-4" />;
      case 'low': return <CheckCircleIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-blue-700 text-white flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-1 hover:bg-blue-800 rounded-full transition"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold">{message.subject}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getPriorityColor(message.priority)}`}>
              {getPriorityIcon(message.priority)}
              <span className="capitalize">{message.priority} Priority</span>
            </span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-blue-800 rounded-full transition"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Message Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Sender Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-lg">
                {message.senderAvatar}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{message.sender}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(message.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} at {message.time}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-gray-100 rounded-full transition">
                <StarIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onArchive(message.id)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-full transition"
              >
                <ArchiveBoxIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onDelete(message.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-full transition"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Message Body */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-line">{message.content}</p>
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="border-t pt-4 mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <PaperClipIcon className="h-4 w-4 mr-2" />
                Attachments ({message.attachments.length})
              </h4>
              <div className="space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded">
                        <span className="text-xs font-medium text-blue-800">
                          {attachment.split('.').pop().toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">{attachment}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply Section */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Reply</h4>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center text-white font-bold text-sm">
                YO
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Write your reply..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex justify-end mt-2">
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;