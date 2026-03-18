import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  CameraIcon,
  ClockIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CameraDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    fetchCameraDetails();
    fetchRecordings();
  }, [id, selectedDate]);

  const fetchCameraDetails = async () => {
    try {
      // Mock data for demonstration
      const mockCamera = {
        id: id,
        name: `Camera ${id}`,
        location: 'Warehouse A - Section 1',
        status: 'online',
        model: 'Hikvision DS-2CD2T85',
        resolution: '4K',
        frameRate: '30fps',
        ipAddress: '192.168.1.100',
        recordingMode: 'motion',
        retentionDays: 30,
        motionDetection: true,
        usedStorage: '256GB',
        storageUsage: 25,
        streamUrl: `https://via.placeholder.com/1280x720?text=Camera+${id}`,
      };
      setCamera(mockCamera);
    } catch (error) {
      toast.error('Failed to fetch camera details');
      navigate('/cctv');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecordings = async () => {
    try {
      // Mock recordings data
      const mockRecordings = [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          duration: '00:05:23',
          size: 256 * 1024 * 1024,
          type: 'motion',
          thumbnail: 'https://via.placeholder.com/320x180?text=Recording+1',
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          duration: '00:12:45',
          size: 512 * 1024 * 1024,
          type: 'continuous',
          thumbnail: 'https://via.placeholder.com/320x180?text=Recording+2',
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          duration: '00:08:12',
          size: 384 * 1024 * 1024,
          type: 'motion',
          thumbnail: 'https://via.placeholder.com/320x180?text=Recording+3',
        },
      ];
      setRecordings(mockRecordings);
    } catch (error) {
      console.error('Failed to fetch recordings:', error);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    const elem = document.getElementById('camera-feed');
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

  const handleDownloadRecording = async (recordingId) => {
    toast.success('Recording download started');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!camera) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/cctv')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{camera.name}</h1>
            <p className="text-sm text-gray-500">{camera.location}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <span className={`px-3 py-1 text-sm rounded-full ${
            camera.status === 'online' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {camera.status}
          </span>
        </div>
      </div>

      {/* Main Camera Feed */}
      <div className="bg-black rounded-lg overflow-hidden relative" style={{ height: '500px' }}>
        <div id="camera-feed" className="w-full h-full">
          {camera.status === 'online' ? (
            <img
              src={camera.streamUrl}
              alt={camera.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <CameraIcon className="h-20 w-20 text-gray-600" />
              <p className="text-gray-400 mt-4">Camera Offline</p>
            </div>
          )}
        </div>

        {/* Camera Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePlayPause}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition"
              >
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6" />
                )}
              </button>
              <button
                onClick={handleMuteToggle}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition"
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="h-6 w-6" />
                ) : (
                  <SpeakerWaveIcon className="h-6 w-6" />
                )}
              </button>
              <span className="text-white text-sm">Live</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleFullscreen}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition"
              >
                <ArrowsPointingOutIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Camera Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Camera Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Model:</span>
              <span className="text-sm font-medium">{camera.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Resolution:</span>
              <span className="text-sm font-medium">{camera.resolution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Frame Rate:</span>
              <span className="text-sm font-medium">{camera.frameRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">IP Address:</span>
              <span className="text-sm font-medium">{camera.ipAddress}</span>
            </div>
          </div>
        </div>

        {/* Recording Schedule */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recording Schedule</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Mode:</span>
              <span className="text-sm font-medium capitalize">{camera.recordingMode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Retention:</span>
              <span className="text-sm font-medium">{camera.retentionDays} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Motion Detection:</span>
              <span className="text-sm font-medium">{camera.motionDetection ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>

        {/* Storage Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Used Space:</span>
              <span className="text-sm font-medium">{camera.usedStorage} / 1TB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${camera.storageUsage}%` }}
              ></div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Recordings:</span>
              <span className="text-sm font-medium">{recordings.length} today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recordings Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recordings</h2>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field w-auto"
              max={new Date().toISOString().split('T')[0]}
            />
            <button
              onClick={fetchRecordings}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
        <div className="p-6">
          {recordings.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No recordings found for this date</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recordings.map((recording) => (
                <div key={recording.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src={recording.thumbnail}
                      alt={`Recording ${recording.id}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {recording.duration}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {new Date(recording.timestamp).toLocaleTimeString()}
                      </div>
                      <button
                        onClick={() => handleDownloadRecording(recording.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Download Recording"
                      >
                        <DocumentArrowDownIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {formatFileSize(recording.size)}
                    </p>
                    <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
                      recording.type === 'motion' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {recording.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraDetails;