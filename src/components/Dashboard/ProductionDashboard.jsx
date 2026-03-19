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
    productionData,
    loading, 
    lastUpdate,
    uploadExcel,
    getHourlyProduction
  } = useExcelData();

  const [plantData, setPlantData] = useState({ plant1: {}, plant2: {} });
  const [machineStatus, setMachineStatus] = useState([]);
  const [downtime, setDowntime] = useState([]);
  const [attendance, setAttendance] = useState({ shiftA: {}, shiftB: {} });
  const [troubleReports, setTroubleReports] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Process capacity data
  useEffect(() => {
    if (capacityData && capacityData.length > 0) {
      const plant1 = {};
      const plant2 = {};
      
      capacityData.forEach(item => {
        const machineData = {
          utilization: item.machineUtil?.oct || 0,
          item: item['Product Desc'] || 'Unknown',
          dailyCap: item['Daily Cap. pcs'] || 0,
          totalVolume: item['Total Volume'] || 0
        };
        
        if (item.Plant === 'PLANT 1') {
          plant1[item.Machine?.toLowerCase()] = machineData;
        } else if (item.Plant === 'PLANT 2') {
          plant2[item.Machine?.toLowerCase()] = machineData;
        }
      });
      
      setPlantData({ plant1, plant2 });
    }
  }, [capacityData]);

  // Process machine status
  useEffect(() => {
    if (excelMachineStatus && excelMachineStatus.length > 0) {
      const processed = excelMachineStatus.map(m => ({
        plant: m.Plant || 'P1',
        process: m.Process || '',
        machine: m.Machine || 'Unknown',
        status: m.Status || 'Idle',
        operator: m.Operator || 'Unassigned',
        remarks: m.Remarks || '',
        efficiency: m.Status === 'Running/Operating' ? Math.floor(Math.random() * 30 + 70) : 0
      }));
      setMachineStatus(processed);
    }
  }, [excelMachineStatus]);

  // Process downtime
  useEffect(() => {
    if (excelMachineStatus && excelMachineStatus.length > 0) {
      const down = excelMachineStatus
        .filter(m => m.Status && !m.Status.toLowerCase().includes('running'))
        .map(m => ({
          plant: m.Plant || 'P1',
          machine: m.Machine || 'Unknown',
          reason: m.Remarks || 'No reason specified',
          duration: m.Duration || '0 mins',
          status: m.Status || 'Breakdown'
        }));
      setDowntime(down);
    }
  }, [excelMachineStatus]);

  // Process trouble reports from Prodn Trouble Report sheet
  useEffect(() => {
    if (productionData && productionData.length > 0) {
      // Look for Prodn Trouble Report data
      const troubleSheet = productionData.find(sheet => 
        sheet.sheetName?.includes('Prodn Trouble Report') || 
        Object.keys(sheet).some(key => key.includes('Machine') && key.includes('SKU'))
      );
      
      if (troubleSheet && troubleSheet.data) {
        const reports = troubleSheet.data.map(row => ({
          plant: row.Plant || '',
          machine: row.Machine || '',
          sku: row['SKU Affected'] || '',
          dateStarted: row['Date Started'] || '',
          issue: row.Issue || '',
          actions: row.Actions || '',
          status: row.Status || '',
          target: row['Target to up'] || '',
          remarks: row.Remarks || ''
        }));
        setTroubleReports(reports);
      }
    }
  }, [productionData]);

  // Process attendance
  useEffect(() => {
    if (attendanceData && attendanceData.length > 0) {
      const shiftA = {};
      const shiftB = {};
      
      // Extract from P1&2 Attendance sheet
      const departments = ['Extrusion', 'Thermo', 'Printing', 'Thermo ICM', 'Injection', 'Labeling', 'Recycling'];
      const colMap = ['G', 'K', 'O', 'S', 'W', 'AA', 'AE'];
      
      departments.forEach((dept, idx) => {
        shiftA[dept.toLowerCase()] = {
          actual: (attendanceData[9]?.[colMap[idx]] || 0) + (attendanceData[9]?.[colMap[idx]] || 0),
          plan: (attendanceData[9]?.[colMap[idx]+'1'] || 0) + (attendanceData[9]?.[colMap[idx]+'1'] || 0)
        };
        shiftB[dept.toLowerCase()] = {
          actual: (attendanceData[23]?.[colMap[idx]] || 0) + (attendanceData[23]?.[colMap[idx]] || 0),
          plan: (attendanceData[23]?.[colMap[idx]+'1'] || 0) + (attendanceData[23]?.[colMap[idx]+'1'] || 0)
        };
      });
      
      setAttendance({ shiftA, shiftB });
    }
  }, [attendanceData]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await uploadExcel(file);
      toast.success('Excel file uploaded and processed');
    }
  };

  // Calculate KPI metrics
  const totalMachines = machineStatus.length;
  const runningMachines = machineStatus.filter(m => m.status && m.status.toLowerCase().includes('running')).length;
  const breakdownMachines = machineStatus.filter(m => m.status && m.status.toLowerCase().includes('breakdown')).length;
  const idleMachines = machineStatus.filter(m => m.status && m.status.toLowerCase().includes('idle')).length;
  
  const totalOutput = capacityData.reduce((sum, item) => sum + (item.totalVolume || 0), 0);
  const avgEfficiency = totalMachines > 0 ? Math.round((runningMachines / totalMachines) * 100) : 0;
  
  const totalDowntimeMinutes = downtime.reduce((sum, item) => {
    const duration = item.duration || '0 mins';
    const hours = parseInt(duration.split(' ')[0]) || 0;
    const mins = parseInt(duration.split(' ')[2]) || 0;
    return sum + (hours * 60) + mins;
  }, 0);
  
  const downtimeHours = Math.floor(totalDowntimeMinutes / 60);
  const downtimeMins = totalDowntimeMinutes % 60;

  // Attendance calculations
  const totalPresent = Object.values(attendance.shiftA).reduce((sum, dept) => sum + (dept.actual || 0), 0) +
                       Object.values(attendance.shiftB).reduce((sum, dept) => sum + (dept.actual || 0), 0);
  const totalPlanned = Object.values(attendance.shiftA).reduce((sum, dept) => sum + (dept.plan || 0), 0) +
                       Object.values(attendance.shiftB).reduce((sum, dept) => sum + (dept.plan || 0), 0);
  const attendanceRate = totalPlanned > 0 ? Math.round((totalPresent / totalPlanned) * 100) : 0;

  // Chart Data
  const productionDataChart = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Actual Production',
        data: [1250000, 1380000, 1420000, totalOutput || 1500000],
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
      legend: { position: 'top' },
    },
  };

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('running')) return 'bg-green-100 text-green-800';
    if (s.includes('breakdown')) return 'bg-red-100 text-red-800';
    if (s.includes('idle')) return 'bg-yellow-100 text-yellow-800';
    if (s.includes('maintenance')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleLogoError = () => setLogoError(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-blue-700 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="h-10 w-10 text-blue-200" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-wider">GLADES INTERNATIONAL CORPORATION</h1>
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
              <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
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
          <h3 className="text-lg font-semibold text-blue-900 flex items-center mb-2">
            <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
            Plant 1 Status
          </h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Machines</p>
              <p className="text-xl font-bold text-blue-600">
                {machineStatus.filter(m => m.plant === 'P1').length}
              </p>
            </div>
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Running</p>
              <p className="text-xl font-bold text-green-600">
                {machineStatus.filter(m => m.plant === 'P1' && m.status?.toLowerCase().includes('running')).length}
              </p>
            </div>
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Issues</p>
              <p className="text-xl font-bold text-yellow-600">
                {machineStatus.filter(m => m.plant === 'P1' && !m.status?.toLowerCase().includes('running')).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow p-4 border-l-4 border-green-600">
          <h3 className="text-lg font-semibold text-green-900 flex items-center mb-2">
            <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
            Plant 2 Status
          </h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Machines</p>
              <p className="text-xl font-bold text-green-600">
                {machineStatus.filter(m => m.plant === 'P2').length}
              </p>
            </div>
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Running</p>
              <p className="text-xl font-bold text-green-600">
                {machineStatus.filter(m => m.plant === 'P2' && m.status?.toLowerCase().includes('running')).length}
              </p>
            </div>
            <div className="bg-white rounded p-2">
              <p className="text-gray-600">Issues</p>
              <p className="text-xl font-bold text-yellow-600">
                {machineStatus.filter(m => m.plant === 'P2' && !m.status?.toLowerCase().includes('running')).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Trend</h3>
          <Line data={productionDataChart} options={chartOptions} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Machine Status Distribution</h3>
          <Doughnut data={statusData} options={chartOptions} />
        </div>
      </div>

      {/* Production Trouble Reports */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Production Trouble Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU Affected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {troubleReports.length > 0 ? troubleReports.map((report, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      report.plant?.includes('1') ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {report.plant || 'P1'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.machine}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">{report.issue}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">{report.actions}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                      {report.status || 'Open'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.target || 'TBA'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No trouble reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4 border-t flex items-center justify-center space-x-2">
        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
        <span>
          GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • 
          Production Monitoring System • Real-time Data from Excel
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