// components/Notifications/NotificationsPage.jsx
import React, { useState } from 'react';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ClockIcon,
  TrashIcon,
  CheckIcon,
  FunnelIcon,
  XMarkIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon,
  Cog6ToothIcon,  // Added this
  UsersIcon,       // Added this
  ArrowTrendingUpIcon, // Added this
  TruckIcon,       // Added this
  ChartBarIcon,    // Added this
  CubeIcon,        // Added this
  ArrowRightIcon,  // Added this
  WrenchScrewdriverIcon // Alternative to Cog6ToothIcon if needed
} from '@heroicons/react/24/outline';
import { formatDistanceToNow, format } from 'date-fns';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteContent, setNoteContent] = useState('');
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
      bgColor: 'bg-green-100',
      details: {
        plant: 'Plant 1',
        target: '10,000 units',
        achieved: '11,200 units',
        percentage: '112%',
        shift: 'Morning Shift',
        supervisor: 'Juan Dela Cruz',
        notes: 'Excellent performance from the morning team. Machine efficiency was at 95%.'
      }
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
      bgColor: 'bg-red-100',
      details: {
        machine: 'Injection Molding Machine 17 (IM17)',
        downtime: '7 hours',
        reason: 'Hydraulic system failure',
        maintenanceTeam: 'Team B',
        priority: 'High',
        estimatedRepair: '2 hours',
        location: 'Plant 2 - Section A',
        assignedTo: 'Maria Santos'
      }
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
      bgColor: 'bg-blue-100',
      details: {
        currentShift: 'Shift A',
        nextShift: 'Shift B',
        startTime: '3:00 PM',
        workers: '24 workers expected',
        supervisor: 'Pedro Reyes',
        productionPlan: 'Product Line X-200',
        notes: 'Pre-shift meeting at 2:45 PM at the main conference room'
      }
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
      bgColor: 'bg-green-100',
      details: {
        otifRate: '94%',
        previousRate: '89%',
        improvement: '+5%',
        ordersCompleted: '235 out of 250',
        onTimeDeliveries: '235',
        fullDeliveries: '242',
        topPerformer: 'Logistics Team A',
      }
    },
    {
      id: 5,
      type: 'warning',
      title: 'Low Stock Alert',
      message: '5 items are below reorder level',
      time: new Date(Date.now() - 1000 * 60 * 180),
      read: true,
      icon: ExclamationCircleIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      details: {
        items: [
          { name: 'Raw Material A', current: '50 kg', reorderLevel: '100 kg' },
          { name: 'Packaging B', current: '200 pcs', reorderLevel: '500 pcs' },
          { name: 'Component C', current: '15 units', reorderLevel: '50 units' },
          { name: 'Chemical D', current: '25 L', reorderLevel: '100 L' },
          { name: 'Spare Part E', current: '3 pcs', reorderLevel: '10 pcs' }
        ],
        urgentItems: 3,
        suggestedOrder: 'Place order within 24 hours',
        supplier: 'Various Suppliers'
      }
    },
    {
      id: 6,
      type: 'info',
      title: 'New Report Available',
      message: 'Monthly production report is ready for review',
      time: new Date(Date.now() - 1000 * 60 * 240),
      read: true,
      icon: InformationCircleIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      details: {
        reportType: 'Monthly Production Summary',
        period: 'February 1-28, 2026',
        totalProduction: '45,678 units',
        efficiency: '92%',
        downtime: '23 hours',
        topProduct: 'Product X-100 (12,345 units)',
        preparedBy: 'Analytics Department',
        fileName: 'production_report_feb2026.pdf',
        fileSize: '2.4 MB'
      }
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
      setShowNoteModal(false);
    }
  };

  const deleteAllRead = () => {
    setNotifications(notifications.filter(n => !n.read));
    if (selectedNotification && notifications.find(n => n.id === selectedNotification.id)?.read) {
      setSelectedNotification(null);
      setShowNoteModal(false);
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setNoteContent('');
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleAddNote = () => {
    if (noteContent.trim()) {
      // Here you would typically save the note to your backend
      alert(`Note added: ${noteContent}`);
      setNoteContent('');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BellIcon className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-blue-100 mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-blue-50 text-sm font-medium flex items-center"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Mark all as read
              </button>
            )}
            <button
              onClick={deleteAllRead}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Clear read
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              filter === 'unread' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              filter === 'read' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List - Left Column */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-300px)] overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
              <p className="text-gray-500 mt-1">
                {filter === 'unread' 
                  ? 'You have no unread notifications' 
                  : filter === 'read'
                  ? 'No read notifications'
                  : 'No notifications to display'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  } ${selectedNotification?.id === notification.id ? 'border-l-4 border-blue-600 bg-blue-50' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className={`p-2 rounded-full ${notification.bgColor} ${notification.color} flex-shrink-0`}>
                      <notification.icon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center mt-2 text-xs">
                        <span className="text-gray-400">
                          {formatDistanceToNow(notification.time, { addSuffix: true })}
                        </span>
                        <span className="mx-1 text-gray-300">•</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                          notification.type === 'success' ? 'bg-green-100 text-green-800' :
                          notification.type === 'warning' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {notification.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification Details - Right Column */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-300px)] overflow-y-auto">
          {selectedNotification ? (
            <div className="p-6">
              {/* Back button for mobile */}
              <button 
                onClick={() => setSelectedNotification(null)}
                className="lg:hidden flex items-center text-sm text-gray-600 mb-4 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to notifications
              </button>

              {/* Notification Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-full ${selectedNotification.bgColor} ${selectedNotification.color}`}>
                    <selectedNotification.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedNotification.title}</h2>
                    <p className="text-gray-600 mt-1">{selectedNotification.message}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => deleteNotification(selectedNotification.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="text-sm font-medium text-gray-900">
                      {format(selectedNotification.time, 'MMMM d, yyyy')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(selectedNotification.time, 'h:mm:ss a')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                      selectedNotification.type === 'success' ? 'bg-green-100 text-green-800' :
                      selectedNotification.type === 'warning' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedNotification.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedNotification.read ? 'Read' : 'Unread'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {selectedNotification.id === 1 && ( // Production Target
                    <div className="space-y-3">
                      <DetailRow icon={BuildingOfficeIcon} label="Plant" value={selectedNotification.details.plant} />
                      <DetailRow icon={DocumentTextIcon} label="Target" value={selectedNotification.details.target} />
                      <DetailRow icon={CheckCircleIcon} label="Achieved" value={selectedNotification.details.achieved} />
                      <DetailRow icon={CheckIcon} label="Percentage" value={selectedNotification.details.percentage} />
                      <DetailRow icon={ClockIcon} label="Shift" value={selectedNotification.details.shift} />
                      <DetailRow icon={UserIcon} label="Supervisor" value={selectedNotification.details.supervisor} />
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-700">{selectedNotification.details.notes}</p>
                      </div>
                    </div>
                  )}

                  {selectedNotification.id === 2 && ( // Machine Downtime
                    <div className="space-y-3">
                      <DetailRow icon={Cog6ToothIcon} label="Machine" value={selectedNotification.details.machine} />
                      <DetailRow icon={ClockIcon} label="Downtime" value={selectedNotification.details.downtime} />
                      <DetailRow icon={ExclamationCircleIcon} label="Reason" value={selectedNotification.details.reason} />
                      <DetailRow icon={UsersIcon} label="Maintenance Team" value={selectedNotification.details.maintenanceTeam} />
                      <DetailRow icon={ArrowTrendingUpIcon} label="Priority" value={selectedNotification.details.priority} />
                      <DetailRow icon={ClockIcon} label="Est. Repair" value={selectedNotification.details.estimatedRepair} />
                      <DetailRow icon={BuildingOfficeIcon} label="Location" value={selectedNotification.details.location} />
                      <DetailRow icon={UserIcon} label="Assigned To" value={selectedNotification.details.assignedTo} />
                    </div>
                  )}

                  {selectedNotification.id === 3 && ( // Shift Change
                    <div className="space-y-3">
                      <DetailRow icon={ClockIcon} label="Current Shift" value={selectedNotification.details.currentShift} />
                      <DetailRow icon={ArrowRightIcon} label="Next Shift" value={selectedNotification.details.nextShift} />
                      <DetailRow icon={ClockIcon} label="Start Time" value={selectedNotification.details.startTime} />
                      <DetailRow icon={UsersIcon} label="Workers" value={selectedNotification.details.workers} />
                      <DetailRow icon={UserIcon} label="Supervisor" value={selectedNotification.details.supervisor} />
                      <DetailRow icon={DocumentTextIcon} label="Production Plan" value={selectedNotification.details.productionPlan} />
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-700">{selectedNotification.details.notes}</p>
                      </div>
                    </div>
                  )}

                  {selectedNotification.id === 4 && ( // OTIF Update
                    <div className="space-y-3">
                      <DetailRow icon={CheckCircleIcon} label="OTIF Rate" value={selectedNotification.details.otifRate} />
                      <DetailRow icon={ArrowTrendingUpIcon} label="Previous Rate" value={selectedNotification.details.previousRate} />
                      <DetailRow icon={ArrowTrendingUpIcon} label="Improvement" value={selectedNotification.details.improvement} />
                      <DetailRow icon={DocumentTextIcon} label="Orders Completed" value={selectedNotification.details.ordersCompleted} />
                      <DetailRow icon={TruckIcon} label="On Time" value={selectedNotification.details.onTimeDeliveries} />
                      <DetailRow icon={CheckCircleIcon} label="Full Deliveries" value={selectedNotification.details.fullDeliveries} />
                      <DetailRow icon={UserIcon} label="Top Performer" value={selectedNotification.details.topPerformer} />
                    </div>
                  )}

                  {selectedNotification.id === 5 && ( // Low Stock
                    <div>
                      <div className="space-y-3 mb-4">
                        <DetailRow icon={ExclamationCircleIcon} label="Urgent Items" value={selectedNotification.details.urgentItems.toString()} />
                        <DetailRow icon={ClockIcon} label="Suggested Action" value={selectedNotification.details.suggestedOrder} />
                        <DetailRow icon={TruckIcon} label="Supplier" value={selectedNotification.details.supplier} />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Low Stock Items:</h4>
                      <div className="space-y-2">
                        {selectedNotification.details.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm bg-white p-2 rounded border">
                            <span className="text-gray-700">{item.name}</span>
                            <span className="font-medium text-gray-900">
                              {item.current} / {item.reorderLevel}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedNotification.id === 6 && ( // New Report
                    <div className="space-y-3">
                      <DetailRow icon={DocumentTextIcon} label="Report Type" value={selectedNotification.details.reportType} />
                      <DetailRow icon={CalendarIcon} label="Period" value={selectedNotification.details.period} />
                      <DetailRow icon={CubeIcon} label="Total Production" value={selectedNotification.details.totalProduction} />
                      <DetailRow icon={ChartBarIcon} label="Efficiency" value={selectedNotification.details.efficiency} />
                      <DetailRow icon={ClockIcon} label="Downtime" value={selectedNotification.details.downtime} />
                      <DetailRow icon={CheckCircleIcon} label="Top Product" value={selectedNotification.details.topProduct} />
                      <DetailRow icon={UserIcon} label="Prepared By" value={selectedNotification.details.preparedBy} />
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-500">File: {selectedNotification.details.fileName} ({selectedNotification.details.fileSize})</p>
                        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                          Download Report
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Add a note about this notification..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleAddNote}
                      disabled={!noteContent.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12">
              <div className="text-center">
                <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Select a notification</h3>
                <p className="text-gray-500 mt-1">
                  Click on a notification from the list to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • Notification Center
      </div>
    </div>
  );
};

// Helper component for detail rows
const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start">
    {Icon && <Icon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />}
    <div className="flex-1">
      <span className="text-xs text-gray-500 block">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value}</span>
    </div>
  </div>
);

export default NotificationsPage;