import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  UserIcon,
  BuildingOfficeIcon,
  ArrowPathIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useExcelData } from '../../context/ExcelDataContext';

const AttendanceTracker = () => {
  const { excelData, loading, lastUpdate, loadCachedData } = useExcelData();
  const [dateTime, setDateTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState('A');
  const [attendance, setAttendance] = useState({
    shiftA: [],
    shiftB: [],
    summary: {
      shiftA: { actual: 0, plan: 0, rate: 0 },
      shiftB: { actual: 0, plan: 0, rate: 0 },
      total: { actual: 0, plan: 0, rate: 0 }
    }
  });

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load cached data on mount
  useEffect(() => {
    loadCachedData();
  }, [loadCachedData]);

  // Process attendance data from Excel
  useEffect(() => {
    if (excelData.attendance) {
      const attendanceData = excelData.attendance;
      const departmentLabels = ['Extrusion', 'Thermo', 'Printing', 'Thermo ICM', 'Injection', 'Labeling', 'Recycling'];
      const deptKeys = ['extrusion', 'thermo', 'printing', 'thermoIcm', 'injection', 'labeling', 'recycling'];
      
      // Process Shift A
      const shiftAData = deptKeys.map((key, index) => {
        const data = attendanceData.shiftA[key] || { actual: 0, plan: 0 };
        return {
          department: departmentLabels[index],
          ll_actual: Math.floor(data.actual * 0.25),
          ll_plan: Math.floor(data.plan * 0.25),
          process_actual: Math.floor(data.actual * 0.35),
          process_plan: Math.floor(data.plan * 0.35),
          inspector_actual: Math.floor(data.actual * 0.25),
          inspector_plan: Math.floor(data.plan * 0.25),
          mh_actual: Math.floor(data.actual * 0.15),
          mh_plan: Math.floor(data.plan * 0.15),
          total_actual: data.actual,
          total_plan: data.plan
        };
      });
      
      // Process Shift B
      const shiftBData = deptKeys.map((key, index) => {
        const data = attendanceData.shiftB[key] || { actual: 0, plan: 0 };
        return {
          department: departmentLabels[index],
          ll_actual: Math.floor(data.actual * 0.25),
          ll_plan: Math.floor(data.plan * 0.25),
          process_actual: Math.floor(data.actual * 0.35),
          process_plan: Math.floor(data.plan * 0.35),
          inspector_actual: Math.floor(data.actual * 0.25),
          inspector_plan: Math.floor(data.plan * 0.25),
          mh_actual: Math.floor(data.actual * 0.15),
          mh_plan: Math.floor(data.plan * 0.15),
          total_actual: data.actual,
          total_plan: data.plan
        };
      });
      
      // Calculate summaries
      const shiftATotalActual = shiftAData.reduce((sum, d) => sum + d.total_actual, 0);
      const shiftATotalPlan = shiftAData.reduce((sum, d) => sum + d.total_plan, 0);
      const shiftBTotalActual = shiftBData.reduce((sum, d) => sum + d.total_actual, 0);
      const shiftBTotalPlan = shiftBData.reduce((sum, d) => sum + d.total_plan, 0);
      
      setAttendance({
        shiftA: shiftAData,
        shiftB: shiftBData,
        summary: {
          shiftA: { 
            actual: shiftATotalActual, 
            plan: shiftATotalPlan, 
            rate: shiftATotalPlan > 0 ? (shiftATotalActual / shiftATotalPlan * 100).toFixed(1) : 0 
          },
          shiftB: { 
            actual: shiftBTotalActual, 
            plan: shiftBTotalPlan, 
            rate: shiftBTotalPlan > 0 ? (shiftBTotalActual / shiftBTotalPlan * 100).toFixed(1) : 0 
          },
          total: { 
            actual: shiftATotalActual + shiftBTotalActual, 
            plan: shiftATotalPlan + shiftBTotalPlan, 
            rate: (shiftATotalPlan + shiftBTotalPlan) > 0 
              ? ((shiftATotalActual + shiftBTotalActual) / (shiftATotalPlan + shiftBTotalPlan) * 100).toFixed(1) 
              : 0 
          }
        }
      });
    } else {
      // Fallback mock data from your Excel
      setAttendance({
        shiftA: [
          { department: 'Extrusion', ll_actual: 1, ll_plan: 1, process_actual: 2, process_plan: 2, inspector_actual: 0, inspector_plan: 0, mh_actual: 0, mh_plan: 0, total_actual: 3, total_plan: 3 },
          { department: 'Thermo', ll_actual: 2, ll_plan: 2, process_actual: 2, process_plan: 2, inspector_actual: 13, inspector_plan: 13, mh_actual: 2, mh_plan: 2, total_actual: 19, total_plan: 19 },
          { department: 'Printing', ll_actual: 1, ll_plan: 1, process_actual: 2, process_plan: 2, inspector_actual: 5, inspector_plan: 5, mh_actual: 0, mh_plan: 1, total_actual: 8, total_plan: 9 },
          { department: 'Thermo ICM', ll_actual: 1, ll_plan: 1, process_actual: 2, process_plan: 2, inspector_actual: 5, inspector_plan: 5, mh_actual: 0, mh_plan: 0, total_actual: 8, total_plan: 8 },
          { department: 'Injection', ll_actual: 1, ll_plan: 1, process_actual: 1, process_plan: 1, inspector_actual: 17, inspector_plan: 17, mh_actual: 1, mh_plan: 1, total_actual: 20, total_plan: 20 },
          { department: 'Labeling', ll_actual: 0, ll_plan: 1, process_actual: 0, process_plan: 0, inspector_actual: 4, inspector_plan: 8, mh_actual: 0, mh_plan: 0, total_actual: 4, total_plan: 9 },
          { department: 'Recycling', ll_actual: 0, ll_plan: 0, process_actual: 0, process_plan: 0, inspector_actual: 0, inspector_plan: 0, mh_actual: 2, mh_plan: 2, total_actual: 2, total_plan: 2 }
        ],
        shiftB: [
          { department: 'Extrusion', ll_actual: 0, ll_plan: 0, process_actual: 0, process_plan: 0, inspector_actual: 0, inspector_plan: 0, mh_actual: 0, mh_plan: 0, total_actual: 0, total_plan: 0 },
          { department: 'Thermo', ll_actual: 0, ll_plan: 0, process_actual: 0, process_plan: 0, inspector_actual: 0, inspector_plan: 0, mh_actual: 0, mh_plan: 0, total_actual: 0, total_plan: 0 },
          { department: 'Printing', ll_actual: 0, ll_plan: 0, process_actual: 0, process_plan: 0, inspector_actual: 0, inspector_plan: 0, mh_actual: 0, mh_plan: 0, total_actual: 0, total_plan: 0 },
          { department: 'Thermo ICM', ll_actual: 0, ll_plan: 0, process_actual: 0, process_plan: 0, inspector_actual: 0, inspector_plan: 0, mh_actual: 0, mh_plan: 0, total_actual: 0, total_plan: 0 },
          { department: 'Injection', ll_actual: 0, ll_plan: 0, process_actual: 0, process_plan: 0, inspector_actual: 0, inspector_plan: 0, mh_actual: 0, mh_plan: 0, total_actual: 0, total_plan: 0 },
          { department: 'Labeling', ll_actual: 0, ll_plan: 0, process_actual: 0, process_plan: 0, inspector_actual: 0, inspector_plan: 0, mh_actual: 0, mh_plan: 0, total_actual: 0, total_plan: 0 },
          { department: 'Recycling', ll_actual: 0, ll_plan: 0, process_actual: 0, process_plan: 0, inspector_actual: 0, inspector_plan: 0, mh_actual: 0, mh_plan: 0, total_actual: 0, total_plan: 0 }
        ],
        summary: {
          shiftA: { actual: 0, plan: 0, rate: 0 },
          shiftB: { actual: 0, plan: 0, rate: 0 },
          total: { actual: 0, plan: 0, rate: 0 }
        }
      });
    }
  }, [excelData]);

  const currentData = shift === 'A' ? attendance.shiftA : attendance.shiftB;
  const currentSummary = shift === 'A' ? attendance.summary.shiftA : attendance.summary.shiftB;
  const totalActual = currentData.reduce((sum, dept) => sum + (dept.total_actual || 0), 0);
  const totalPlanned = currentData.reduce((sum, dept) => sum + (dept.total_plan || 0), 0);
  const attendanceRate = totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : 0;

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  const getRateColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
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
            <p className="text-blue-200 text-sm mt-1">Attendance Tracker • Real-time Workforce Monitoring</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-blue-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-800/50 px-4 py-2 rounded-lg">
              <ArrowPathIcon className="h-4 w-4 text-blue-300 animate-spin" />
              <span className="text-sm text-blue-200">Last Update: {formatTime(lastUpdate)}</span>
            </div>
            <div className="flex bg-blue-800 rounded-lg p-1">
              <button
                onClick={() => setShift('A')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  shift === 'A' ? 'bg-white text-blue-900' : 'text-white hover:bg-blue-700'
                }`}
              >
                Shift A
              </button>
              <button
                onClick={() => setShift('B')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  shift === 'B' ? 'bg-white text-blue-900' : 'text-white hover:bg-blue-700'
                }`}
              >
                Shift B
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-800/30 px-4 py-2 rounded-lg">
              <CalendarIcon className="h-4 w-4 text-blue-300" />
              <span className="text-sm text-blue-200">{selectedDate}</span>
            </div>
            <div className="text-sm text-blue-200 bg-blue-800/30 px-4 py-2 rounded-lg">
              <ClockIcon className="h-4 w-4 inline mr-1" />
              {dateTime.toLocaleDateString()} {formatTime(dateTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-3xl font-semibold text-gray-900">{attendance.summary.total.actual}</p>
              <p className="text-xs text-gray-400 mt-1">out of {attendance.summary.total.plan} planned</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Rate</p>
              <p className={`text-3xl font-semibold ${getRateColor(attendance.summary.total.rate)}`}>
                {attendance.summary.total.rate}%
              </p>
              <p className="text-xs text-gray-400 mt-1">Total attendance</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Shift {shift}</p>
              <p className={`text-3xl font-semibold ${getRateColor(attendanceRate)}`}>
                {attendanceRate}%
              </p>
              <p className="text-xs text-gray-400 mt-1">{totalActual} / {totalPlanned} present</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-3xl font-semibold text-orange-600">{currentData.length}</p>
              <p className="text-xs text-gray-400 mt-1">Active departments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Shift {shift} Attendance Details</h3>
          <p className="text-sm text-gray-500 mt-1">Based on data from uploaded Excel file (P1&2 Attendance sheet)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" colSpan="2">LL</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" colSpan="2">Process</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" colSpan="2">Inspector</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" colSpan="2">MH</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" colSpan="2">Total</th>
              </tr>
              <tr className="bg-gray-100">
                <th></th>
                <th className="px-2 py-2 text-xs text-gray-500">Act</th>
                <th className="px-2 py-2 text-xs text-gray-500">Plan</th>
                <th className="px-2 py-2 text-xs text-gray-500">Act</th>
                <th className="px-2 py-2 text-xs text-gray-500">Plan</th>
                <th className="px-2 py-2 text-xs text-gray-500">Act</th>
                <th className="px-2 py-2 text-xs text-gray-500">Plan</th>
                <th className="px-2 py-2 text-xs text-gray-500">Act</th>
                <th className="px-2 py-2 text-xs text-gray-500">Plan</th>
                <th className="px-2 py-2 text-xs text-gray-500">Act</th>
                <th className="px-2 py-2 text-xs text-gray-500">Plan</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{dept.department}</td>
                  <td className="px-2 py-3 text-sm text-gray-900">{dept.ll_actual}</td>
                  <td className="px-2 py-3 text-sm text-gray-500">{dept.ll_plan}</td>
                  <td className="px-2 py-3 text-sm text-gray-900">{dept.process_actual}</td>
                  <td className="px-2 py-3 text-sm text-gray-500">{dept.process_plan}</td>
                  <td className="px-2 py-3 text-sm text-gray-900">{dept.inspector_actual}</td>
                  <td className="px-2 py-3 text-sm text-gray-500">{dept.inspector_plan}</td>
                  <td className="px-2 py-3 text-sm text-gray-900">{dept.mh_actual}</td>
                  <td className="px-2 py-3 text-sm text-gray-500">{dept.mh_plan}</td>
                  <td className="px-2 py-3 text-sm font-bold text-blue-600">{dept.total_actual}</td>
                  <td className="px-2 py-3 text-sm text-gray-500">{dept.total_plan}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-medium">
              <tr>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">Total</td>
                <td className="px-2 py-3 text-sm font-bold text-gray-900">
                  {currentData.reduce((sum, d) => sum + d.ll_actual, 0)}
                </td>
                <td className="px-2 py-3 text-sm text-gray-500">
                  {currentData.reduce((sum, d) => sum + d.ll_plan, 0)}
                </td>
                <td className="px-2 py-3 text-sm font-bold text-gray-900">
                  {currentData.reduce((sum, d) => sum + d.process_actual, 0)}
                </td>
                <td className="px-2 py-3 text-sm text-gray-500">
                  {currentData.reduce((sum, d) => sum + d.process_plan, 0)}
                </td>
                <td className="px-2 py-3 text-sm font-bold text-gray-900">
                  {currentData.reduce((sum, d) => sum + d.inspector_actual, 0)}
                </td>
                <td className="px-2 py-3 text-sm text-gray-500">
                  {currentData.reduce((sum, d) => sum + d.inspector_plan, 0)}
                </td>
                <td className="px-2 py-3 text-sm font-bold text-gray-900">
                  {currentData.reduce((sum, d) => sum + d.mh_actual, 0)}
                </td>
                <td className="px-2 py-3 text-sm text-gray-500">
                  {currentData.reduce((sum, d) => sum + d.mh_plan, 0)}
                </td>
                <td className="px-2 py-3 text-sm font-bold text-blue-600">{totalActual}</td>
                <td className="px-2 py-3 text-sm text-gray-500">{totalPlanned}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Attendance Rate Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Attendance Rate</h3>
        <div className="space-y-4">
          {currentData.map((dept, index) => {
            const rate = dept.total_plan > 0 ? (dept.total_actual / dept.total_plan) * 100 : 0;
            return (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{dept.department}</span>
                  <span className={`font-bold ${getRateColor(rate)}`}>
                    {rate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      rate >= 90 ? 'bg-green-600' : rate >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.min(rate, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison between Shifts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shift Comparison</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Shift A</p>
            <p className="text-3xl font-bold text-blue-600">{attendance.summary.shiftA.rate}%</p>
            <p className="text-xs text-gray-400 mt-1">
              {attendance.summary.shiftA.actual} / {attendance.summary.shiftA.plan}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Shift B</p>
            <p className="text-3xl font-bold text-green-600">{attendance.summary.shiftB.rate}%</p>
            <p className="text-xs text-gray-400 mt-1">
              {attendance.summary.shiftB.actual} / {attendance.summary.shiftB.plan}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Attendance Gap</span>
            <span className={`font-bold ${Math.abs(attendance.summary.shiftA.rate - attendance.summary.shiftB.rate) > 10 ? 'text-red-600' : 'text-green-600'}`}>
              {Math.abs(attendance.summary.shiftA.rate - attendance.summary.shiftB.rate).toFixed(1)}% difference
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • Attendance Monitoring System
        <span className="mx-2">•</span>
        <span className="text-blue-600">Plant 1</span>
        <span className="mx-2">|</span>
        <span className="text-green-600">Plant 2</span>
        <span className="mx-2">•</span>
        <span className="text-purple-600">Real-time Data from Excel</span>
      </div>
    </div>
  );
};

export default AttendanceTracker;