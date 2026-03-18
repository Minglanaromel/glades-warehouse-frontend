// components/Profile/ProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Test User',
    email: user?.email || 'test.user@glades.com',
    role: user?.role || 'Administrator',
    department: 'Production Management',
    employeeId: 'GLD-2024-001',
    joinDate: '2024-01-15',
    phone: '+63 912 345 6789',
    location: 'Plant 1 - Main Office',
    bio: 'Production manager overseeing Plant 1 and Plant 2 operations. Focus on efficiency and quality control.',
    emergencyContact: 'Maria Santos - +63 917 123 4567',
    skills: ['Lean Manufacturing', 'Quality Control', 'Team Leadership', 'Process Optimization'],
    certifications: ['Six Sigma Green Belt', 'ISO 9001:2015 Lead Auditor']
  });

  const [editForm, setEditForm] = useState({ ...profile });

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-blue-100 mt-1">Manage your personal information and settings</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <CheckIcon className="h-5 w-5 mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Picture & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
                {profile.name.charAt(0)}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <CameraIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {!isEditing ? (
              <>
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-600">{profile.role}</p>
                <p className="text-sm text-gray-500 mt-1">{profile.department}</p>
              </>
            ) : (
              <div className="space-y-2 mt-4">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input-field text-center"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="input-field text-center"
                  placeholder="Role"
                />
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Attendance Rate</span>
                <span className="text-sm font-semibold text-green-600">98%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Days Present</span>
                <span className="text-sm font-semibold">142/150</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Leave Balance</span>
                <span className="text-sm font-semibold">12 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Projects</span>
                <span className="text-sm font-semibold">8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  {!isEditing ? (
                    <p className="text-sm text-gray-900">{profile.email}</p>
                  ) : (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="input-field text-sm"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  {!isEditing ? (
                    <p className="text-sm text-gray-900">{profile.phone}</p>
                  ) : (
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="input-field text-sm"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Join Date</p>
                  {!isEditing ? (
                    <p className="text-sm text-gray-900">{new Date(profile.joinDate).toLocaleDateString()}</p>
                  ) : (
                    <input
                      type="date"
                      value={editForm.joinDate}
                      onChange={(e) => setEditForm({ ...editForm, joinDate: e.target.value })}
                      className="input-field text-sm"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <IdentificationIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Employee ID</p>
                  <p className="text-sm text-gray-900">{profile.employeeId}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  {!isEditing ? (
                    <p className="text-sm text-gray-900">{profile.department}</p>
                  ) : (
                    <input
                      type="text"
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      className="input-field text-sm"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  {!isEditing ? (
                    <p className="text-sm text-gray-900">{profile.location}</p>
                  ) : (
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="input-field text-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-1">Bio</p>
              {!isEditing ? (
                <p className="text-sm text-gray-900">{profile.bio}</p>
              ) : (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  className="input-field text-sm w-full"
                />
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            {!isEditing ? (
              <p className="text-sm text-gray-900">{profile.emergencyContact}</p>
            ) : (
              <input
                type="text"
                value={editForm.emergencyContact}
                onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                className="input-field text-sm w-full"
              />
            )}
          </div>

          {/* Skills & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Certifications</h3>
              <div className="space-y-2">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center">
                    <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-900">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;