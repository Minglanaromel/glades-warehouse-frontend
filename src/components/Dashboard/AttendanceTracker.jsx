// components/Dashboard/AttendanceTracker.jsx
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState('A');
  const [attendance, setAttendance] = useState({ shiftA: [], shiftB: [] });

  useEffect(() => {
    if (attendanceData.length > 0) {
      // Process attendance data from Excel
      const shiftA = attendanceData.filter(a => a.shift === 'A');
      const shiftB = attendanceData.filter(a => a.shift === 'B');
      setAttendance({ shiftA, shiftB });
    } else {
      // Fallback mock data
      setAttendance({
        shiftA: [
          { department: 'Extrusion', planned: 2, actual: 2, ll: 1, process: 1, inspector: 0, mh: 0 },
          { department: 'Thermo', planned: 15, actual: 15, ll: 2, process: 2, inspector: 13, mh: 2 },
          { department: 'Printing', planned: 8, actual: 7, ll: 1, process: 2, inspector: 5, mh: 0 },
          { department: 'Thermo ICM', planned: 8, actual: 8, ll: 1, process: 2, inspector: 5, mh: 0 },
          { department: 'Injection', planned: 19, actual: 19, ll: 1, process: 1, inspector: 17, mh: 1 },
          { department: 'Labeling', planned: 9, actual: 4, ll: 0, process: 0, inspector: 4, mh: 0 },
        ],
        shiftB: [
          { department: 'Extrusion', planned: 0, actual: 0, ll: 0, process: 0, inspector: 0, mh: 0 },
          { department: 'Thermo', planned: 0, actual: 0, ll: 0, process: 0, inspector: 0, mh: 0 },
          { department: 'Printing', planned: 0, actual: 0, ll: 0, process: 0, inspector: 0, mh: 0 },
          { department: 'Thermo ICM', planned: 0, actual: 0, ll: 0, process: 0, inspector: 0, mh: 0 },
          { department: 'Injection', planned: 0, actual: 0, ll: 0, process: 0, inspector: 0, mh: 0 },
          { department: 'Labeling', planned: 0, actual: 0, ll: 0, process: 0, inspector: 0, mh: 0 },
        ],
      });
    }
  }, [attendanceData]);

  const currentData = shift === 'A' ? attendance.shiftA : attendance.shiftB;
  const totalPlanned = currentData.reduce((sum, dept) => sum + (dept.planned || 0), 0);
  const totalActual = currentData.reduce((sum, dept) => sum + (dept.actual || 0), 0);
  const attendanceRate = totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header with GLADES branding */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-200" />
            <div>
              <h1 className="text-2xl font-bold tracking-wider">GLADES INTERNATIONAL CORPORATION</h1>
              <p className="text-blue-200 mt-1">Attendance Tracker • Real-time Workforce Monitoring</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-800 px-4 py-2 rounded-lg">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">{selectedDate}</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-800 px-4 py-2 rounded-lg">
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              <span className="text-sm">Last Update: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setShift('A')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  shift === 'A' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Shift A
              </button>
              <button
                onClick={() => setShift('B')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  shift === 'B' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Shift B
              </button>
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
              <p className="text-sm font-medium text-gray-600">Total Planned</p>
              <p className="text-3xl font-semibold text-gray-900">{totalPlanned}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Present</p>
              <p className="text-3xl font-semibold text-green-600">{totalActual}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
          <p className="text-3xl font-semibold text-purple-600">{attendanceRate}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-sm font-medium text-gray-600">Absences</p>
          <p className="text-3xl font-semibold text-red-600">{totalPlanned - totalActual}</p>
        </div>
      </div>

      {/* Department Attendance */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Department Attendance - Shift {shift}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Planned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">LL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Process</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inspector</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">MH</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dept.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.planned}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      dept.actual === dept.planned ? 'text-green-600' : 
                      dept.actual > 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {dept.actual}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.ll}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.process}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.inspector}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.mh}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2">
                        {dept.planned > 0 ? ((dept.actual / dept.planned) * 100).toFixed(0) : 0}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            dept.actual === dept.planned ? 'bg-green-500' :
                            dept.actual > 0 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: dept.planned > 0 ? `${(dept.actual / dept.planned) * 100}%` : '0%' }}
                        ></div>
                      </div>
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
        GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • Attendance Tracking System
        <span className="mx-2">•</span>
        <span className="text-blue-600">Shift A</span>
        <span className="mx-2">|</span>
        <span className="text-green-600">Shift B</span>
      </div>
    </div>
  );
};

export default AttendanceTracker;