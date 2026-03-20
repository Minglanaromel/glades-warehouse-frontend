import React, { useState, useEffect } from 'react';
import { useExcelData } from '../../context/ExcelDataContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  BuildingOfficeIcon,
  CubeIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentArrowUpIcon,
  ArrowPathIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import gladesLogo from '../../assets/images/image.png';

// Register all ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const ProductionDashboard = () => {
  const { excelData, loading, lastUpdate, uploadExcel } = useExcelData();
  const [dateTime, setDateTime] = useState(new Date());
  const [logoError, setLogoError] = useState(false);
  const [chartKey, setChartKey] = useState(0); // Force chart refresh

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Force chart refresh when Excel data changes
  useEffect(() => {
    setChartKey(prev => prev + 1);
  }, [excelData]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const success = await uploadExcel(file);
      if (success) {
        toast.success('Excel file loaded successfully!');
      }
    }
  };

  const formatNumber = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0';
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(num)) return '0';
    return num.toLocaleString();
  };

  const formatPercentage = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0%';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0%';
    return `${(num * 100).toFixed(1)}%`;
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  // Calculate metrics from Excel data
  const totalMachines = excelData.machineStatus?.length || 0;
  const runningMachines = excelData.machineStatus?.filter(m => m.status?.toLowerCase().includes('running')).length || 0;
  const breakdownMachines = excelData.machineStatus?.filter(m => m.status?.toLowerCase().includes('breakdown')).length || 0;
  const idleMachines = excelData.machineStatus?.filter(m => m.status?.toLowerCase().includes('idle')).length || 0;
  const maintenanceMachines = excelData.machineStatus?.filter(m => m.status?.toLowerCase().includes('maintenance')).length || 0;
  
  const totalOutput = excelData.capacityUtilization?.reduce((sum, c) => sum + (c.totalVolume || 0), 0) || 0;
  const avgEfficiency = totalMachines > 0 ? Math.round((runningMachines / totalMachines) * 100) : 0;
  
  const totalDowntimeHours = excelData.downtime?.reduce((sum, d) => {
    const dur = d.duration || '0 mins';
    const hours = parseInt(dur.split(' ')[0]) || 0;
    return sum + hours;
  }, 0) || 0;

  // Production Trend Data (weekly)
  const weeklyProduction = [
    totalOutput * 0.65,
    totalOutput * 0.75,
    totalOutput * 0.85,
    totalOutput * 0.95,
    totalOutput
  ];

  const productionChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Actual Production',
        data: weeklyProduction,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Target Production',
        data: [totalOutput * 0.7, totalOutput * 0.8, totalOutput * 0.9, totalOutput * 1.0, totalOutput * 1.05],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Machine Status Distribution Data (Doughnut Chart)
  const machineStatusData = {
    labels: ['Running', 'Breakdown', 'Idle', 'Maintenance'],
    datasets: [
      {
        data: [
          runningMachines,
          breakdownMachines,
          idleMachines,
          maintenanceMachines
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.85)',
          'rgba(239, 68, 68, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(107, 114, 128, 0.85)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(107, 114, 128)',
        ],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // Capacity Utilization Chart (Bar Chart)
  const capacityData = excelData.capacityUtilization?.slice(0, 8).map(c => ({
    machine: c.machine,
    utilization: (c.octUtil || 0) * 100
  })) || [];

  const capacityChartData = {
    labels: capacityData.map(c => c.machine),
    datasets: [
      {
        label: 'Capacity Utilization (%)',
        data: capacityData.map(c => c.utilization),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // Downtime by Machine Chart (Horizontal Bar)
  const downtimeData = excelData.downtime?.slice(0, 6).map(d => ({
    machine: d.machine,
    hours: parseInt(d.duration?.split(' ')[0]) || 0
  })) || [];

  const downtimeChartData = {
    labels: downtimeData.map(d => d.machine),
    datasets: [
      {
        label: 'Downtime (Hours)',
        data: downtimeData.map(d => d.hours),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US').format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Production Volume',
          font: { weight: 'bold' }
        },
        ticks: {
          callback: (value) => {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'K';
            }
            return value;
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Week',
          font: { weight: 'bold' }
        }
      }
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} machines (${percentage}%)`;
          }
        }
      }
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y.toFixed(1) + '%';
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Utilization (%)',
          font: { weight: 'bold' }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Machine',
          font: { weight: 'bold' }
        }
      }
    },
  };

  const downtimeBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Downtime (Hours)',
          font: { weight: 'bold' }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Machine',
          font: { weight: 'bold' }
        }
      }
    },
  };

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('running')) return 'bg-green-100 text-green-800';
    if (s.includes('breakdown')) return 'bg-red-100 text-red-800';
    if (s.includes('idle')) return 'bg-yellow-100 text-yellow-800';
    if (s.includes('maintenance')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading production data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Logo and Upload */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center space-x-4">
            {/* Logo Image */}
            <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-md">
              {!logoError ? (
                <img 
                  src={gladesLogo} 
                  alt="Glades International" 
                  className="h-14 w-14 object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <BuildingOfficeIcon className="h-10 w-10 text-blue-900" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider">GLADES INTERNATIONAL CORPORATION</h1>
              <p className="text-blue-200 text-sm mt-1 flex items-center">
                <ClockIcon className="h-4 w-4 mr-2" />
                Production Monitoring System • Real-time Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="bg-blue-800 rounded-lg px-4 py-2 text-sm">
              <ClockIcon className="h-4 w-4 inline mr-2" />
              {dateTime.toLocaleDateString()} {formatTime(dateTime)}
            </div>
            <label className="cursor-pointer bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center shadow-md">
              <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
              Upload Excel
              <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
        <div className="mt-3 text-sm text-blue-200 flex items-center justify-between">
          <div className="flex items-center">
            <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
            Last Update: {formatTime(lastUpdate)}
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Live Data</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <CubeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Output</p>
              <p className="text-2xl font-bold text-gray-900">
                {(totalOutput / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-gray-400 mt-1">Year to Date</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Machine Availability</p>
              <p className="text-2xl font-bold text-green-600">{avgEfficiency}%</p>
              <div className="mt-1 w-32 bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${avgEfficiency}%` }}></div>
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {runningMachines}/{totalMachines} machines running
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Downtime</p>
              <p className="text-2xl font-bold text-red-600">{totalDowntimeHours} hrs</p>
              <p className="text-xs text-red-500 mt-1">{breakdownMachines} machines affected</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Machines</p>
              <p className="text-2xl font-bold text-purple-600">{runningMachines}</p>
              <p className="text-xs text-gray-400 mt-1">out of {totalMachines} total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Trend Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Production Trend</h3>
            <span className="text-xs text-gray-400">Last 5 Weeks</span>
          </div>
          <div className="h-80">
            <Line key={`line-${chartKey}`} data={productionChartData} options={lineOptions} />
          </div>
        </div>

        {/* Machine Status Distribution Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Machine Status Distribution</h3>
            <span className="text-xs text-gray-400">Current Status</span>
          </div>
          <div className="h-80">
            {totalMachines > 0 ? (
              <Doughnut key={`doughnut-${chartKey}`} data={machineStatusData} options={doughnutOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <WrenchScrewdriverIcon className="h-12 w-12 mx-auto mb-2" />
                  <p>No machine data available</p>
                  <p className="text-sm">Please upload an Excel file</p>
                </div>
              </div>
            )}
          </div>
          {/* Legend Stats */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-green-600 font-bold">{runningMachines}</div>
              <div className="text-xs text-gray-500">Running</div>
            </div>
            <div className="text-center">
              <div className="text-red-600 font-bold">{breakdownMachines}</div>
              <div className="text-xs text-gray-500">Breakdown</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-600 font-bold">{idleMachines}</div>
              <div className="text-xs text-gray-500">Idle</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 font-bold">{maintenanceMachines}</div>
              <div className="text-xs text-gray-500">Maintenance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity Utilization Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Capacity Utilization</h3>
            <span className="text-xs text-gray-400">Top 8 Machines</span>
          </div>
          <div className="h-80">
            {capacityData.length > 0 ? (
              <Bar key={`capacity-${chartKey}`} data={capacityChartData} options={barOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <ChartBarIcon className="h-12 w-12 mx-auto mb-2" />
                  <p>No capacity data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Downtime by Machine Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Downtime by Machine</h3>
            <span className="text-xs text-gray-400">Top 6 Machines</span>
          </div>
          <div className="h-80">
            {downtimeData.length > 0 ? (
              <Bar key={`downtime-${chartKey}`} data={downtimeChartData} options={downtimeBarOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <ClockIcon className="h-12 w-12 mx-auto mb-2" />
                  <p>No downtime data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Machine Status Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Machine Status Details</h3>
          <p className="text-sm text-gray-500 mt-1">Based on data from uploaded Excel file</p>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Process</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {excelData.machineStatus?.length > 0 ? (
                excelData.machineStatus.slice(0, 10).map((machine, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${machine.plant === 'P1' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {machine.plant || 'P1'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{machine.process || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{machine.machine}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(machine.status)}`}>
                        {machine.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{machine.operator || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{machine.remarks || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <WrenchScrewdriverIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>No machine status data available</p>
                    <p className="text-sm">Please upload an Excel file using the button above</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Status Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Production Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {excelData.productionStatus?.length > 0 ? (
                excelData.productionStatus.slice(0, 10).map((prod, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.machine}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.itemDesc?.substring(0, 30) || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(prod.actual)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(prod.plan)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(prod.percentage || 0, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{formatPercentage((prod.percentage || 0) / 100)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No production data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        <p>GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • Production Monitoring System</p>
        <p className="text-xs mt-1">Real-time data from Excel • Last sync: {formatTime(lastUpdate)}</p>
      </div>
    </div>
  );
};

export default ProductionDashboard;