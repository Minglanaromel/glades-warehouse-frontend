import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

const DailyActivityReport = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchActivities();
  }, [date]);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/reports/daily-activity', {
        params: { date }
      });
      setActivities(response.data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const exportData = activities.map(activity => ({
      'Time': new Date(activity.timestamp).toLocaleTimeString(),
      'User': activity.userName,
      'Action': activity.action,
      'Module': activity.module,
      'Description': activity.description,
      'IP Address': activity.ipAddress,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Activity');
    XLSX.writeFile(wb, `daily_activity_${date}.xlsx`);
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Daily Activity Report</h1>
        <button
          onClick={exportToExcel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <DocumentArrowDownIcon className="-ml-1 mr-2 h-5 w-5" />
          Export to Excel
        </button>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field w-auto"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Total Activities</p>
          <p className="text-3xl font-semibold text-gray-900">{activities.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Sales Orders</p>
          <p className="text-3xl font-semibold text-blue-600">
            {activities.filter(a => a.module === 'Sales').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Purchase Orders</p>
          <p className="text-3xl font-semibold text-green-600">
            {activities.filter(a => a.module === 'Purchase').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Inventory Updates</p>
          <p className="text-3xl font-semibold text-purple-600">
            {activities.filter(a => a.module === 'Inventory').length}
          </p>
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Time</th>
              <th className="table-header">User</th>
              <th className="table-header">Action</th>
              <th className="table-header">Module</th>
              <th className="table-header">Description</th>
              <th className="table-header">IP Address</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td className="table-cell">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </td>
                <td className="table-cell">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {activity.userName?.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{activity.userName}</p>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      activity.action === 'CREATE'
                        ? 'bg-green-100 text-green-800'
                        : activity.action === 'UPDATE'
                        ? 'bg-blue-100 text-blue-800'
                        : activity.action === 'DELETE'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {activity.action}
                  </span>
                </td>
                <td className="table-cell">{activity.module}</td>
                <td className="table-cell">{activity.description}</td>
                <td className="table-cell text-sm text-gray-500">{activity.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyActivityReport;