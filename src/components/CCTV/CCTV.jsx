// components/CCTV/CCTV.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  CameraIcon,
  Squares2X2Icon,
  FilmIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  CubeIcon,
  UserGroupIcon,
  TruckIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  ChartBarIcon,
  VideoCameraIcon,
  PlayCircleIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CCTV = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    total: 20,
    online: 16,
    motion: 7,
    recording: 12
  });
  const [user, setUser] = useState({
    name: 'Test User',
    role: 'Admin',
    initials: 'TU'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch real stats from API
      // const response = await api.get('/cctv/stats');
      // setStats(response.data);
      
      // Using mock data for now
      setStats({
        total: 20,
        online: 16,
        motion: 7,
        recording: 12
      });
    } catch (error) {
      console.error('Failed to fetch CCTV stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if current route is fullscreen (should not show layout)
  if (location.pathname === '/cctv/fullscreen') {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">GLADES WAREHOUSE</h1>
          <p className="text-xs text-gray-500 mt-1">CCTV Monitoring System</p>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
              Main Menu
            </p>
            
            <Link 
              to="/dashboard" 
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                location.pathname === '/dashboard' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CubeIcon className="h-5 w-5 mr-3" />
              Dashboard
            </Link>

            <Link 
              to="/stock-items" 
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                location.pathname.includes('/stock-items') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ArchiveBoxIcon className="h-5 w-5 mr-3" />
              Stock Items
            </Link>

            <Link 
              to="/customers" 
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                location.pathname.includes('/customers') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <UserGroupIcon className="h-5 w-5 mr-3" />
              Customers
            </Link>

            <Link 
              to="/suppliers" 
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                location.pathname.includes('/suppliers') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <TruckIcon className="h-5 w-5 mr-3" />
              Suppliers
            </Link>

            <Link 
              to="/purchase-orders" 
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                location.pathname.includes('/purchase-orders') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ShoppingCartIcon className="h-5 w-5 mr-3" />
              Purchase Orders
            </Link>

            <Link 
              to="/sales-orders" 
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                location.pathname.includes('/sales-orders') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <DocumentTextIcon className="h-5 w-5 mr-3" />
              Sales Orders
            </Link>

            <Link 
              to="/reports" 
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                location.pathname.includes('/reports') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChartBarIcon className="h-5 w-5 mr-3" />
              Reports
            </Link>
          </div>

          {/* CCTV Section */}
          <div className="px-4 mt-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
              Surveillance
            </p>
            
            <Link 
              to="/cctv" 
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                (location.pathname === '/cctv' || location.pathname === '/cctv/cameras') && !location.pathname.includes('/recordings')
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <VideoCameraIcon className="h-5 w-5 mr-3" />
              Live View
            </Link>

            <Link 
              to="/cctv/recordings" 
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                location.pathname.includes('/recordings') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FilmIcon className="h-5 w-5 mr-3" />
              Recordings
            </Link>
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user.initials}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">CCTV Monitoring</h2>
              <p className="text-sm text-gray-500 mt-1">
                {stats.online} of {stats.total} Cameras Online · {stats.motion} with motion · {stats.recording} recording
              </p>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">{stats.online} Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{stats.motion} Motion</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">{stats.recording} Recording</span>
              </div>
              <div className="flex items-center space-x-2 border-l pl-4">
                <ClockIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{currentTime}</span>
              </div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex space-x-4 mt-4">
            <Link
              to="/cctv"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                (location.pathname === '/cctv' || location.pathname === '/cctv/cameras') && !location.pathname.includes('/recordings')
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Squares2X2Icon className="h-4 w-4 inline mr-2" />
              Grid View
            </Link>
            <Link
              to="/cctv/recordings"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                location.pathname.includes('/recordings')
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FilmIcon className="h-4 w-4 inline mr-2" />
              Recordings
            </Link>
            <Link
              to="/cctv/fullscreen"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                location.pathname.includes('/fullscreen')
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PlayCircleIcon className="h-4 w-4 inline mr-2" />
              Fullscreen
            </Link>
          </div>
        </div>

        {/* Page Content - Outlet renders the child routes */}
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CCTV;