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
// REMOVE or COMMENT OUT this line:
// import gladesLogo from '../../assets/images/glades-logo.png';

const AttendanceTracker = () => {
  const { attendanceData, loading, lastUpdate } = useExcelData();
  const [dateTime, setDateTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState('A');
  const [attendance, setAttendance] = useState({ shiftA: [], shiftB: [] });
  // REMOVE logoError state

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (attendanceData.length > 0) {
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
      {/* Header with GLADES branding - USING ICON */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          {/* Icon as logo fallback */}
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

      {/* Rest of your component remains the same... */}
      {/* ... */}
    </div>
  );
};

export default AttendanceTracker;