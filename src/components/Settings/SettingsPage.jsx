// components/Settings/SettingsPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BuildingOfficeIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  CogIcon,  // ← Ito ang na-add na fix
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');

  // Profile Settings
  const [profile, setProfile] = useState({
    name: user?.name || 'Test User',
    email: user?.email || 'test.user@glades.com',
    role: user?.role || 'Administrator',
    department: 'Production Management',
    employeeId: 'GLD-2024-001',
    phone: '+63 912 345 6789',
    location: 'Plant 1 - Main Office',
    bio: 'Production manager overseeing Plant 1 and Plant 2 operations.'
  });

  const [editForm, setEditForm] = useState({ ...profile });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    desktopNotifications: false,
    smsAlerts: false,
    productionAlerts: true,
    downtimeAlerts: true,
    attendanceUpdates: true,
    lowStockAlerts: true,
    reportUpdates: false,
    marketingEmails: false
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginAlerts: true,
    deviceManagement: true
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    companyName: 'GLADES INTERNATIONAL CORPORATION',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    firstDayOfWeek: 'monday',
    currency: 'PHP',
    timezone: 'Asia/Manila'
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
    { id: 'system', name: 'System', icon: CogIcon }, // ← Dito ginamit ang CogIcon
    { id: 'billing', name: 'Billing', icon: DocumentTextIcon },
  ];

  const handleSaveProfile = () => {
    setProfile(editForm);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancelEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Notification settings updated');
  };

  const handleSecurityChange = (key, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Security settings updated');
  };

  const handleSystemChange = (key, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('System settings updated');
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    toast.success(`Theme changed to ${newTheme}`);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    toast.success(`Language changed to ${lang === 'en' ? 'English' : 'Filipino'}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with GLADES branding */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          <CogIcon className="h-8 w-8 text-gray-300" /> {/* ← Dito rin ginamit ang CogIcon */}
          <div>
            <h1 className="text-2xl font-bold tracking-wider">Settings</h1>
            <p className="text-gray-300 mt-1">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className={`h-5 w-5 mr-3 ${
                activeTab === tab.id ? 'text-white' : 'text-gray-400'
              }`} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {!isEditing ? (
                    <p className="text-gray-900">{profile.name}</p>
                  ) : (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="input-field w-full"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  {!isEditing ? (
                    <p className="text-gray-900">{profile.email}</p>
                  ) : (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="input-field w-full"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {!isEditing ? (
                    <p className="text-gray-900">{profile.phone}</p>
                  ) : (
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="input-field w-full"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  {!isEditing ? (
                    <p className="text-gray-900">{profile.department}</p>
                  ) : (
                    <input
                      type="text"
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      className="input-field w-full"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <p className="text-gray-900">{profile.employeeId}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <p className="text-gray-900">{profile.role}</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  {!isEditing ? (
                    <p className="text-gray-900">{profile.bio}</p>
                  ) : (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="input-field w-full"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={() => handleNotificationChange('emailNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-500">Receive mobile push notifications</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={() => handleNotificationChange('pushNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ComputerDesktopIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Desktop Notifications</p>
                      <p className="text-sm text-gray-500">Show notifications on desktop</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.desktopNotifications}
                      onChange={() => handleNotificationChange('desktopNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-3">Alert Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.productionAlerts}
                        onChange={() => handleNotificationChange('productionAlerts')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">Production Alerts</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.downtimeAlerts}
                        onChange={() => handleNotificationChange('downtimeAlerts')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">Downtime Alerts</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.attendanceUpdates}
                        onChange={() => handleNotificationChange('attendanceUpdates')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">Attendance Updates</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.lowStockAlerts}
                        onChange={() => handleNotificationChange('lowStockAlerts')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">Low Stock Alerts</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ShieldCheckIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Session Timeout</p>
                        <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                      </div>
                    </div>
                    <select
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                      className="input-field w-32"
                    >
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="240">4 hours</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BellIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Login Alerts</p>
                        <p className="text-sm text-gray-500">Get notified of new sign-ins</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.loginAlerts}
                        onChange={(e) => handleSecurityChange('loginAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <LockClosedIcon className="h-4 w-4 mr-2" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Appearance Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`p-4 border rounded-lg text-center transition ${
                        theme === 'light' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <SunIcon className={`h-6 w-6 mx-auto mb-2 ${
                        theme === 'light' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <span className={`text-sm ${
                        theme === 'light' ? 'text-blue-600 font-medium' : 'text-gray-600'
                      }`}>Light</span>
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`p-4 border rounded-lg text-center transition ${
                        theme === 'dark' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <MoonIcon className={`h-6 w-6 mx-auto mb-2 ${
                        theme === 'dark' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-blue-600 font-medium' : 'text-gray-600'
                      }`}>Dark</span>
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange('system')}
                      className={`p-4 border rounded-lg text-center transition ${
                        theme === 'system' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <ComputerDesktopIcon className={`h-6 w-6 mx-auto mb-2 ${
                        theme === 'system' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <span className={`text-sm ${
                        theme === 'system' ? 'text-blue-600 font-medium' : 'text-gray-600'
                      }`}>System</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`p-4 border rounded-lg text-center transition ${
                        language === 'en' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        language === 'en' ? 'text-blue-600' : 'text-gray-600'
                      }`}>English</span>
                    </button>
                    
                    <button
                      onClick={() => handleLanguageChange('fil')}
                      className={`p-4 border rounded-lg text-center transition ${
                        language === 'fil' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        language === 'fil' ? 'text-blue-600' : 'text-gray-600'
                      }`}>Filipino</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={systemSettings.companyName}
                    onChange={(e) => handleSystemChange('companyName', e.target.value)}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Format
                  </label>
                  <select
                    value={systemSettings.dateFormat}
                    onChange={(e) => handleSystemChange('dateFormat', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Format
                  </label>
                  <select
                    value={systemSettings.timeFormat}
                    onChange={(e) => handleSystemChange('timeFormat', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="12h">12-hour (12:00 PM)</option>
                    <option value="24h">24-hour (13:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Day of Week
                  </label>
                  <select
                    value={systemSettings.firstDayOfWeek}
                    onChange={(e) => handleSystemChange('firstDayOfWeek', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={systemSettings.currency}
                    onChange={(e) => handleSystemChange('currency', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="PHP">Philippine Peso (PHP)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    value={systemSettings.timezone}
                    onChange={(e) => handleSystemChange('timezone', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                    <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                    <option value="America/New_York">America/New York (GMT-5)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">System Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm"><span className="text-gray-500">Version:</span> <span className="text-gray-900">2.0.0</span></p>
                  <p className="text-sm"><span className="text-gray-500">Last Updated:</span> <span className="text-gray-900">March 18, 2026</span></p>
                  <p className="text-sm"><span className="text-gray-500">Environment:</span> <span className="text-gray-900">Production</span></p>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Billing & Subscription</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Current Plan</p>
                    <p className="text-2xl font-bold text-gray-900">Enterprise</p>
                    <p className="text-sm text-gray-600 mt-1">₱50,000/month</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Upgrade Plan
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Next billing date:</span>
                    <span className="text-gray-900 font-medium">April 1, 2026</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Payment method:</span>
                    <span className="text-gray-900 font-medium">Visa ending in 4242</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-3">Billing History</h3>
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm text-gray-500">Date</th>
                      <th className="text-left py-2 text-sm text-gray-500">Amount</th>
                      <th className="text-left py-2 text-sm text-gray-500">Status</th>
                      <th className="text-left py-2 text-sm text-gray-500">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-sm">Mar 1, 2026</td>
                      <td className="py-2 text-sm">₱50,000</td>
                      <td className="py-2 text-sm"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span></td>
                      <td className="py-2 text-sm">
                        <button className="text-blue-600 hover:text-blue-800">Download</button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-sm">Feb 1, 2026</td>
                      <td className="py-2 text-sm">₱50,000</td>
                      <td className="py-2 text-sm"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span></td>
                      <td className="py-2 text-sm">
                        <button className="text-blue-600 hover:text-blue-800">Download</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • Settings v2.0.0
      </div>
    </div>
  );
};

export default SettingsPage;