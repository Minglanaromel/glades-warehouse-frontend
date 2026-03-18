// components/CCTV/CCTVFullscreen.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XMarkIcon,
  CameraIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  Squares2X2Icon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';

const CCTVFullscreen = () => {
  const navigate = useNavigate();
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [layout, setLayout] = useState('single');
  const [selectedPlant, setSelectedPlant] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetchCameras();
    
    // Listen for fullscreen change events
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const fetchCameras = async () => {
    // Mock data with 20 cameras (10 per plant)
    const mockCameras = [
      // Plant 1 Cameras (1-10)
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Camera ${String(i + 1).padStart(2, '0')}`,
        location: i < 5 ? 'Warehouse A' : 'Warehouse B',
        plant: 'Plant 1',
        zone: i < 3 ? 'Main Entrance' : i < 6 ? 'Aisle 1' : i < 8 ? 'Loading Bay' : 'Storage Area',
        status: Math.random() > 0.2 ? 'online' : 'offline',
        hasMotion: Math.random() > 0.7,
        streamUrl: `https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=Camera+${i + 1}`,
      })),
      // Plant 2 Cameras (11-20)
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 11,
        name: `Camera ${String(i + 11).padStart(2, '0')}`,
        location: i < 5 ? 'Warehouse C' : 'Warehouse D',
        plant: 'Plant 2',
        zone: i < 3 ? 'Main Entrance' : i < 6 ? 'Aisle 2' : i < 8 ? 'Loading Bay' : 'Storage Area',
        status: Math.random() > 0.2 ? 'online' : 'offline',
        hasMotion: Math.random() > 0.7,
        streamUrl: `https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=Camera+${i + 11}`,
      })),
    ];
    setCameras(mockCameras);
    setSelectedCamera(mockCameras[0]);
  };

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleExitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
        .then(() => {
          navigate('/cctv');
        })
        .catch((err) => {
          console.error('Error exiting fullscreen:', err);
          navigate('/cctv');
        });
    } else {
      navigate('/cctv');
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleLayoutChange = () => {
    setLayout(layout === 'single' ? 'grid' : 'single');
  };

  const getFilteredCameras = () => {
    if (selectedPlant === 'all') return cameras;
    return cameras.filter(camera => camera.plant === selectedPlant);
  };

  const getOnlineCount = () => {
    return cameras.filter(c => c.status === 'online').length;
  };

  const getMotionCount = () => {
    return cameras.filter(c => c.hasMotion).length;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Top Bar - GLADES INTERNATIONAL CORPORATION */}
      <div className="bg-gradient-to-b from-black via-black to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExitFullscreen}
              className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors"
              title="Exit Fullscreen"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-white text-2xl font-bold tracking-wider">
                GLADES INTERNATIONAL CORPORATION
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-gray-300 text-sm">
                  CCTV Surveillance System
                </p>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    <span className="text-xs text-gray-300">{getOnlineCount()} Online</span>
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>
                    <span className="text-xs text-gray-300">{getMotionCount()} Motion</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Plant Filter */}
            <select
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all" className="bg-gray-800">All Plants (20 Cameras)</option>
              <option value="Plant 1" className="bg-gray-800">Plant 1 (10 Cameras)</option>
              <option value="Plant 2" className="bg-gray-800">Plant 2 (10 Cameras)</option>
            </select>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors"
              title="Toggle Fullscreen"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={handleLayoutChange}
              className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors"
              title={layout === 'single' ? 'Switch to Grid View' : 'Switch to Single View'}
            >
              {layout === 'single' ? (
                <RectangleGroupIcon className="h-5 w-5" />
              ) : (
                <CameraIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={handleMuteToggle}
              className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <SpeakerXMarkIcon className="h-5 w-5" />
              ) : (
                <SpeakerWaveIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Camera Feed Area */}
      <div className="flex-1 flex overflow-hidden bg-gray-900">
        {/* Main Content */}
        <div className="flex-1 p-4">
          {layout === 'single' ? (
            <div className="h-full flex items-center justify-center">
              {selectedCamera ? (
                <div className="relative h-full w-full rounded-lg overflow-hidden">
                  <img
                    src={selectedCamera.streamUrl}
                    alt={selectedCamera.name}
                    className="w-full h-full object-contain"
                  />
                  {/* Camera Info Overlay */}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg border-l-4 border-blue-500">
                    <p className="font-bold text-lg">{selectedCamera.name}</p>
                    <p className="text-sm text-gray-300">{selectedCamera.location} • {selectedCamera.zone}</p>
                    <p className="text-xs text-gray-400">{selectedCamera.plant}</p>
                  </div>
                  {/* Status Indicators */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {selectedCamera.hasMotion && (
                      <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-semibold flex items-center">
                        <span className="w-2 h-2 bg-red-600 rounded-full mr-1 animate-pulse"></span>
                        MOTION DETECTED
                      </span>
                    )}
                    <span className={`${selectedCamera.status === 'online' ? 'bg-green-500' : 'bg-red-500'} text-white text-xs px-2 py-1 rounded font-semibold flex items-center`}>
                      <span className={`w-2 h-2 ${selectedCamera.status === 'online' ? 'bg-white' : 'bg-gray-200'} rounded-full mr-1 animate-pulse`}></span>
                      {selectedCamera.status === 'online' ? 'LIVE' : 'OFFLINE'}
                    </span>
                  </div>
                  {/* Time Stamp */}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {new Date().toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <CameraIcon className="h-20 w-20 text-gray-600 mx-auto" />
                  <p className="text-gray-400 mt-4">No camera selected</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full overflow-auto">
              {/* Plant 1 Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-lg font-semibold flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    Plant 1 - Manufacturing Facility
                  </h2>
                  <span className="text-xs text-gray-400">
                    {getFilteredCameras().filter(c => c.plant === 'Plant 1' && c.status === 'online').length}/10 Online
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {getFilteredCameras()
                    .filter(c => c.plant === 'Plant 1')
                    .map((camera) => (
                      <div
                        key={camera.id}
                        className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer group aspect-video border border-gray-700 hover:border-blue-500 transition-all"
                        onClick={() => {
                          setSelectedCamera(camera);
                          setLayout('single');
                        }}
                      >
                        <img
                          src={camera.streamUrl}
                          alt={camera.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Camera Info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                          <p className="text-white text-sm font-medium">{camera.name}</p>
                          <p className="text-gray-300 text-xs">{camera.zone}</p>
                        </div>
                        {/* Status Indicators */}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          {camera.hasMotion && (
                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                          )}
                          <span className={`w-2 h-2 rounded-full ${camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                        </div>
                        {/* Plant Indicator */}
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                          P1
                        </div>
                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Plant 2 Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-lg font-semibold flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Plant 2 - Distribution Center
                  </h2>
                  <span className="text-xs text-gray-400">
                    {getFilteredCameras().filter(c => c.plant === 'Plant 2' && c.status === 'online').length}/10 Online
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {getFilteredCameras()
                    .filter(c => c.plant === 'Plant 2')
                    .map((camera) => (
                      <div
                        key={camera.id}
                        className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer group aspect-video border border-gray-700 hover:border-green-500 transition-all"
                        onClick={() => {
                          setSelectedCamera(camera);
                          setLayout('single');
                        }}
                      >
                        <img
                          src={camera.streamUrl}
                          alt={camera.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Camera Info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                          <p className="text-white text-sm font-medium">{camera.name}</p>
                          <p className="text-gray-300 text-xs">{camera.zone}</p>
                        </div>
                        {/* Status Indicators */}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          {camera.hasMotion && (
                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                          )}
                          <span className={`w-2 h-2 rounded-full ${camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                        </div>
                        {/* Plant Indicator */}
                        <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
                          P2
                        </div>
                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-green-600 bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Camera Selection Sidebar (for single view) */}
        {layout === 'single' && (
          <div className="w-80 bg-gray-900 p-4 overflow-y-auto border-l border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-sm font-semibold">Camera List</h3>
              <span className="text-xs text-gray-400">20 Total</span>
            </div>
            
            {/* Plant 1 Cameras */}
            <div className="mb-6">
              <h4 className="text-blue-400 text-xs font-semibold uppercase mb-2 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Plant 1 (10 Cameras)
              </h4>
              <div className="space-y-2">
                {cameras
                  .filter(c => c.plant === 'Plant 1')
                  .map((camera) => (
                    <button
                      key={camera.id}
                      onClick={() => setSelectedCamera(camera)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedCamera?.id === camera.id
                          ? 'bg-blue-600'
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm font-medium">{camera.name}</p>
                          <p className="text-gray-400 text-xs">{camera.zone}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {camera.hasMotion && (
                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                          )}
                          <span className={`w-2 h-2 rounded-full ${
                            camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                          } animate-pulse`}></span>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Plant 2 Cameras */}
            <div>
              <h4 className="text-green-400 text-xs font-semibold uppercase mb-2 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Plant 2 (10 Cameras)
              </h4>
              <div className="space-y-2">
                {cameras
                  .filter(c => c.plant === 'Plant 2')
                  .map((camera) => (
                    <button
                      key={camera.id}
                      onClick={() => setSelectedCamera(camera)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedCamera?.id === camera.id
                          ? 'bg-green-600'
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm font-medium">{camera.name}</p>
                          <p className="text-gray-400 text-xs">{camera.zone}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {camera.hasMotion && (
                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                          )}
                          <span className={`w-2 h-2 rounded-full ${
                            camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                          } animate-pulse`}></span>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar - GLADES INTERNATIONAL CORPORATION */}
      <div className="bg-gradient-to-t from-black via-black to-transparent p-3">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-xs tracking-wider">
            GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • All Rights Reserved
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">20 Cameras Active</span>
            <span className="text-xs text-gray-500">{getOnlineCount()} Online</span>
            <span className="text-xs text-gray-500">{getMotionCount()} Motion Events</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCTVFullscreen;