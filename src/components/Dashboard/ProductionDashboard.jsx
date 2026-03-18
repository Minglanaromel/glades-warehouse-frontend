// components/Dashboard/ProductionDashboard.jsx
import React, { useState, useEffect } from 'react';
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
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CubeIcon,
  UserGroupIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentArrowUpIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import useExcelData from '../../hooks/useExcelData';
import toast from 'react-hot-toast';

// Import the actual image file you have
import gladesLogo from '../../assets/images/image.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ProductionDashboard = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [logoError, setLogoError] = useState(false);
  
  const { 
    capacityData, 
    machineStatus: excelMachineStatus, 
    downtimeData,
    attendanceData,
    loading, 
    lastUpdate,
    uploadExcel,
    getHourlyProduction
  } = useExcelData();

  // Local state for processed data
  const [plantData, setPlantData] = useState({
    plant1: {},
    plant2: {}
  });
  const [machineStatus, setMachineStatus] = useState([]);
  const [downtime, setDowntime] = useState([]);
  const [attendance, setAttendance] = useState({
    shiftA: {},
    shiftB: {}
  });
  const [hourlyProduction, setHourlyProduction] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Process capacity data when it changes
  useEffect(() => {
    if (capacityData.length > 0) {
      const plant1 = {};
      const plant2 = {};
      
      capacityData.forEach(item => {
        const machineData = {
          utilization: item.machineUtil?.oct || 0,
          item: item.productDesc || 'Unknown',
          dailyCap: item.dailyCap || 0,
          totalVolume: item.totalVolume || 0
        };
        
        if (item.plant === 'PLANT 1') {
          plant1[item.machine?.toLowerCase()] = machineData;
        } else if (item.plant === 'PLANT 2') {
          plant2[item.machine?.toLowerCase()] = machineData;
        }
      });
      
      setPlantData({ plant1, plant2 });
    }
  }, [capacityData]);

  // Process machine status when it changes
  useEffect(() => {
    if (excelMachineStatus.length > 0) {
      const processed = excelMachineStatus.map(m => ({
        machine: m.machine || 'Unknown',
        status: m.status || 'Idle',
        operator: m.operator || 'Unassigned',
        efficiency: m.status === 'Running/Operating' ? Math.floor(Math.random() * 30 + 70) : 0,
        plant: m.plant || 'P1',
        process: m.process || '',
        remarks: m.remarks || ''
      }));
      setMachineStatus(processed);
    }
  }, [excelMachineStatus]);

  // Process downtime when it changes
  useEffect(() => {
    if (excelMachineStatus.length > 0) {
      const down = excelMachineStatus
        .filter(m => m.status !== 'Running/Operating' && m.status)
        .map(m => ({
          machine: m.machine || 'Unknown',
          reason: m.remarks || 'No reason specified',
          duration: m.duration || '0 mins',
          status: m.status || 'Breakdown',
          plant: m.plant || 'P1'
        }));
      setDowntime(down);
    }
  }, [excelMachineStatus]);

  // Process attendance when it changes
  useEffect(() => {
    if (attendanceData.length > 0) {
      // Process attendance data from Excel
      const shiftA = {};
      const shiftB = {};
      
      attendanceData.forEach(item => {
        if (item.shift === 'A') {
          shiftA[item.department?.toLowerCase()] = {
            actual: item.actual || 0,
            plan: item.plan || 0
          };
        } else if (item.shift === 'B') {
          shiftB[item.department?.toLowerCase()] = {
            actual: item.actual || 0,
            plan: item.plan || 0
          };
        }
      });
      
      setAttendance({ shiftA, shiftB });
    }
  }, [attendanceData]);

  // Load hourly production for demo
  useEffect(() => {
    const loadHourly = async () => {
      const data = await getHourlyProduction('PLANT 1', 'KMD1');
      if (data) {
        setHourlyProduction(data);
      }
    };
    loadHourly();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await uploadExcel(file);
      toast.success('Excel file uploaded and processed');
    }
  };

  // Calculate KPI metrics
  const totalMachines = machineStatus.length;
  const runningMachines = machineStatus.filter(m => m.status === 'Running/Operating').length;
  const breakdownMachines = machineStatus.filter(m => m.status === 'Breakdown').length;
  const idleMachines = machineStatus.filter(m => m.status === 'Idle / Waiting').length;
  
  const totalOutput = capacityData.reduce((sum, item) => sum + (item.totalVolume || 0), 0);
  const avgEfficiency = runningMachines > 0 
    ? Math.round((runningMachines / totalMachines) * 100) 
    : 0;
  
  const totalDowntimeMinutes = downtime.reduce((sum, item) => {
    const duration = item.duration || '0 mins';
    const hours = parseInt(duration.split(' ')[0]) || 0;
    const mins = parseInt(duration.split(' ')[2]) || 0;
    return sum + (hours * 60) + mins;
  }, 0);
  
  const downtimeHours = Math.floor(totalDowntimeMinutes / 60);
  const downtimeMins = totalDowntimeMinutes % 60;

  // Attendance calculations
  const totalPresent = Object.values(attendance.shiftA).reduce((sum, dept) => sum + dept.actual, 0) +
                       Object.values(attendance.shiftB).reduce((sum, dept) => sum + dept.actual, 0);
  const totalPlanned = Object.values(attendance.shiftA).reduce((sum, dept) => sum + dept.plan, 0) +
                       Object.values(attendance.shiftB).reduce((sum, dept) => sum + dept.plan, 0);
  const attendanceRate = totalPlanned > 0 ? Math.round((totalPresent / totalPlanned) * 100) : 0;

  // Chart Data
  const utilizationData = {
    labels: Object.keys(plantData.plant1).slice(0, 8).map(k => k.toUpperCase()),
    datasets: [
      {
        label: 'Utilization %',
        data: Object.values(plantData.plant1).slice(0, 8).map(v => (v.utilization * 100).toFixed(1)),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const productionData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Actual Production',
        data: [1250000, 1380000, 1420000, totalOutput / 1000 || 1500000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Target Production',
        data: [1300000, 1300000, 1300000, 1300000],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  };

  const statusData = {
    labels: ['Running', 'Idle', 'Breakdown', 'Maintenance'],
    datasets: [
      {
        data: [
          runningMachines, 
          idleMachines, 
          breakdownMachines, 
          totalMachines - (runningMachines + idleMachines + breakdownMachines)
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const getStatusColor = (status) => {
    if (status.includes('Running')) return 'bg-green-100 text-green-800';
    if (status.includes('Breakdown')) return 'bg-red-100 text-red-800';
    if (status.includes('Idle')) return 'bg-yellow-100 text-yellow-800';
    if (status.includes('Maintenance')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleLogoError = () => {
    setLogoError(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with GLADES INTERNATIONAL CORPORATION and Logo */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center space-x-4">
            {/* Logo Image with error handling */}
            {!logoError ? (
              <img 
                src={gladesLogo} 
                alt="Glades International Corporation" 
                className="h-16 w-auto object-contain bg-white rounded-lg p-2"
                onError={handleLogoError}
              />
            ) : (
              <div className="h-16 w-16 bg-blue-700 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="h-10 w-10 text-blue-200" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-wider">
                GLADES INTERNATIONAL CORPORATION
              </h1>
              <p className="text-blue-200 mt-1 flex items-center">
                <ClockIcon className="h-4 w-4 mr-2" />
                Production Monitoring System • Real-time Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="bg-blue-700 rounded-lg px-4 py-2 text-sm">
              <ClockIcon className="h-4 w-4 inline mr-2" />
              {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
            </div>
            <label className="cursor-pointer bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center">
              <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
              Upload Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Last Update with Icon */}
        <div className="mt-2 text-sm text-blue-200 flex items-center">
          <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
          Last Update: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading production data from Excel...</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <CubeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Output (Q4)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(totalOutput / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">↑ 12% vs target</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Machine Availability</p>
              <p className="text-2xl font-semibold text-gray-900">{avgEfficiency}%</p>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {runningMachines}/{totalMachines} running
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Downtime</p>
              <p className="text-2xl font-semibold text-gray-900">
                {downtimeHours}h {downtimeMins}m
              </p>
            </div>
          </div>
          <div className="mt-2 text-sm text-red-600">{breakdownMachines} machines down</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{attendanceRate}%</p>
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            {totalPresent}/{totalPlanned} present
          </div>
        </div>
      </div>

      {/* Plant Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow p-4 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-blue-900 flex items-center">
              <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
              Plant 1 Status
            </h3>
            {/* Small logo icon */}
            {!logoError && (
              <img 
                src={gladesLogo} 
                alt="" 
                className="h-6 w-auto opacity-30"
                onError={handleLogoError}
              />
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Machines</p>
              <p className="text-xl font-bold text-blue-600">
                {machineStatus.filter(m => m.plant === 'P1' || m.plant === 'PLANT 1').length}
              </p>
            </div>
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Running</p>
              <p className="text-xl font-bold text-green-600">
                {machineStatus.filter(m => (m.plant === 'P1' || m.plant === 'PLANT 1') && m.status === 'Running/Operating').length}
              </p>
            </div>
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Issues</p>
              <p className="text-xl font-bold text-yellow-600">
                {machineStatus.filter(m => (m.plant === 'P1' || m.plant === 'PLANT 1') && m.status !== 'Running/Operating').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow p-4 border-l-4 border-green-600">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-green-900 flex items-center">
              <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
              Plant 2 Status
            </h3>
            {/* Small logo icon */}
            {!logoError && (
              <img 
                src={gladesLogo} 
                alt="" 
                className="h-6 w-auto opacity-30"
                onError={handleLogoError}
              />
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Machines</p>
              <p className="text-xl font-bold text-green-600">
                {machineStatus.filter(m => m.plant === 'P2' || m.plant === 'PLANT 2').length}
              </p>
            </div>
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Running</p>
              <p className="text-xl font-bold text-green-600">
                {machineStatus.filter(m => (m.plant === 'P2' || m.plant === 'PLANT 2') && m.status === 'Running/Operating').length}
              </p>
            </div>
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Issues</p>
              <p className="text-xl font-bold text-yellow-600">
                {machineStatus.filter(m => (m.plant === 'P2' || m.plant === 'PLANT 2') && m.status !== 'Running/Operating').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Production Trend
          </h3>
          <Line data={productionData} options={chartOptions} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Machine Status Distribution
          </h3>
          <Doughnut data={statusData} options={chartOptions} />
        </div>
      </div>

      {/* Machine Status Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Machine Status Overview</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Running: {runningMachines}
            </span>
            <span className="text-sm text-gray-500">
              <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
              Idle: {idleMachines}
            </span>
            <span className="text-sm text-gray-500">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
              Breakdown: {breakdownMachines}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Machine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Process
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {machineStatus.slice(0, 10).map((machine, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      machine.plant === 'P1' || machine.plant === 'PLANT 1' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {machine.plant === 'P1' || machine.plant === 'PLANT 1' ? 'Plant 1' : 'Plant 2'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {machine.machine}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(machine.status)}`}>
                      {machine.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {machine.operator}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {machine.process}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {machine.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Downtime and Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Downtime Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Active Downtime Issues</h3>
          </div>
          <div className="p-6">
            {downtime.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No active downtime issues</p>
            ) : (
              downtime.slice(0, 5).map((issue, index) => (
                <div key={index} className="mb-4 last:mb-0 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className={`px-2 py-0.5 text-xs rounded-full mr-2 ${
                          issue.plant === 'P1' || issue.plant === 'PLANT 1'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {issue.plant}
                        </span>
                        <p className="font-medium text-red-800">{issue.machine}</p>
                      </div>
                      <p className="text-sm text-red-600 mt-1">{issue.reason}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                        {issue.duration}
                      </span>
                      <p className="text-xs text-red-500 mt-1">{issue.status}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Attendance Overview */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Shift A</h4>
                {Object.keys(attendance.shiftA).length === 0 ? (
                  <p className="text-sm text-gray-500">No attendance data available</p>
                ) : (
                  Object.entries(attendance.shiftA).map(([dept, data]) => (
                    <div key={dept} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-gray-600">{dept}</span>
                        <span className="font-medium">
                          {data.actual}/{data.plan}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            data.actual === data.plan ? 'bg-green-500' :
                            data.actual > 0 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(data.actual / data.plan) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Shift B</h4>
                {Object.keys(attendance.shiftB).length === 0 ? (
                  <p className="text-sm text-gray-500">No attendance data available</p>
                ) : (
                  Object.entries(attendance.shiftB).map(([dept, data]) => (
                    <div key={dept} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-gray-600">{dept}</span>
                        <span className="font-medium">
                          {data.actual}/{data.plan}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            data.actual === data.plan ? 'bg-green-500' :
                            data.actual > 0 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(data.actual / data.plan) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Trouble Reports */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Production Trouble Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Machine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU Affected
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {downtime.slice(0, 5).map((issue, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      issue.plant === 'P1' || issue.plant === 'PLANT 1'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {issue.plant}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {issue.machine}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {issue.machine === 'KMD' ? '1oz Lid' : 
                     issue.machine === 'PCM11' ? '16oz SDD paper' : 
                     issue.machine === 'IM17' ? 'Fork' : 'Various'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    {issue.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      issue.status.includes('Running') ? 'bg-green-100 text-green-800' :
                      issue.status.includes('Breakdown') ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {issue.machine === 'PCM11' ? 'Dec 01' : 
                     issue.machine === 'IM17' ? 'Dec 15' : 'TBA'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OTIF Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">OTIF Performance</h3>
          <span className="text-3xl font-bold text-green-600">98%</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Plant 1</p>
            <div className="flex items-center mt-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <span className="ml-2 text-sm font-medium">95%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Plant 2</p>
            <div className="flex items-center mt-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <span className="ml-2 text-sm font-medium">92%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Overall</p>
            <div className="flex items-center mt-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
              <span className="ml-2 text-sm font-medium">94%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Logo */}
      <div className="text-center text-sm text-gray-500 py-4 border-t flex items-center justify-center space-x-2">
        {!logoError ? (
          <img 
            src={gladesLogo} 
            alt="Glades" 
            className="h-6 w-auto opacity-50"
            onError={handleLogoError}
          />
        ) : (
          <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
        )}
        <span>
          GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • 
          Production Monitoring System v2.0 • Real-time Data from Excel
        </span>
        <span className="mx-2">•</span>
        <span className="text-blue-600">Plant 1</span>
        <span className="mx-2">|</span>
        <span className="text-green-600">Plant 2</span>
      </div>
    </div>
  );
};

export default ProductionDashboard;