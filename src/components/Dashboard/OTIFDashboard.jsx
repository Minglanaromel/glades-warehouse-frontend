// components/Dashboard/OTIFDashboard.jsx
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const OTIFDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [selectedPlant, setSelectedPlant] = useState('all');

  // OTIF Data
  const otifData = {
    weekly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      plant1: [95, 96, 94, 97],
      plant2: [92, 93, 91, 94],
      overall: [94, 95, 93, 96],
    },
    monthly: {
      labels: ['Oct', 'Nov', 'Dec'],
      plant1: [95, 94, 96],
      plant2: [92, 91, 93],
      overall: [94, 93, 95],
    },
  };

  // Detailed OTIF Data
  const detailedData = [
    { 
      plant: 'P1', 
      customer: 'McDonalds', 
      orders: 450, 
      onTime: 432, 
      inFull: 428, 
      otif: 95.1,
      status: 'On Target'
    },
    { 
      plant: 'P1', 
      customer: 'Jollibee', 
      orders: 320, 
      onTime: 304, 
      inFull: 298, 
      otif: 93.1,
      status: 'On Target'
    },
    { 
      plant: 'P1', 
      customer: 'Starbucks', 
      orders: 280, 
      onTime: 266, 
      inFull: 260, 
      otif: 92.9,
      status: 'On Target'
    },
    { 
      plant: 'P2', 
      customer: 'McDonalds', 
      orders: 380, 
      onTime: 350, 
      inFull: 342, 
      otif: 90.0,
      status: 'Below Target'
    },
    { 
      plant: 'P2', 
      customer: 'KFC', 
      orders: 210, 
      onTime: 193, 
      inFull: 189, 
      otif: 90.0,
      status: 'Below Target'
    },
    { 
      plant: 'P2', 
      customer: 'Burger King', 
      orders: 150, 
      onTime: 141, 
      inFull: 138, 
      otif: 92.0,
      status: 'On Target'
    },
  ];

  // Filter data based on selected plant
  const filteredData = selectedPlant === 'all' 
    ? detailedData 
    : detailedData.filter(d => d.plant === selectedPlant);

  // Calculate summary statistics
  const totalOrders = filteredData.reduce((sum, item) => sum + item.orders, 0);
  const totalOnTime = filteredData.reduce((sum, item) => sum + item.onTime, 0);
  const totalInFull = filteredData.reduce((sum, item) => sum + item.inFull, 0);
  const avgOTIF = (totalOnTime / totalOrders * 100).toFixed(1);

  const plant1Avg = detailedData
    .filter(d => d.plant === 'P1')
    .reduce((sum, item) => sum + item.otif, 0) / 
    detailedData.filter(d => d.plant === 'P1').length;

  const plant2Avg = detailedData
    .filter(d => d.plant === 'P2')
    .reduce((sum, item) => sum + item.otif, 0) / 
    detailedData.filter(d => d.plant === 'P2').length;

  // Chart Data
  const chartData = {
    labels: otifData[selectedPeriod].labels,
    datasets: [
      {
        label: 'Plant 1',
        data: otifData[selectedPeriod].plant1,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 3,
      },
      {
        label: 'Plant 2',
        data: otifData[selectedPeriod].plant2,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        borderWidth: 3,
      },
      {
        label: 'Overall',
        data: otifData[selectedPeriod].overall,
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 4,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'OTIF Performance Trend',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'OTIF %',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
    },
  };

  const statusData = {
    labels: ['On Time', 'Late', 'Short'],
    datasets: [
      {
        data: [92, 5, 3],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '60%',
  };

  const getStatusColor = (status) => {
    if (status === 'On Target') return 'bg-green-100 text-green-800';
    if (status === 'Below Target') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header with GLADES branding */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo/Icon */}
            <div className="bg-white/20 p-3 rounded-lg">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider flex items-center">
                GLADES INTERNATIONAL CORPORATION
              </h1>
              <p className="text-purple-200 mt-1 flex items-center">
                <TruckIcon className="h-4 w-4 mr-2" />
                On Time In Full • Customer Service Level Dashboard
              </p>
            </div>
          </div>
          
          {/* Period Selector */}
          <div className="flex bg-purple-800 rounded-lg p-1">
            <button
              onClick={() => setSelectedPeriod('weekly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                selectedPeriod === 'weekly' 
                  ? 'bg-white text-purple-900' 
                  : 'text-white hover:bg-purple-600'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setSelectedPeriod('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                selectedPeriod === 'monthly' 
                  ? 'bg-white text-purple-900' 
                  : 'text-white hover:bg-purple-600'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Plant 1 OTIF</p>
              <p className="text-3xl font-semibold text-blue-600">{plant1Avg.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            ↑ 2% vs last period
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Plant 2 OTIF</p>
              <p className="text-3xl font-semibold text-green-600">{plant2Avg.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            ↑ 1% vs last period
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall OTIF</p>
              <p className="text-3xl font-semibold text-purple-600">{avgOTIF}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CheckCircleIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-yellow-600 mt-2">Target: 95%</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-semibold text-indigo-600">{totalOrders.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{totalOnTime} delivered on time</p>
        </div>
      </div>

      {/* Plant Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Plant:</label>
          <select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            className="input-field w-48"
          >
            <option value="all">All Plants</option>
            <option value="P1">Plant 1</option>
            <option value="P2">Plant 2</option>
          </select>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Order Status Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={statusData} options={doughnutOptions} />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">92%</p>
              <p className="text-xs text-gray-500">On Time</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">5%</p>
              <p className="text-xs text-gray-500">Late</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">3%</p>
              <p className="text-xs text-gray-500">Short</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-600" />
            OTIF Details by Customer
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  On Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Full
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OTIF %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.plant === 'P1' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.plant === 'P1' ? 'Plant 1' : 'Plant 2'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.orders.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.onTime.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.inFull.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${
                      item.otif >= 95 ? 'text-green-600' : 
                      item.otif >= 90 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {item.otif}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        <div className="flex items-center justify-center space-x-2">
          <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
          <span>GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          On Time In Full (OTIF) Dashboard • Updated in real-time
        </p>
      </div>
    </div>
  );
};

export default OTIFDashboard;