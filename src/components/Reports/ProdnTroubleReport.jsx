// components/Reports/ProdnTroubleReport.jsx
import React, { useState } from 'react';
import {
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

const ProdnTroubleReport = () => {
  const [filter, setFilter] = useState('all');

  const troubleReports = [
    {
      plant: 'P1',
      machine: 'KMD',
      sku: '1oz Lid',
      dateStarted: 'Oct 29',
      issue: 'Dull cutting plug and plate, wear and tear',
      actions: 'Run with 30% rejection-for rework/sorting. Replace worn-out cutting plug and Plate. PR#100641',
      status: 'Running with 30% rejection',
      target: 'TBA',
    },
    {
      plant: 'P1',
      machine: '70K',
      sku: 'ANZ large, JFC Float, 3oz Cup',
      dateStarted: 'Oct 18',
      issue: 'Chiller for rehab',
      actions: 'Ongoing repair',
      status: 'Running max 1 machine only',
      target: 'Nov 25',
    },
    {
      plant: 'P1',
      machine: 'VANDAM 6',
      sku: 'SBUX Spring',
      dateStarted: 'Nov 17',
      issue: 'Damaged Idler roller',
      actions: 'For Fabrication of idler roller',
      status: 'Not running',
      target: 'Dec 05',
    },
    {
      plant: 'P1',
      machine: 'IM17',
      sku: 'Fork',
      dateStarted: 'Nov 08',
      issue: 'Wornout toggle pin and linear bearing',
      actions: 'Transfer CPU board from IM17 to IM14',
      status: 'Not running',
      target: 'Dec 15',
    },
    {
      plant: 'P2',
      machine: 'PCM11',
      sku: '16oz SDD paper',
      dateStarted: 'Nov 24',
      issue: 'Cam follower bearing worn out',
      actions: 'Parts need replacement, OEM 2,166 EUR',
      status: 'Not running',
      target: 'Dec 01',
    },
  ];

  const filteredReports = filter === 'all' 
    ? troubleReports 
    : troubleReports.filter(r => r.plant === filter);

  const getStatusColor = (status) => {
    if (status.includes('Running')) return 'bg-green-100 text-green-800';
    if (status.includes('Not running')) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const stats = {
    total: troubleReports.length,
    active: troubleReports.filter(r => r.status.includes('Running')).length,
    critical: troubleReports.filter(r => r.status === 'Not running').length,
    resolved: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header with GLADES branding */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <BuildingOfficeIcon className="h-8 w-8 text-red-200" />
            <div>
              <h1 className="text-2xl font-bold tracking-wider">GLADES INTERNATIONAL CORPORATION</h1>
              <p className="text-red-200 mt-1">Production Trouble Reports • Issue Tracking</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-red-800 text-white border border-red-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="all">All Plants</option>
              <option value="P1">Plant 1</option>
              <option value="P2">Plant 2</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <p className="text-sm font-medium text-gray-600">Total Reports</p>
          <p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-sm font-medium text-gray-600">Active Issues</p>
          <p className="text-3xl font-semibold text-yellow-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-sm font-medium text-gray-600">Critical</p>
          <p className="text-3xl font-semibold text-red-600">{stats.critical}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-600">Resolved</p>
          <p className="text-3xl font-semibold text-green-600">{stats.resolved}</p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            Active Trouble Reports
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU Affected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      report.plant === 'P1' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {report.plant}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.machine}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.dateStarted}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    {report.issue}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    {report.actions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.target}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • Production Trouble Reports
        <span className="mx-2">•</span>
        <span className="text-blue-600">Plant 1</span>
        <span className="mx-2">|</span>
        <span className="text-green-600">Plant 2</span>
      </div>
    </div>
  );
};

export default ProdnTroubleReport;