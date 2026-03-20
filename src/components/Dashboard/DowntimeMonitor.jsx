import React, { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  BuildingOfficeIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import useExcelData from '../../hooks/useExcelData';

const DowntimeMonitor = () => {
  const { downtimeData, machineStatus, loading, lastUpdate } = useExcelData();
  const [dateTime, setDateTime] = useState(new Date());
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterPlant, setFilterPlant] = useState('all');
  const [downtime, setDowntime] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen for Excel data updates
  useEffect(() => {
    const handleDataUpdate = (event) => {
      if (event.detail && event.detail.downtime) {
        setDowntime(event.detail.downtime);
      } else if (event.detail && event.detail.machineStatus) {
        // Extract downtime from machine status
        const down = event.detail.machineStatus
          .filter(m => m.status && !m.status.toLowerCase().includes('running'))
          .map(m => ({
            plant: m.plant || 'P1',
            machine: m.machine || 'Unknown',
            reason: m.remarks || 'No reason specified',
            duration: m.duration || '0 mins',
            startTime: m.downtimeStart || 'N/A',
            endTime: m.downtimeEnd || 'N/A',
            status: m.status || 'Breakdown'
          }));
        setDowntime(down);
      }
    };
    
    window.addEventListener('excelDataUpdated', handleDataUpdate);
    return () => window.removeEventListener('excelDataUpdated', handleDataUpdate);
  }, []);

  useEffect(() => {
    if (downtimeData && downtimeData.length > 0) {
      setDowntime(downtimeData);
    } else if (machineStatus && machineStatus.length > 0) {
      // Extract downtime from machine status
      const down = machineStatus
        .filter(m => m.status && !m.status.toLowerCase().includes('running'))
        .map(m => ({
          plant: m.plant || 'P1',
          machine: m.machine || 'Unknown',
          reason: m.remarks || 'No reason specified',
          duration: m.duration || '0 mins',
          startTime: m.downtimeStart || 'N/A',
          endTime: m.downtimeEnd || 'N/A',
          status: m.status || 'Breakdown'
        }));
      setDowntime(down);
    } else {
      // Fallback mock data from your Excel
      setDowntime([
        {
          plant: 'P1',
          machine: 'IM17',
          startTime: '08:00',
          endTime: '15:00',
          duration: '7 hrs',
          operator: 'Andro Basbas',
          reason: 'Wornout toggle pin and linear bearing',
          status: 'Under Maintenance',
        },
        {
          plant: 'P1',
          machine: 'VANDAM6',
          startTime: '09:30',
          endTime: '14:30',
          duration: '5 hrs',
          operator: 'Mark Joeseph Bula',
          reason: 'Damaged Idler roller',
          status: 'Not running',
        },
        {
          plant: 'P2',
          machine: 'PCM11',
          startTime: '10:00',
          endTime: '12:00',
          duration: '2 hrs',
          operator: 'Jerry Calaluan',
          reason: 'Cam follower bearing worn out',
          status: 'Not running',
        },
        {
          plant: 'P1',
          machine: 'ICM5',
          startTime: '13:00',
          endTime: '14:00',
          duration: '1 hr',
          operator: 'Filipina Altabano',
          reason: 'Malf sevo motor pack on transport',
          status: 'Breakdown',
        },
        {
          plant: 'P2',
          machine: 'G6310-2',
          startTime: '11:00',
          endTime: '13:00',
          duration: '2 hrs',
          operator: 'Jerry Calaluan',
          reason: 'Change Mold',
          status: 'Under Maintenance',
        }
      ]);
    }
  }, [downtimeData, machineStatus]);

  const filteredDowntime = filterPlant === 'all' 
    ? downtime 
    : downtime.filter(d => d.plant === filterPlant);

  const totalDowntime = filteredDowntime.reduce((acc, curr) => {
    const duration = curr.duration || '0 mins';
    const hours = parseInt(duration.split(' ')[0]) || 0;
    return acc + hours;
  }, 0);

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('maintenance')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (s.includes('breakdown')) return 'bg-red-100 text-red-800 border-red-200';
    if (s.includes('idle')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('maintenance')) return <WrenchScrewdriverIcon className="h-5 w-5 text-purple-600" />;
    if (s.includes('breakdown')) return <XCircleIcon className="h-5 w-5 text-red-600" />;
    return <ClockIcon className="h-5 w-5 text-yellow-600" />;
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
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
            <BuildingOfficeIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wider">GLADES INTERNATIONAL CORPORATION</h1>
            <p className="text-blue-200 text-sm mt-1">Downtime Monitor • Real-time Tracking</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-blue-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-800/50 px-4 py-2 rounded-lg">
              <ArrowPathIcon className="h-4 w-4 text-blue-300 animate-spin" />
              <span className="text-sm text-blue-200">Last Update: {lastUpdate.toLocaleTimeString()}</span>
            </div>
            <select
              value={filterPlant}
              onChange={(e) => setFilterPlant(e.target.value)}
              className="bg-blue-800 text-white border border-blue-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="all">All Plants</option>
              <option value="P1">Plant 1</option>
              <option value="P2">Plant 2</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-blue-800 text-white border border-blue-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
            <div className="text-sm text-blue-200 bg-blue-800/30 px-4 py-2 rounded-lg">
              <ClockIcon className="h-4 w-4 inline mr-1" />
              {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-sm font-medium text-gray-600">Total Downtime Today</p>
          <p className="text-3xl font-semibold text-red-600">{totalDowntime} hrs</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-sm font-medium text-gray-600">Active Issues</p>
          <p className="text-3xl font-semibold text-yellow-600">{filteredDowntime.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-600">Plant 1 Issues</p>
          <p className="text-3xl font-semibold text-blue-600">
            {filteredDowntime.filter(d => d.plant === 'P1').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-600">Plant 2 Issues</p>
          <p className="text-3xl font-semibold text-green-600">
            {filteredDowntime.filter(d => d.plant === 'P2').length}
          </p>
        </div>
      </div>

      {/* Downtime Events */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            Current Downtime Events
          </h3>
          <p className="text-sm text-gray-500 mt-1">Based on data from Excel file (Downtime Monitoring sheet)</p>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredDowntime.length === 0 ? (
            <div className="p-12 text-center">
              <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No downtime events recorded for the selected period</p>
            </div>
          ) : (
            filteredDowntime.map((event, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900">{event.machine}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.plant === 'P1' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      Plant {event.plant}
                    </span>
                    <div className="flex items-center">
                      {getStatusIcon(event.status)}
                      <span className={`ml-1 px-2 py-1 text-xs rounded-full border ${getStatusColor(event.status)}`}>
                        {event.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-red-600 font-bold">
                    <ClockIcon className="h-5 w-5 mr-1" />
                    <span>{event.duration}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-500 w-20">Time:</span>
                    <span className="text-gray-900 font-medium">{event.startTime} - {event.endTime}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 w-20">Operator:</span>
                    <span className="text-gray-900 font-medium">{event.operator || 'N/A'}</span>
                  </div>
                  <div className="md:col-span-3 flex items-start">
                    <span className="text-gray-500 w-20">Reason:</span>
                    <span className="text-gray-900 flex-1">{event.reason}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Downtime Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Downtime by Machine</h3>
          <div className="space-y-4">
            {filteredDowntime.slice(0, 5).map((event, index) => {
              const hours = parseInt(event.duration?.split(' ')[0] || '0');
              const percentage = totalDowntime > 0 ? (hours / totalDowntime) * 100 : 0;
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{event.machine}</span>
                    <span className="font-bold text-red-600">{event.duration}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Downtime Reasons</h3>
          <div className="space-y-3">
            {filteredDowntime.slice(0, 5).map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-700 flex-1">{event.reason}</span>
                <span className="text-red-600 font-bold ml-2">{event.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • Downtime Monitoring System
        <span className="mx-2">•</span>
        <span className="text-blue-600">Plant 1</span>
        <span className="mx-2">|</span>
        <span className="text-green-600">Plant 2</span>
      </div>
    </div>
  );
};

export default DowntimeMonitor;