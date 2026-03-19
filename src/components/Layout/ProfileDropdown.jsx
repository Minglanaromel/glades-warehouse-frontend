// components/Layout/ProfileDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  BriefcaseIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  HeartIcon,
  CameraIcon,  // Added for camera/upload
  PhotoIcon,   // Added for photo gallery
  TrashIcon    // Added for delete
} from '@heroicons/react/24/outline';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // User data state with profile picture
  const [userData, setUserData] = useState({
    name: user?.name || 'Test User',
    email: user?.email || 'test.user@glades.com',
    position: user?.position || 'Production Manager',
    employeeId: user?.employeeId || 'GLD-2024-001',
    phone: user?.phone || '+63 912 345 6789',
    alternatePhone: user?.alternatePhone || '+63 998 765 4321',
    personalEmail: user?.personalEmail || 'test.user@gmail.com',
    department: user?.department || 'Production Management',
    location: user?.location || 'Plant 1 - Main Office',
    joinDate: user?.joinDate || '2024-01-15',
    emergencyContact: user?.emergencyContact || 'Maria Santos - +63 917 123 4567',
    bloodType: user?.bloodType || 'O+',
    birthday: user?.birthday || '1990-05-20',
    profilePicture: user?.profilePicture || null // Store profile picture URL
  });

  // Edit form state
  const [editForm, setEditForm] = useState({ ...userData });
  
  // Profile picture preview
  const [profilePicturePreview, setProfilePicturePreview] = useState(userData.profilePicture);
  const [selectedFile, setSelectedFile] = useState(null);

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    emailNotifications: true,
    smsAlerts: false,
    trustedDevices: [
      { id: 1, name: 'Chrome on Windows', location: 'Manila, PH', lastActive: '2 hours ago', current: true },
      { id: 2, name: 'Safari on iPhone', location: 'Manila, PH', lastActive: '2 days ago', current: false }
    ],
    recentActivity: [
      { id: 1, action: 'Login successful', location: 'Manila, PH', device: 'Chrome on Windows', time: '2 hours ago' },
      { id: 2, action: 'Password changed', location: 'Manila, PH', device: 'Chrome on Windows', time: '3 days ago' },
      { id: 3, action: 'Login failed', location: 'Unknown', device: 'Firefox on Mac', time: '5 days ago' }
    ]
  });

  // Connected accounts state
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: {
      connected: true,
      email: 'test.user@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/...'
    },
    microsoft: {
      connected: false,
      email: ''
    },
    slack: {
      connected: true,
      team: 'glades-team'
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
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
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleSavePersonalInfo = () => {
    setUserData(editForm);
    setIsEditingPersonalInfo(false);
    // Here you would typically save to backend
    alert('Personal information updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditForm({ ...userData });
    setIsEditingPersonalInfo(false);
  };

  const handleSecurityChange = (setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleRemoveDevice = (deviceId) => {
    setSecuritySettings(prev => ({
      ...prev,
      trustedDevices: prev.trustedDevices.filter(d => d.id !== deviceId)
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Profile picture handlers
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfilePicture = () => {
    if (selectedFile) {
      // Here you would typically upload to server
      // For now, we'll just update the local state
      setUserData(prev => ({
        ...prev,
        profilePicture: profilePicturePreview
      }));
      setEditForm(prev => ({
        ...prev,
        profilePicture: profilePicturePreview
      }));
      setShowProfilePictureModal(false);
      setSelectedFile(null);
      alert('Profile picture updated successfully!');
    }
  };

  const handleRemoveProfilePicture = () => {
    setUserData(prev => ({
      ...prev,
      profilePicture: null
    }));
    setEditForm(prev => ({
      ...prev,
      profilePicture: null
    }));
    setProfilePicturePreview(null);
    setSelectedFile(null);
    setShowProfilePictureModal(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-1 transition-colors duration-200"
        >
          {/* Profile Picture in Dropdown Button */}
          <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center">
            {userData.profilePicture ? (
              <img 
                src={userData.profilePicture} 
                alt={userData.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-medium">
                {getInitials(userData.name)}
              </span>
            )}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-700">{userData.name}</p>
            <p className="text-xs text-gray-500">{userData.position}</p>
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50">
            {/* User Info with Profile Picture */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
                  {userData.profilePicture ? (
                    <img 
                      src={userData.profilePicture} 
                      alt={userData.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-lg font-bold">
                      {getInitials(userData.name)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{userData.name}</p>
                  <p className="text-xs text-blue-100">{userData.email}</p>
                  <p className="text-xs text-blue-200 mt-1">{userData.position}</p>
                  <p className="text-xs text-blue-300">ID: {userData.employeeId}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {/* Personal Information Button */}
              <button
                onClick={() => {
                  setShowPersonalInfoModal(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <UserCircleIcon className="h-5 w-5 mr-3 text-gray-500" />
                Personal Information
              </button>

              <button
                onClick={() => handleNavigation('/settings')}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-500" />
                Settings
              </button>

              <button
                onClick={() => handleNavigation('/notifications')}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <BellIcon className="h-5 w-5 mr-3 text-gray-500" />
                Notifications
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  4
                </span>
              </button>

              {/* Security Button */}
              <button
                onClick={() => {
                  setShowSecurityModal(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <ShieldCheckIcon className="h-5 w-5 mr-3 text-gray-500" />
                Security
              </button>

              <div className="border-t my-2"></div>

              <button
                onClick={() => handleNavigation('/help')}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <QuestionMarkCircleIcon className="h-5 w-5 mr-3 text-gray-500" />
                Help & Support
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-red-500" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Personal Information Modal */}
      {showPersonalInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <UserCircleIcon className="h-8 w-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Personal Information</h2>
                    <p className="text-blue-100 text-sm mt-1">Manage your personal details and contact information</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPersonalInfoModal(false);
                    setIsEditingPersonalInfo(false);
                    setEditForm({ ...userData });
                  }}
                  className="text-white hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Profile Picture Section */}
              <div className="mb-8 flex items-center space-x-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center border-4 border-white shadow-lg">
                    {editForm.profilePicture ? (
                      <img 
                        src={editForm.profilePicture} 
                        alt={editForm.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-3xl font-bold">
                        {getInitials(editForm.name)}
                      </span>
                    )}
                  </div>
                  {isEditingPersonalInfo && (
                    <button
                      onClick={() => setShowProfilePictureModal(true)}
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg"
                    >
                      <CameraIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{editForm.name}</h3>
                  <p className="text-gray-600">{editForm.position}</p>
                  <p className="text-sm text-gray-500 mt-1">Employee ID: {editForm.employeeId}</p>
                </div>
              </div>

              {/* Edit/Save Buttons */}
              <div className="flex justify-end mb-6">
                {!isEditingPersonalInfo ? (
                  <button
                    onClick={() => setIsEditingPersonalInfo(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Information
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSavePersonalInfo}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      <XMarkIcon className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                  
                  <InfoField
                    label="Full Name"
                    value={userData.name}
                    icon={UserIcon}
                    isEditing={isEditingPersonalInfo}
                    editValue={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                  
                  <InfoField
                    label="Position / Job Title"
                    value={userData.position}
                    icon={BriefcaseIcon}
                    isEditing={isEditingPersonalInfo}
                    editValue={editForm.position}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                  />
                  
                  <InfoField
                    label="Employee ID"
                    value={userData.employeeId}
                    icon={IdentificationIcon}
                    isEditing={isEditingPersonalInfo}
                    editValue={editForm.employeeId}
                    onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })}
                  />
                  
                  <InfoField
                    label="Department"
                    value={userData.department}
                    icon={BriefcaseIcon}
                    isEditing={isEditingPersonalInfo}
                    editValue={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  />
                  
                  <InfoField
                    label="Location"
                    value={userData.location}
                    icon={MapPinIcon}
                    isEditing={isEditingPersonalInfo}
                    editValue={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                  
                  <InfoField
                    label="Work Email"
                    value={userData.email}
                    icon={EnvelopeIcon}
                    isEditing={isEditingPersonalInfo}
                    editValue={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                  
                  <InfoField
                    label="Personal Email"
                    value={userData.personalEmail}
                    icon={EnvelopeIcon}
                    isEditing={isEditingPersonalInfo}
                    editValue={editForm.personalEmail}
                    onChange={(e) => setEditForm({ ...editForm, personalEmail: e.target.value })}
                  />
                  
                  <InfoField
                    label="Primary Phone"
                    value={userData.phone}
                    icon={PhoneIcon}
                    isEditing={isEditingPersonalInfo}
                    editValue={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                  
                  <InfoField
                    label="Alternate Phone"
                    value={userData.alternatePhone}
                    icon={DevicePhoneMobileIcon}
                    isEditing={isEditingPersonalInfo}
                    editValue={editForm.alternatePhone}
                    onChange={(e) => setEditForm({ ...editForm, alternatePhone: e.target.value })}
                  />
                </div>

                {/* Additional Information */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoField
                      label="Join Date"
                      value={formatDate(userData.joinDate)}
                      icon={CalendarIcon}
                      isEditing={isEditingPersonalInfo}
                      editValue={editForm.joinDate}
                      type="date"
                      onChange={(e) => setEditForm({ ...editForm, joinDate: e.target.value })}
                    />
                    
                    <InfoField
                      label="Birthday"
                      value={formatDate(userData.birthday)}
                      icon={CalendarIcon}
                      isEditing={isEditingPersonalInfo}
                      editValue={editForm.birthday}
                      type="date"
                      onChange={(e) => setEditForm({ ...editForm, birthday: e.target.value })}
                    />
                    
                    <InfoField
                      label="Blood Type"
                      value={userData.bloodType}
                      icon={HeartIcon}
                      isEditing={isEditingPersonalInfo}
                      editValue={editForm.bloodType}
                      onChange={(e) => setEditForm({ ...editForm, bloodType: e.target.value })}
                    />
                  </div>
                  
                  <InfoField
                    label="Emergency Contact"
                    value={userData.emergencyContact}
                    icon={PhoneIcon}
                    isEditing={isEditingPersonalInfo}
                    editValue={editForm.emergencyContact}
                    onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Picture Modal */}
      {showProfilePictureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Update Profile Picture</h3>
                <button
                  onClick={() => {
                    setShowProfilePictureModal(false);
                    setProfilePicturePreview(userData.profilePicture);
                    setSelectedFile(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Preview */}
              <div className="flex justify-center mb-6">
                <div className="h-32 w-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center border-4 border-gray-200">
                  {profilePicturePreview ? (
                    <img 
                      src={profilePicturePreview} 
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-4xl font-bold">
                      {getInitials(editForm.name)}
                    </span>
                  )}
                </div>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />

              {/* Upload options */}
              <div className="space-y-3">
                <button
                  onClick={triggerFileInput}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PhotoIcon className="h-5 w-5 mr-2" />
                  Choose from gallery
                </button>

                {userData.profilePicture && (
                  <button
                    onClick={handleRemoveProfilePicture}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Remove current picture
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowProfilePictureModal(false);
                    setProfilePicturePreview(userData.profilePicture);
                    setSelectedFile(null);
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>

              {selectedFile && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    Selected: {selectedFile.name}
                  </p>
                  <button
                    onClick={handleUploadProfilePicture}
                    className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Upload Picture
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="h-8 w-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Security Settings</h2>
                    <p className="text-blue-100 text-sm mt-1">Manage your account security and connected devices</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSecurityModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Security Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Security Score</p>
                      <p className="text-2xl font-bold text-green-700">85%</p>
                    </div>
                    <ShieldCheckIcon className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Active Sessions</p>
                      <p className="text-2xl font-bold text-blue-700">2</p>
                    </div>
                    <DevicePhoneMobileIcon className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600">Last Password Change</p>
                      <p className="text-2xl font-bold text-yellow-700">15d</p>
                    </div>
                    <KeyIcon className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="space-y-6">
                {/* Authentication Methods */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication Methods</h3>
                  <div className="space-y-3">
                    <SecurityToggle
                      icon={LockClosedIcon}
                      title="Two-Factor Authentication"
                      description="Add an extra layer of security to your account"
                      enabled={securitySettings.twoFactorAuth}
                      onChange={() => handleSecurityChange('twoFactorAuth')}
                    />
                    
                    <SecurityToggle
                      icon={EnvelopeIcon}
                      title="Login Alerts via Email"
                      description="Get email notifications for new sign-ins"
                      enabled={securitySettings.loginAlerts}
                      onChange={() => handleSecurityChange('loginAlerts')}
                    />
                    
                    <SecurityToggle
                      icon={PhoneIcon}
                      title="SMS Alerts"
                      description="Receive security alerts via SMS"
                      enabled={securitySettings.smsAlerts}
                      onChange={() => handleSecurityChange('smsAlerts')}
                    />
                  </div>
                </div>

                {/* Connected Accounts */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Accounts</h3>
                  <div className="space-y-3">
                    <ConnectedAccount
                      name="Google"
                      icon="G"
                      connected={connectedAccounts.google.connected}
                      email={connectedAccounts.google.email}
                      onToggle={() => setConnectedAccounts(prev => ({
                        ...prev,
                        google: { ...prev.google, connected: !prev.google.connected }
                      }))}
                    />
                    
                    <ConnectedAccount
                      name="Microsoft"
                      icon="M"
                      connected={connectedAccounts.microsoft.connected}
                      onToggle={() => setConnectedAccounts(prev => ({
                        ...prev,
                        microsoft: { ...prev.microsoft, connected: !prev.microsoft.connected }
                      }))}
                    />
                    
                    <ConnectedAccount
                      name="Slack"
                      icon="S"
                      connected={connectedAccounts.slack.connected}
                      team={connectedAccounts.slack.team}
                      onToggle={() => setConnectedAccounts(prev => ({
                        ...prev,
                        slack: { ...prev.slack, connected: !prev.slack.connected }
                      }))}
                    />
                  </div>
                </div>

                {/* Trusted Devices */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trusted Devices</h3>
                  <div className="space-y-3">
                    {securitySettings.trustedDevices.map((device) => (
                      <TrustedDevice
                        key={device.id}
                        device={device}
                        onRemove={() => handleRemoveDevice(device.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-2">
                    {securitySettings.recentActivity.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </div>

                {/* Change Password */}
                <div className="border-t pt-4">
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <KeyIcon className="h-4 w-4 mr-2" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Helper Components
const InfoField = ({ label, value, icon: Icon, isEditing, editValue, onChange, type = "text" }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    <div className="flex items-center space-x-2">
      <Icon className="h-5 w-5 text-gray-400" />
      {isEditing ? (
        <input
          type={type}
          value={editValue}
          onChange={onChange}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      ) : (
        <span className="text-sm text-gray-900">{value || 'Not set'}</span>
      )}
    </div>
  </div>
);

const SecurityToggle = ({ icon: Icon, title, description, enabled, onChange }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <Icon className="h-5 w-5 text-gray-600" />
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={enabled}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

const ConnectedAccount = ({ name, icon, connected, email, team, onToggle }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="h-8 w-8 bg-white rounded-full border flex items-center justify-center font-bold text-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{name}</p>
        {email && <p className="text-xs text-gray-500">{email}</p>}
        {team && <p className="text-xs text-gray-500">Team: {team}</p>}
      </div>
    </div>
    {connected ? (
      <div className="flex items-center space-x-2">
        <CheckCircleIcon className="h-5 w-5 text-green-500" />
        <button onClick={onToggle} className="text-xs text-red-600 hover:text-red-800">Disconnect</button>
      </div>
    ) : (
      <button onClick={onToggle} className="text-xs text-blue-600 hover:text-blue-800">Connect</button>
    )}
  </div>
);

const TrustedDevice = ({ device, onRemove }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <DevicePhoneMobileIcon className="h-5 w-5 text-gray-600" />
      <div>
        <p className="text-sm font-medium text-gray-900">
          {device.name} {device.current && <span className="text-xs text-green-600 ml-2">(Current)</span>}
        </p>
        <p className="text-xs text-gray-500">{device.location} • Last active: {device.lastActive}</p>
      </div>
    </div>
    {!device.current && (
      <button onClick={onRemove} className="text-xs text-red-600 hover:text-red-800">Remove</button>
    )}
  </div>
);

const ActivityItem = ({ activity }) => (
  <div className="flex items-center justify-between p-2 text-sm">
    <div>
      <p className="text-gray-900">{activity.action}</p>
      <p className="text-xs text-gray-500">{activity.location} • {activity.device}</p>
    </div>
    <span className="text-xs text-gray-400">{activity.time}</span>
  </div>
);

export default ProfileDropdown;