import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExcelData } from '../../context/ExcelDataContext';
import {
  BuildingOfficeIcon,
  ClockIcon,
  CubeIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import gladesLogo from '../../assets/images/image.png';

const Dashboard = () => {
  const { user } = useAuth();
  const { excelData, loading, lastUpdate } = useExcelData();
  const [dateTime, setDateTime] = useState(new Date());
  const [logoError, setLogoError] = useState(false);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Calculate statistics
  const totalMachines = excelData.machineStatus?.length || 0;
  const runningMachines = excelData.machineStatus?.filter(m => m.status?.toLowerCase().includes('running')).length || 0;
  const breakdownMachines = excelData.machineStatus?.filter(m => m.status?.toLowerCase().includes('breakdown')).length || 0;
  const idleMachines = excelData.machineStatus?.filter(m => m.status?.toLowerCase().includes('idle')).length || 0;
  const maintenanceMachines = excelData.machineStatus?.filter(m => m.status?.toLowerCase().includes('maintenance')).length || 0;

  const totalDowntimeHours = excelData.downtime?.reduce((sum, d) => {
    const dur = d.duration || '0 mins';
    const hours = parseInt(dur.split(' ')[0]) || 0;
    return sum + hours;
  }, 0) || 0;

  const totalActual = excelData.attendance ? 
    Object.values(excelData.attendance.shiftA).reduce((s, d) => s + d.actual, 0) +
    Object.values(excelData.attendance.shiftB).reduce((s, d) => s + d.actual, 0) : 0;
  const totalPlanned = excelData.attendance ? 
    Object.values(excelData.attendance.shiftA).reduce((s, d) => s + d.plan, 0) +
    Object.values(excelData.attendance.shiftB).reduce((s, d) => s + d.plan, 0) : 0;
  const attendanceRate = totalPlanned > 0 ? (totalActual / totalPlanned * 100).toFixed(1) : 0;

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('running')) return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Running</span>;
    if (s.includes('breakdown')) return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Breakdown</span>;
    if (s.includes('idle')) return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Idle</span>;
    if (s.includes('maintenance')) return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">Maintenance</span>;
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status || 'Unknown'}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Logo */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white p-6 rounded-b-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Logo Image */}
            <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
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
              <p className="text-blue-200 text-sm mt-1">Production Monitoring System • Real-time Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="bg-blue-800 px-4 py-2 rounded-lg text-sm">
              <ClockIcon className="h-4 w-4 inline mr-2" />
              {dateTime.toLocaleDateString()} {formatTime(dateTime)}
            </div>
            <div className="bg-blue-800 px-4 py-2 rounded-lg text-sm">
              <ArrowPathIcon className="h-3 w-3 inline mr-1 animate-spin" />
              Last Update: {formatTime(lastUpdate)}
            </div>
          </div>
        </div>
        <div className="mt-3 text-sm text-blue-200 text-center">
          Welcome back, {user?.name || user?.username || 'User'}!
        </div>
      </div>

      <div className="p-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded border-l-4 border-blue-500 p-3 shadow-sm">
            <p className="text-xs text-gray-500">Total Machines</p>
            <p className="text-2xl font-bold text-gray-800">{totalMachines}</p>
          </div>
          <div className="bg-white rounded border-l-4 border-green-500 p-3 shadow-sm">
            <p className="text-xs text-gray-500">Running</p>
            <p className="text-2xl font-bold text-green-600">{runningMachines}</p>
          </div>
          <div className="bg-white rounded border-l-4 border-red-500 p-3 shadow-sm">
            <p className="text-xs text-gray-500">Breakdown</p>
            <p className="text-2xl font-bold text-red-600">{breakdownMachines}</p>
          </div>
          <div className="bg-white rounded border-l-4 border-yellow-500 p-3 shadow-sm">
            <p className="text-xs text-gray-500">Idle</p>
            <p className="text-2xl font-bold text-yellow-600">{idleMachines}</p>
          </div>
          <div className="bg-white rounded border-l-4 border-orange-500 p-3 shadow-sm">
            <p className="text-xs text-gray-500">Maintenance</p>
            <p className="text-2xl font-bold text-orange-600">{maintenanceMachines}</p>
          </div>
          <div className="bg-white rounded border-l-4 border-purple-500 p-3 shadow-sm">
            <p className="text-xs text-gray-500">Downtime (hrs)</p>
            <p className="text-2xl font-bold text-purple-600">{totalDowntimeHours}</p>
          </div>
        </div>

        {/* Machine Status Table */}
        <div className="bg-white rounded shadow-sm mb-6 overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b">
            <h3 className="font-semibold text-gray-700">MACHINE STATUS</h3>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b">
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Plant</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Process</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Machine</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Operator</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Remarks</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {excelData.machineStatus?.length > 0 ? (
                  excelData.machineStatus.slice(0, 20).map((m, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{m.plant || 'P1'}</td>
                      <td className="px-3 py-2">{m.process}</td>
                      <td className="px-3 py-2 font-medium">{m.machine}</td>
                      <td className="px-3 py-2">{getStatusBadge(m.status)}</td>
                      <td className="px-3 py-2">{m.operator || '-'}</td>
                      <td className="px-3 py-2 text-gray-500 max-w-xs truncate">{m.remarks || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                      No machine status data. Please upload an Excel file in Production Dashboard.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Downtime Monitoring */}
          <div className="bg-white rounded shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h3 className="font-semibold text-gray-700">DOWNTIME MONITORING</h3>
            </div>
            <div className="overflow-x-auto max-h-80">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="border-b">
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Machine</th>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Duration</th>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {excelData.downtime?.length > 0 ? (
                    excelData.downtime.slice(0, 8).map((d, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-2 py-1 font-medium">{d.machine}</td>
                        <td className="px-2 py-1 text-red-600">{d.duration || '0 mins'}</td>
                        <td className="px-2 py-1 text-gray-500 truncate max-w-xs">{d.reason || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-4 py-8 text-center text-gray-400">
                        No downtime data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="bg-white rounded shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h3 className="font-semibold text-gray-700">ATTENDANCE SUMMARY</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <p className="text-xs text-gray-500">Shift A</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {excelData.attendance ? Object.values(excelData.attendance.shiftA).reduce((s, d) => s + d.actual, 0) : 0}
                  </p>
                  <p className="text-xs text-gray-400">
                    / {excelData.attendance ? Object.values(excelData.attendance.shiftA).reduce((s, d) => s + d.plan, 0) : 0}
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <p className="text-xs text-gray-500">Shift B</p>
                  <p className="text-2xl font-bold text-green-600">
                    {excelData.attendance ? Object.values(excelData.attendance.shiftB).reduce((s, d) => s + d.actual, 0) : 0}
                  </p>
                  <p className="text-xs text-gray-400">
                    / {excelData.attendance ? Object.values(excelData.attendance.shiftB).reduce((s, d) => s + d.plan, 0) : 0}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Overall Attendance Rate</p>
                <p className="text-3xl font-bold text-purple-600">{attendanceRate}%</p>
                <p className="text-xs text-gray-400">{totalActual} / {totalPlanned} present</p>
              </div>
            </div>
          </div>
        </div>

        {/* Capacity Utilization */}
        <div className="bg-white rounded shadow-sm mb-6 overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b">
            <h3 className="font-semibold text-gray-700">CAPACITY UTILIZATION</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Machine</th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Product</th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Daily Cap</th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Oct</th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Nov</th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Dec</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {excelData.capacityUtilization?.length > 0 ? (
                  excelData.capacityUtilization.slice(0, 12).map((c, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-2 py-1 font-medium">{c.machine}</td>
                      <td className="px-2 py-1 text-gray-600 max-w-xs truncate">{c.productDesc}</td>
                      <td className="px-2 py-1">{formatNumber(c.dailyCap)}</td>
                      <td className="px-2 py-1">
                        <span className={c.octUtil >= 1 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                          {formatPercentage(c.octUtil)}
                        </span>
                      </td>
                      <td className="px-2 py-1">
                        <span className={c.novUtil >= 1 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                          {formatPercentage(c.novUtil)}
                        </span>
                      </td>
                      <td className="px-2 py-1">
                        <span className={c.decUtil >= 1 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                          {formatPercentage(c.decUtil)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                      No capacity utilization data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trouble Reports */}
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div className="bg-red-50 px-4 py-2 border-b border-red-200">
            <h3 className="font-semibold text-red-700">PRODUCTION TROUBLE REPORTS</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Plant</th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Machine</th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">SKU</th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Issue</th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {excelData.troubleReports?.length > 0 ? (
                  excelData.troubleReports.map((t, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-2 py-1">{t.plant || 'P1'}</td>
                      <td className="px-2 py-1 font-medium">{t.machine}</td>
                      <td className="px-2 py-1 text-gray-600">{t.sku}</td>
                      <td className="px-2 py-1 text-gray-500 max-w-xs truncate">{t.issue}</td>
                      <td className="px-2 py-1">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          t.status?.toLowerCase().includes('running') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {t.status || 'Open'}
                        </span>
                      </td>
                      <td className="px-2 py-1">{t.target || 'TBA'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">No trouble reports found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 py-4 mt-4 border-t">
          GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • Production Monitoring System
        </div>
      </div>
    </div>
  );
};

export default Dashboard;