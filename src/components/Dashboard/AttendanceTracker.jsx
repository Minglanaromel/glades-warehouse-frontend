import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  UserIcon,
  BuildingOfficeIcon,
  ArrowPathIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import useExcelData from '../../hooks/useExcelData';

const AttendanceTracker = () => {
  const { attendanceData, loading, lastUpdate } = useExcelData();
  const [dateTime, setDateTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState('A');
  const [attendance, setAttendance] = useState({ shiftA: [], shiftB: [] });

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (attendanceData && attendanceData.length > 0) {
      // Process attendance data from Excel (P1&2 Attendance sheet)
      const shiftAData = [];
      const shiftBData = [];
      
      // Extract shift A data from rows 6-9 (LL, Process, Inspector, MH)
      const departments = ['Extrusion', 'Thermo', 'Printing', 'Thermo ICM', 'Injection', 'Labeling', 'Recycling'];
      
      // Shift A - Row 6 (LL), Row 7 (Process), Row 8 (Inspector), Row 9 (MH)
      departments.forEach((dept, index) => {
        // Column mapping: G=Extrusion, K=Thermo, O=Printing, S=Thermo ICM, W=Injection, AA=Labeling, AE=Recycling
        const colMap = ['G', 'K', 'O', 'S', 'W', 'AA', 'AE'];
        
        shiftAData.push({
          department: dept,
          ll_actual: attendanceData[5]?.[colMap[index]] || 0,
          ll_plan: attendanceData[5]?.[colMap[index]+'1'] || 0,
          process_actual: attendanceData[6]?.[colMap[index]] || 0,
          process_plan: attendanceData[6]?.[colMap[index]+'1'] || 0,
          inspector_actual: attendanceData[7]?.[colMap[index]] || 0,
          inspector_plan: attendanceData[7]?.[colMap[index]+'1'] || 0,
          mh_actual: attendanceData[8]?.[colMap[index]] || 0,
          mh_plan: attendanceData[8]?.[colMap[index]+'1'] || 0,
          total_actual: (attendanceData[5]?.[colMap[index]] || 0) + 
                        (attendanceData[6]?.[colMap[index]] || 0) + 
                        (attendanceData[7]?.[colMap[index]] || 0) + 
                        (attendanceData[8]?.[colMap[index]] || 0),
          total_plan: (attendanceData[5]?.[colMap[index]+'1'] || 0) + 
                      (attendanceData[6]?.[colMap[index]+'1'] || 0) + 
                      (attendanceData[7]?.[colMap[index]+'1'] || 0) + 
                      (attendanceData[8]?.[colMap[index]+'1'] || 0)
        });
      });

      // Shift B data from rows 20-23
      departments.forEach((dept, index) => {
        const colMap = ['G', 'K', 'O', 'S', 'W', 'AA', 'AE'];
        
        shiftBData.push({
          department: dept,
          ll_actual: attendanceData[19]?.[colMap[index]] || 0,
          ll_plan: attendanceData[19]?.[colMap[index]+'1'] || 0,
          process_actual: attendanceData[20]?.[colMap[index]] || 0,
          process_plan: attendanceData[20]?.[colMap[index]+'1'] || 0,
          inspector_actual: attendanceData[21]?.[colMap[index]] || 0,
          inspector_plan: attendanceData[21]?.[colMap[index]+'1'] || 0,
          mh_actual: attendanceData[22]?.[colMap[index]] || 0,
          mh_plan: attendanceData[22]?.[colMap[index]+'1'] || 0,
          total_actual: (attendanceData[19]?.[colMap[index]] || 0) + 
                        (attendanceData[20]?.[colMap[index]] || 0) + 
                        (attendanceData[21]?.[colMap[index]] || 0) + 
                        (attendanceData[22]?.[colMap[index]] || 0),
          total_plan: (attendanceData[19]?.[colMap[index]+'1'] || 0) + 
                      (attendanceData[20]?.[colMap[index]+'1'] || 0) + 
                      (attendanceData[21]?.[colMap[index]+'1'] || 0) + 
                      (attendanceData[22]?.[colMap[index]+'1'] || 0)
        });
      });

      setAttendance({ shiftA: shiftAData, shiftB: shiftBData });
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
        ]
      });
    }
  }, [attendanceData]);

  const currentData = shift === 'A' ? attendance.shiftA : attendance.shiftB;
  const totalActual = currentData.reduce((sum, dept) => sum + (dept.total_actual || 0), 0);
  const totalPlanned = currentData.reduce((sum, dept) => sum + (dept.total_plan || 0), 0);
  const attendanceRate = totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : 0;

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
              <span className="text-sm text-blue-200">Last Update: {lastUpdate.toLocaleTimeString()}</span>
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
              {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Total Present</p>
          <p className="text-3xl font-semibold text-gray-900">{totalActual}</p>
          <p className="text-xs text-gray-400 mt-1">out of {totalPlanned} planned</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
          <p className="text-3xl font-semibold text-green-600">{attendanceRate}%</p>
          <p className="text-xs text-gray-400 mt-1">{shift} Shift</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Departments</p>
          <p className="text-3xl font-semibold text-blue-600">{currentData.length}</p>
          <p className="text-xs text-gray-400 mt-1">Active departments</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Shift {shift} Attendance Details</h3>
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

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • Attendance Monitoring System
        <span className="mx-2">•</span>
        <span className="text-blue-600">Plant 1</span>
        <span className="mx-2">|</span>
        <span className="text-green-600">Plant 2</span>
      </div>
    </div>
  );
};

export default AttendanceTracker;