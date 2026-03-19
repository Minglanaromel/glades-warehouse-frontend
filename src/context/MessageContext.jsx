// context/MessageContext.jsx
import React, { createContext, useState, useContext } from 'react';

const MessageContext = createContext();

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'John Santos',
      senderAvatar: 'JS',
      subject: 'Production Schedule Update',
      preview: 'Please review the updated production schedule for next week...',
      content: 'Please review the updated production schedule for next week. We have made some adjustments to accommodate the new orders. Let me know if you have any questions.',
      date: '2024-03-19T09:30:00',
      time: '09:30 AM',
      read: false,
      priority: 'high',
      category: 'work',
      attachments: []
    },
    {
      id: 2,
      sender: 'Maria Cruz',
      senderAvatar: 'MC',
      subject: 'Quality Report - Plant 2',
      preview: 'The quality report for Plant 2 shows improvement in...',
      content: 'The quality report for Plant 2 shows improvement in defect rates. We are now at 98.5% quality rate. Great job team!',
      date: '2024-03-19T10:15:00',
      time: '10:15 AM',
      read: true,
      priority: 'medium',
      category: 'work',
      attachments: ['quality_report.pdf']
    },
    {
      id: 3,
      sender: 'HR Department',
      senderAvatar: 'HR',
      subject: 'Team Building Activity',
      preview: 'We are organizing a team building activity on Friday...',
      content: 'We are organizing a team building activity on Friday at 3 PM at the main conference room. Please confirm your attendance.',
      date: '2024-03-19T11:00:00',
      time: '11:00 AM',
      read: false,
      priority: 'low',
      category: 'social',
      attachments: []
    },
    {
      id: 4,
      sender: 'Maintenance Team',
      senderAvatar: 'MT',
      subject: 'Equipment Maintenance Schedule',
      preview: 'Scheduled maintenance for Plant 1 equipment...',
      content: 'Scheduled maintenance for Plant 1 equipment will be on Saturday. Please ensure all machines are properly shut down by Friday end of shift.',
      date: '2024-03-18T14:20:00',
      time: '02:20 PM',
      read: true,
      priority: 'high',
      category: 'work',
      attachments: ['maintenance_schedule.xlsx']
    },
    {
      id: 5,
      sender: 'Admin',
      senderAvatar: 'AD',
      subject: 'System Update Notification',
      preview: 'The system will be undergoing maintenance on...',
      content: 'The system will be undergoing maintenance on Sunday from 2 AM to 4 AM. Please save all your work before logging out on Saturday.',
      date: '2024-03-18T09:00:00',
      time: '09:00 AM',
      read: false,
      priority: 'medium',
      category: 'system',
      attachments: []
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [composeModal, setComposeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const markAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const deleteMessage = (messageId) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
      setShowMessageModal(false);
    }
  };

  const archiveMessage = (messageId) => {
    console.log('Archiving message:', messageId);
  };

  const sendMessage = (newMessage) => {
    const message = {
      id: messages.length + 1,
      ...newMessage,
      date: new Date().toISOString(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: true,
      sender: 'You',
      senderAvatar: 'YO'
    };
    setMessages([message, ...messages]);
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || msg.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MessageContext.Provider value={{
      messages: filteredMessages,
      allMessages: messages,
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
    }}>
      {children}
    </MessageContext.Provider>
  );
};