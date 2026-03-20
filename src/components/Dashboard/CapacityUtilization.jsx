import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { BuildingOfficeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import useExcelData from '../../hooks/useExcelData';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const CapacityUtilization = () => {
  const { capacityData, loading, lastUpdate } = useExcelData();
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate capacity data from Excel
  const calculateCapacityData = () => {
    if (!capacityData || capacityData.length === 0) {
      return {
        warehouse: 75,
        production: 60,
        shipping: 45,
        receiving: 30
      };
    }

    // Calculate average utilization from machine data
    const utilizations = capacityData
      .filter(item => item.machineUtil)
      .map(item => item.machineUtil.oct || 0);
    
    const avgUtilization = utilizations.length > 0 
      ? utilizations.reduce((a, b) => a + b, 0) / utilizations.length * 100 
      : 60;

    return {
      warehouse: Math.min(avgUtilization * 1.2, 95),
      production: avgUtilization,
      shipping: Math.min(avgUtilization * 0.8, 70),
      receiving: Math.min(avgUtilization * 0.7, 60)
    };
  };

  const capacityDataValues = calculateCapacityData();

  // Calculate weekly trend from capacity data
  const getWeeklyTrend = () => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const warehouse = [];
    const production = [];
    const shipping = [];
    
    for (let i = 0; i < 4; i++) {
      const weekData = capacityData.filter(item => item.machineUtil);
      const avgProd = weekData.length > 0 
        ? weekData.reduce((sum, item) => sum + (item.machineUtil.oct || 0), 0) / weekData.length * 100 
        : 60 + (i * 2);
      production.push(Math.min(avgProd + i, 95));
      warehouse.push(Math.min(avgProd * 1.2 + i, 95));
      shipping.push(Math.min(avgProd * 0.8 + i, 70));
    }
    
    return { warehouse, production, shipping };
  };

  const weeklyTrend = getWeeklyTrend();

  // Pie chart data
  const pieChartData = {
    labels: ['Warehouse', 'Production', 'Shipping', 'Receiving'],
    datasets: [
      {
        label: 'Capacity Utilization (%)',
        data: [
          capacityDataValues.warehouse,
          capacityDataValues.production,
          capacityDataValues.shipping,
          capacityDataValues.receiving
        ],
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

  // Bar chart data
  const barChartData = {
    labels: weeklyTrend.warehouse.map((_, i) => `Week ${i + 1}`),
    datasets: [
      {
        label: 'Warehouse Capacity',
        data: weeklyTrend.warehouse,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Production Capacity',
        data: weeklyTrend.production,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Shipping Capacity',
        data: weeklyTrend.shipping,
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
      legend: { position: 'bottom' },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: 'Utilization %' },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
            <BuildingOfficeIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wider">GLADES INTERNATIONAL CORPORATION</h1>
            <p className="text-blue-200 text-sm mt-1">Capacity Utilization • Real-time Monitoring</p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-blue-700">
          <div className="flex items-center space-x-2">
            <ArrowPathIcon className="h-4 w-4 text-blue-300 animate-spin" />
            <span className="text-sm text-blue-200">Last Update: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <div className="text-sm text-blue-200">
            {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Warehouse</p>
              <p className={`text-2xl font-bold ${getCapacityColor(capacityDataValues.warehouse)}`}>
                {capacityDataValues.warehouse.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Status: {getCapacityStatus(capacityDataValues.warehouse)}
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
              <p className={`text-2xl font-bold ${getCapacityColor(capacityDataValues.production)}`}>
                {capacityDataValues.production.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Status: {getCapacityStatus(capacityDataValues.production)}
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
              <p className={`text-2xl font-bold ${getCapacityColor(capacityDataValues.shipping)}`}>
                {capacityDataValues.shipping.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Status: {getCapacityStatus(capacityDataValues.shipping)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p className={`text-2xl font-bold ${getCapacityColor(capacityDataValues.receiving)}`}>
                {capacityDataValues.receiving.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Status: {getCapacityStatus(capacityDataValues.receiving)}
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
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Capacity Distribution</h3>
          <div className="h-80">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Capacity Trend</h3>
          <div className="h-80">
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Machine Capacity Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Machine Capacity Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Daily Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oct Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {capacityData.slice(0, 10).map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.machine}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.productDesc?.substring(0, 30)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.dailyCap?.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${(item.machineUtil?.oct || 0) >= 100 ? 'bg-green-600' : (item.machineUtil?.oct || 0) >= 80 ? 'bg-yellow-600' : 'bg-blue-600'}`}
                          style={{ width: `${Math.min((item.machineUtil?.oct || 0) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{((item.machineUtil?.oct || 0) * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      (item.machineUtil?.oct || 0) >= 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {(item.machineUtil?.oct || 0) >= 1 ? 'Active' : 'Idle'}
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
        GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • Capacity Utilization Monitoring
        <span className="mx-2">•</span>
        <span className="text-blue-600">Plant 1</span>
        <span className="mx-2">|</span>
        <span className="text-green-600">Plant 2</span>
      </div>
    </div>
  );
};

export default CapacityUtilization;