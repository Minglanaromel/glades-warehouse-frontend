import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';
import dashboardService from '../../services/dashboardService';
import toast from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const CapacityUtilization = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [capacityData, setCapacityData] = useState({
    warehouse: 75,
    production: 60,
    shipping: 45,
    receiving: 30
  });
  
  const [historicalData, setHistoricalData] = useState({
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    warehouse: [65, 70, 72, 75, 78, 75],
    production: [55, 58, 60, 62, 61, 60],
    shipping: [40, 42, 43, 45, 46, 45]
  });

  useEffect(() => {
    fetchCapacityData();
  }, []);

  const fetchCapacityData = async () => {
    setLoading(true);
    try {
      // Uncomment this when your backend is ready
      // const stats = await dashboardService.getStats();
      // if (stats && stats.capacityData) {
      //   setCapacityData(stats.capacityData);
      // }
      
      // For now, use mock data
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching capacity data:', error);
      toast.error('Failed to load capacity data');
      setLoading(false);
    }
  };

  // Pie chart data for current capacity
  const pieChartData = {
    labels: ['Warehouse', 'Production', 'Shipping', 'Receiving'],
    datasets: [
      {
        label: 'Capacity Utilization (%)',
        data: [capacityData.warehouse, capacityData.production, capacityData.shipping, capacityData.receiving],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data for historical trend
  const barChartData = {
    labels: historicalData.labels,
    datasets: [
      {
        label: 'Warehouse Capacity',
        data: historicalData.warehouse,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Production Capacity',
        data: historicalData.production,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Shipping Capacity',
        data: historicalData.shipping,
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Current Capacity Utilization',
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Capacity Trend (Last 6 Weeks)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Utilization %',
        },
      },
    },
  };

  const getCapacityColor = (value) => {
    if (value >= 80) return 'text-red-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getCapacityStatus = (value) => {
    if (value >= 80) return 'Critical';
    if (value >= 60) return 'High';
    if (value >= 30) return 'Normal';
    return 'Low';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Capacity Utilization</h1>
        <p className="text-gray-600">Monitor warehouse and production capacity usage</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Warehouse</p>
              <p className={`text-2xl font-bold ${getCapacityColor(capacityData.warehouse)}`}>
                {capacityData.warehouse}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Status: {getCapacityStatus(capacityData.warehouse)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Production</p>
              <p className={`text-2xl font-bold ${getCapacityColor(capacityData.production)}`}>
                {capacityData.production}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Status: {getCapacityStatus(capacityData.production)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Shipping</p>
              <p className={`text-2xl font-bold ${getCapacityColor(capacityData.shipping)}`}>
                {capacityData.shipping}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Status: {getCapacityStatus(capacityData.shipping)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentView" viewBox="0 0 24 24">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Receiving</p>
              <p className={`text-2xl font-bold ${getCapacityColor(capacityData.receiving)}`}>
                {capacityData.receiving}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Status: {getCapacityStatus(capacityData.receiving)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="h-80">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="h-80">
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Capacity Details Table */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b">
          <h3 className="font-medium text-gray-700">Detailed Capacity Analysis</h3>
        </div>
        <div className="p-4">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Area</th>
                <th className="text-left py-2">Current Usage</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Trend</th>
                <th className="text-left py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Warehouse A</td>
                <td className="py-2">85%</td>
                <td className="py-2"><span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Critical</span></td>
                <td className="py-2 text-green-600">↑ 5%</td>
                <td className="py-2">
                  <button className="text-blue-600 hover:text-blue-800">Optimize</button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Production Line 1</td>
                <td className="py-2">62%</td>
                <td className="py-2"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">High</span></td>
                <td className="py-2 text-red-600">↓ 2%</td>
                <td className="py-2">
                  <button className="text-blue-600 hover:text-blue-800">Schedule</button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Shipping Dock</td>
                <td className="py-2">45%</td>
                <td className="py-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Normal</span></td>
                <td className="py-2 text-green-600">↑ 3%</td>
                <td className="py-2">
                  <button className="text-blue-600 hover:text-blue-800">View</button>
                </td>
              </tr>
              <tr>
                <td className="py-2">Receiving Bay</td>
                <td className="py-2">30%</td>
                <td className="py-2"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Low</span></td>
                <td className="py-2 text-gray-600">→ 0%</td>
                <td className="py-2">
                  <button className="text-blue-600 hover:text-blue-800">Allocate</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CapacityUtilization;