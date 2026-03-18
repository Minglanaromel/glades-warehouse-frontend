// components/CCTV/CCTVGrid.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CameraIcon,
  ArrowsPointingOutIcon,
  PauseIcon,
  PlayIcon,
  VideoCameraIcon,
  ClockIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CCTVGrid = () => {
  const navigate = useNavigate();
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gridSize, setGridSize] = useState('4x4'); // 4x4 = 16 cameras, 5x4 = 20 cameras
  const [isPlaying, setIsPlaying] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'plant1', 'plant2'

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      // Mock data with 20 cameras (10 per plant)
      const mockCameras = [
        // Plant 1 Cameras (1-10) - Blue theme
        ...Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Camera ${String(i + 1).padStart(2, '0')}`,
          location: i < 5 ? 'Warehouse A' : 'Warehouse B',
          plant: 'Plant 1',
          plantCode: 'P1',
          zone: i < 3 ? 'Main Entrance' : i < 6 ? 'Aisle 1' : i < 8 ? 'Loading Bay' : 'Storage Area',
          status: Math.random() > 0.2 ? 'online' : 'offline',
          hasMotion: Math.random() > 0.7,
          thumbnail: `https://via.placeholder.com/320x180/1e3a8a/ffffff?text=Cam+${i + 1}`,
        })),
        // Plant 2 Cameras (11-20) - Green theme
        ...Array.from({ length: 10 }, (_, i) => ({
          id: i + 11,
          name: `Camera ${String(i + 11).padStart(2, '0')}`,
          location: i < 5 ? 'Warehouse C' : 'Warehouse D',
          plant: 'Plant 2',
          plantCode: 'P2',
          zone: i < 3 ? 'Main Entrance' : i < 6 ? 'Aisle 2' : i < 8 ? 'Loading Bay' : 'Storage Area',
          status: Math.random() > 0.2 ? 'online' : 'offline',
          hasMotion: Math.random() > 0.7,
          thumbnail: `https://via.placeholder.com/320x180/14532d/ffffff?text=Cam+${i + 11}`,
        })),
      ];
      setCameras(mockCameras);
    } catch (error) {
      toast.error('Failed to fetch cameras');
    } finally {
      setLoading(false);
    }
  };

  const getGridCols = () => {
    if (filter !== 'all') {
      return 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
    }
    
    switch(gridSize) {
      case '2x2': return 'grid-cols-2';
      case '3x3': return 'grid-cols-3';
      case '4x4': return 'grid-cols-4';
      case '5x4': return 'grid-cols-4 md:grid-cols-5';
      default: return 'grid-cols-4';
    }
  };

  const getFilteredCameras = () => {
    if (filter === 'plant1') {
      return cameras.filter(c => c.plant === 'Plant 1');
    } else if (filter === 'plant2') {
      return cameras.filter(c => c.plant === 'Plant 2');
    }
    return cameras;
  };

  const getOnlineCount = () => {
    return cameras.filter(c => c.status === 'online').length;
  };

  const getPlant1Online = () => {
    return cameras.filter(c => c.plant === 'Plant 1' && c.status === 'online').length;
  };

  const getPlant2Online = () => {
    return cameras.filter(c => c.plant === 'Plant 2' && c.status === 'online').length;
  };

  const getMotionCount = () => {
    return cameras.filter(c => c.hasMotion).length;
  };

  const handleFullscreen = () => {
    navigate('/cctv/fullscreen');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredCameras = getFilteredCameras();

  return (
    <div className="space-y-6">
      {/* Header with GLADES INTERNATIONAL CORPORATION */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-wider flex items-center">
              <span className="text-blue-400">GLADES</span>
              <span className="mx-2">INTERNATIONAL</span>
              <span className="text-green-400">CORPORATION</span>
            </h1>
            <p className="text-gray-300 mt-2 flex items-center">
              <VideoCameraIcon className="h-4 w-4 mr-2" />
              CCTV Surveillance System • {getOnlineCount()}/20 Cameras Online
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            {/* Plant Filter */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                All (20)
              </button>
              <button
                onClick={() => setFilter('plant1')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition flex items-center ${
                  filter === 'plant1' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Plant 1 (10)
              </button>
              <button
                onClick={() => setFilter('plant2')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition flex items-center ${
                  filter === 'plant2' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Plant 2 (10)
              </button>
            </div>

            {/* Grid Size Selector */}
            {filter === 'all' && (
              <select
                value={gridSize}
                onChange={(e) => setGridSize(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="4x4">4x4 Grid (16)</option>
                <option value="5x4">5x4 Grid (20)</option>
              </select>
            )}

            <button
              onClick={handleFullscreen}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition"
              title="Fullscreen"
            >
              <ArrowsPointingOutIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Camera Grid - All in One Screen */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className={`grid ${getGridCols()} gap-4`}>
          {filteredCameras.slice(0, filter === 'all' && gridSize === '5x4' ? 20 : 16).map((camera) => (
            <Link
              key={camera.id}
              to={`/cctv/camera/${camera.id}`}
              className="relative bg-gray-900 rounded-lg overflow-hidden group cursor-pointer transform transition hover:scale-105 hover:z-10"
            >
              {/* Camera Thumbnail */}
              <div className="aspect-video relative">
                <img
                  src={camera.thumbnail}
                  alt={camera.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Plant Indicator - Color coded */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${
                  camera.plant === 'Plant 1' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-green-600 text-white'
                }`}>
                  {camera.plantCode}
                </div>

                {/* Status Indicators */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  {camera.hasMotion && (
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                  )}
                  <span className={`w-2 h-2 rounded-full ${
                    camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  } animate-pulse`}></span>
                </div>

                {/* Recording Indicator */}
                {camera.status === 'online' && (
                  <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span>
                    LIVE
                  </div>
                )}
              </div>

              {/* Camera Info */}
              <div className="p-2 bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">{camera.name}</span>
                  <span className="text-gray-400 text-xs">{camera.zone}</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">{camera.location}</p>
              </div>

              {/* Hover Effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity ${
                camera.plant === 'Plant 1' ? 'bg-blue-600' : 'bg-green-600'
              }`}></div>
            </Link>
          ))}
        </div>

        {/* Show message if no cameras match filter */}
        {filteredCameras.length === 0 && (
          <div className="text-center py-12">
            <CameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No cameras found for this filter</p>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            {/* Overall Stats */}
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm text-gray-600">
                Online: {getOnlineCount()}/20
              </span>
            </div>
            
            {/* Plant 1 Stats */}
            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
              <BuildingOfficeIcon className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm text-blue-700 font-medium">
                Plant 1: {getPlant1Online()}/10
              </span>
            </div>
            
            {/* Plant 2 Stats */}
            <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
              <BuildingOffice2Icon className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-700 font-medium">
                Plant 2: {getPlant2Online()}/10
              </span>
            </div>
            
            {/* Motion Stats */}
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm text-gray-600">
                Motion: {getMotionCount()}
              </span>
            </div>
          </div>
          
          {/* Time */}
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 mr-1" />
            {new Date().toLocaleString()}
          </div>
        </div>

        {/* Bottom Bar with GLADES INTERNATIONAL CORPORATION */}
        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400 tracking-wider">
            GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • 
            <span className="text-blue-600 ml-1">Plant 1</span>
            <span className="mx-2">|</span>
            <span className="text-green-600">Plant 2</span>
            <span className="mx-2">•</span>
            {getOnlineCount()} Cameras Online • {getMotionCount()} Motion Detected
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-xs">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
          <span className="text-gray-600">Plant 1 Camera</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
          <span className="text-gray-600">Plant 2 Camera</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          <span className="text-gray-600">Online</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          <span className="text-gray-600">Offline</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
          <span className="text-gray-600">Motion</span>
        </div>
      </div>
    </div>
  );
};

export default CCTVGrid;