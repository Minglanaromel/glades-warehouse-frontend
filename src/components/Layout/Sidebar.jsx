// components/Layout/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  CubeIcon,
  UserGroupIcon,
  TruckIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  UsersIcon,
  VideoCameraIcon,
  ChartPieIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  UserCircleIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
  ArrowRightOnRectangleIcon,
  BellIcon, // Added BellIcon import
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({
    production: location.pathname.includes('/production') || 
                location.pathname.includes('/capacity') || 
                location.pathname.includes('/machine') || 
                location.pathname.includes('/downtime') || 
                location.pathname.includes('/attendance'),
    cctv: location.pathname.includes('/cctv'),
    reports: location.pathname.includes('/reports'),
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const navigation = [
    { 
      name: 'Dashboard', 
      to: '/dashboard', 
      icon: HomeIcon,
      end: true 
    },
    // Notifications link - added after Dashboard
    { 
      name: 'Notifications', 
      to: '/notifications', 
      icon: BellIcon 
    },
    {
      name: 'Production',
      icon: ChartPieIcon,
      key: 'production',
      children: [
        { name: 'Production Dashboard', to: '/production-dashboard', icon: ChartPieIcon },
        { name: 'Capacity Utilization', to: '/capacity-utilization', icon: ChartBarIcon },
        { name: 'Machine Status', to: '/machine-status', icon: WrenchScrewdriverIcon },
        { name: 'Downtime Monitor', to: '/downtime-monitor', icon: ClockIcon },
        { name: 'Attendance', to: '/attendance', icon: UserGroupIcon },
      ],
    },
    { 
      name: 'Stock Items', 
      to: '/stock-items', 
      icon: CubeIcon 
    },
    { 
      name: 'Customers', 
      to: '/customers', 
      icon: UserGroupIcon 
    },
    { 
      name: 'Suppliers', 
      to: '/suppliers', 
      icon: TruckIcon 
    },
    { 
      name: 'Purchase Orders', 
      to: '/purchase-orders', 
      icon: ShoppingCartIcon 
    },
    { 
      name: 'Sales Orders', 
      to: '/sales-orders', 
      icon: DocumentTextIcon 
    },
    {
      name: 'CCTV',
      icon: VideoCameraIcon,
      key: 'cctv',
      children: [
        { name: 'Live View', to: '/cctv', icon: VideoCameraIcon },
        { name: 'Recordings', to: '/cctv/recordings', icon: DocumentTextIcon },
        { name: 'Fullscreen', to: '/cctv/fullscreen', icon: ChartBarIcon },
      ],
    },
    {
      name: 'Reports',
      icon: ChartBarIcon,
      key: 'reports',
      children: [
        { name: 'Daily Activity', to: '/reports/daily-activity', icon: CalendarIcon },
        { name: 'Sales Report', to: '/reports/sales', icon: ChartBarIcon },
        { name: 'Purchase Report', to: '/reports/purchase', icon: ShoppingCartIcon },
        { name: 'Sales Outstanding', to: '/reports/sales-outstanding', icon: DocumentTextIcon },
        { name: 'Purchase Outstanding', to: '/reports/purchase-outstanding', icon: DocumentTextIcon },
        { name: 'Low Stock', to: '/reports/low-stock', icon: CubeIcon },
      ],
    },
  ];

  // Add user management only for admin
  if (user?.role === 'admin') {
    navigation.push({ 
      name: 'User Management', 
      to: '/users', 
      icon: UsersIcon 
    });
  }

  navigation.push({ 
    name: 'Settings', 
    to: '/settings', 
    icon: CogIcon 
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Mock unread notifications count (you can replace with real data from context/state)
  const unreadCount = 4;

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl flex flex-col h-screen">
      {/* Company Logo and Name - UPDATED with GLADES INTERNATIONAL CORPORATION */}
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="flex items-center space-x-3">
          <BuildingOfficeIcon className="h-8 w-8 text-white" />
          <div>
            <h1 className="text-xl font-bold text-white tracking-wider leading-tight">
              GLADES
            </h1>
            <p className="text-xs text-blue-200 font-medium tracking-wide">
              INTERNATIONAL CORPORATION
            </p>
          </div>
        </div>
        <p className="text-xs text-blue-200 mt-2 flex items-center">
          <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          Production Monitoring System
        </p>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'Test User'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.role || 'Administrator'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => (
            <li key={item.name}>
              {item.children ? (
                <div className="mb-1">
                  {/* Parent Menu Button */}
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-all ${
                      openMenus[item.key]
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {openMenus[item.key] ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </button>

                  {/* Child Menu Items */}
                  {openMenus[item.key] && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <NavLink
                            to={child.to}
                            className={({ isActive }) =>
                              `flex items-center px-4 py-2 text-sm rounded-lg transition-all ${
                                isActive
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                              }`
                            }
                          >
                            <child.icon className="mr-3 h-4 w-4" />
                            {child.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {/* Add notification badge for Notifications link */}
                  {item.name === 'Notifications' && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2.5 text-sm rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all group"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
          Logout
        </button>

        {/* Version Info */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} GLADES
          </p>
          <p className="text-xs text-gray-600">
            v2.0.0 • Plant 1 | Plant 2
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;