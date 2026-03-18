import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlayIcon,
  ClockIcon,
  VideoCameraIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cameraId: 'all',
    date: new Date().toISOString().split('T')[0],
    search: '',
  });
  const [selectedRecordings, setSelectedRecordings] = useState([]);

  useEffect(() => {
    fetchCameras();
    fetchRecordings();
  }, []);

  useEffect(() => {
    fetchRecordings();
  }, [filters.cameraId, filters.date]);

  const fetchCameras = async () => {
    // Mock data
    const mockCameras = [
      { id: 1, name: 'Camera 01', location: 'Warehouse A - Entrance' },
      { id: 2, name: 'Camera 02', location: 'Warehouse A - Aisle 1' },
      { id: 3, name: 'Camera 03', location: 'Warehouse A - Aisle 2' },
      { id: 4, name: 'Camera 04', location: 'Warehouse A - Loading Bay' },
    ];
    setCameras(mockCameras);
  };

  const fetchRecordings = async () => {
    setLoading(true);
    try {
      // Mock recordings data
      const mockRecordings = [
        {
          id: 1,
          cameraName: 'Camera 01',
          location: 'Warehouse A - Entrance',
          timestamp: new Date().toISOString(),
          duration: '00:05:23',
          size: 256 * 1024 * 1024,
          type: 'motion',
          thumbnail: 'https://via.placeholder.com/320x180?text=Recording+1',
        },
        {
          id: 2,
          cameraName: 'Camera 02',
          location: 'Warehouse A - Aisle 1',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          duration: '00:12:45',
          size: 512 * 1024 * 1024,
          type: 'continuous',
          thumbnail: 'https://via.placeholder.com/320x180?text=Recording+2',
        },
        {
          id: 3,
          cameraName: 'Camera 03',
          location: 'Warehouse A - Aisle 2',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          duration: '00:08:12',
          size: 384 * 1024 * 1024,
          type: 'motion',
          thumbnail: 'https://via.placeholder.com/320x180?text=Recording+3',
        },
        {
          id: 4,
          cameraName: 'Camera 04',
          location: 'Warehouse A - Loading Bay',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          duration: '00:15:30',
          size: 768 * 1024 * 1024,
          type: 'continuous',
          thumbnail: 'https://via.placeholder.com/320x180?text=Recording+4',
        },
      ];
      setRecordings(mockRecordings);
    } catch (error) {
      toast.error('Failed to fetch recordings');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (recordingId) => {
    toast.success('Recording download started');
  };

  const handleDelete = async (recordingId) => {
    if (!window.confirm('Are you sure you want to delete this recording?')) {
      return;
    }
    toast.success('Recording deleted successfully');
    setRecordings(recordings.filter(r => r.id !== recordingId));
  };

  const handleBulkDelete = async () => {
    if (selectedRecordings.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedRecordings.length} recordings?`)) {
      return;
    }

    toast.success('Recordings deleted successfully');
    setRecordings(recordings.filter(r => !selectedRecordings.includes(r.id)));
    setSelectedRecordings([]);
  };

  const handleSelectAll = () => {
    if (selectedRecordings.length === recordings.length) {
      setSelectedRecordings([]);
    } else {
      setSelectedRecordings(recordings.map(r => r.id));
    }
  };

  const handleSelectRecording = (id) => {
    if (selectedRecordings.includes(id)) {
      setSelectedRecordings(selectedRecordings.filter(rid => rid !== id));
    } else {
      setSelectedRecordings([...selectedRecordings, id]);
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Recordings</h1>
        {selectedRecordings.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
            Delete Selected ({selectedRecordings.length})
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-end space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by camera name or location..."
                className="input-field pl-10"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Camera
            </label>
            <select
              value={filters.cameraId}
              onChange={(e) => setFilters({ ...filters, cameraId: e.target.value })}
              className="input-field w-48"
            >
              <option value="all">All Cameras</option>
              {cameras.map(camera => (
                <option key={camera.id} value={camera.id}>{camera.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="input-field w-40"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <button
            onClick={fetchRecordings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Recordings Grid */}
      {recordings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recordings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or select a different date
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRecordings.length === recordings.length && recordings.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="table-header">Preview</th>
                <th className="table-header">Camera</th>
                <th className="table-header">Date & Time</th>
                <th className="table-header">Duration</th>
                <th className="table-header">Size</th>
                <th className="table-header">Type</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recordings.map((recording) => (
                <tr key={recording.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRecordings.includes(recording.id)}
                      onChange={() => handleSelectRecording(recording.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-16 w-24 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={recording.thumbnail}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{recording.cameraName}</div>
                    <div className="text-sm text-gray-500">{recording.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(recording.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(recording.timestamp).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {recording.duration}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatFileSize(recording.size)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      recording.type === 'motion' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {recording.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/cctv/playback/${recording.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Play"
                      >
                        <PlayIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDownload(recording.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Download"
                      >
                        <DocumentArrowDownIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(recording.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Recordings;