// components/Dashboard/CapacityUtilization.jsx
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { 
  DocumentArrowDownIcon,
  BuildingOfficeIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import useExcelData from '../../hooks/useExcelData';

// Try to import logo, but don't fail if it doesn't exist
let gladesLogo;
try {
  gladesLogo = require('../../assets/images/glades-logo.png');
} catch (e) {
  gladesLogo = null;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CapacityUtilization = () => {
  const { lastUpdate } = useExcelData();
  const [dateTime, setDateTime] = useState(new Date());
  const [selectedPlant, setSelectedPlant] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('oct');
  const [logoError, setLogoError] = useState(!gladesLogo);

  const utilizationData = [
    { machine: 'KMD1', oct: 0.95, nov: 0.852, dec: 0.872, item: 'Lid Flat 12oz PPC' },
    { machine: 'KMD2', oct: 0.951, nov: 0.95, dec: 0.719, item: 'MCD Lid 1oz PPC' },
    { machine: 'KMD3', oct: 1.013, nov: 0.849, dec: 0.714, item: 'MCD Lid Strawless 12oz' },
    { machine: 'KMD4', oct: 1.067, nov: 0.76, dec: 0.322, item: 'MCD Lid Strawless 16/22oz' },
    { machine: 'Vandam', oct: 1.007, nov: 0.81, dec: 0.746, item: 'Multiple SKUs' },
    { machine: 'OMSO', oct: 0.214, nov: 0.15, dec: 0.15, item: 'JFC Cup Float' },
    { machine: 'IM-16/17', oct: 0.954, nov: 0.954, dec: 0.801, item: 'MCD Spoon' },
    { machine: 'IM-5', oct: 0.841, nov: 0.841, dec: 0.721, item: 'MCD Spoon' },
    { machine: 'ALF-13', oct: 0.962, nov: 0.288, dec: 0.24, item: 'MCD Lid Cold' },
    { machine: 'ALF-14', oct: 1.0, nov: 0.462, dec: 0.462, item: 'MCD Lid Cold' },
    { machine: 'PCM15/16', oct: 0.56, nov: 0.656, dec: 0.502, item: 'MCD Cup Cold' },
  ];

  const chartData = {
    labels: utilizationData.map(d => d.machine),
    datasets: [
      {
        label: 'October',
        data: utilizationData.map(d => d.oct * 100),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'November',
        data: utilizationData.map(d => d.nov * 100),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
      {
        label: 'December',
        data: utilizationData.map(d => d.dec * 100),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Machine Capacity Utilization (%)' },
    },
    scales: {
      y: { beginAtZero: true, max: 120, title: { display: true, text: 'Utilization %' } },
    },
  };

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const exportToExcel = () => {
    alert('Exporting to Excel...');
  };

  const getUtilizationColor = (value) => {
    if (value >= 0.9) return 'text-green-600';
    if (value >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header - Blue background with logo */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!logoError && gladesLogo ? (
              <img 
                src={gladesLogo} 
                alt="Glades International Logo" 
                className="h-10 w-auto"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-wider">GLADES INTERNATIONAL CORPORATION</h1>
              <p className="text-sm text-blue-200">Production Monitoring System • Real-time Dashboard</p>
            </div>
          </div>
          <div className="text-sm text-blue-200 bg-blue-800/50 px-3 py-1 rounded">
            Last Update: {dateTime.toLocaleTimeString()}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-700">
          <div className="text-sm text-blue-200">
            {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
          </div>
          <button
            onClick={exportToExcel}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Upload Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-4">
          <select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Plants</option>
            <option value="plant1">Plant 1</option>
            <option value="plant2">Plant 2</option>
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="oct">October</option>
            <option value="nov">November</option>
            <option value="dec">December</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Average Utilization</p>
          <p className="text-3xl font-semibold text-gray-900">78.5%</p>
          <p className="text-sm text-green-600 mt-2">↑ 5.2% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Peak Utilization</p>
          <p className="text-3xl font-semibold text-green-600">106.7%</p>
          <p className="text-sm text-gray-500 mt-2">KMD4 - October</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Lowest Utilization</p>
          <p className="text-3xl font-semibold text-red-600">15.0%</p>
          <p className="text-sm text-gray-500 mt-2">OMSO - November</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Machines Above Target</p>
          <p className="text-3xl font-semibold text-blue-600">8/27</p>
          <p className="text-sm text-gray-500 mt-2">Target: 85%</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Machine Utilization Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">October</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">November</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">December</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {utilizationData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.machine}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.item}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getUtilizationColor(item.oct)}`}>
                      {(item.oct * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getUtilizationColor(item.nov)}`}>
                      {(item.nov * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getUtilizationColor(item.dec)}`}>
                      {(item.dec * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.dec > item.nov ? (
                        <span className="text-green-600 text-sm">↑ +{((item.dec - item.nov) * 100).toFixed(1)}%</span>
                      ) : item.dec < item.nov ? (
                        <span className="text-red-600 text-sm">↓ {((item.nov - item.dec) * 100).toFixed(1)}%</span>
                      ) : (
                        <span className="text-gray-600 text-sm">→ 0%</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • Capacity Utilization
      </div>
    </div>
  );
};

export default CapacityUtilization;