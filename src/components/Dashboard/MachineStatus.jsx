// components/Dashboard/MachineStatus.jsx
import React, { useState, useEffect } from 'react';
import { 
  WrenchScrewdriverIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import useExcelData from '../../hooks/useExcelData';

const MachineStatus = () => {
  const { machineStatus: excelMachines, loading, lastUpdate } = useExcelData();
  const [filter, setFilter] = useState('all');
  const [plant, setPlant] = useState('all');
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    if (excelMachines.length > 0) {
      setMachines(excelMachines);
    } else {
      // Fallback mock data
      setMachines([
        { plant: 'P1', process: 'Thermo', machine: 'KMD1', status: 'Running/Operating', operator: 'Eric Abes', remarks: 'Running', efficiency: 95 },
        { plant: 'P1', process: 'Thermo', machine: 'KMD2', status: 'Idle / Waiting', operator: 'Mary Rose Albia', remarks: 'Waiting for inspector', efficiency: 0 },
        { plant: 'P1', process: 'Thermo', machine: 'KMD3', status: 'Running/Operating', operator: 'Nancy Atienza', remarks: 'Running', efficiency: 101 },
        { plant: 'P1', process: 'Thermo', machine: 'KMD4', status: 'Running/Operating', operator: 'Roselyn Alcazaren', remarks: 'Running', efficiency: 107 },
        { plant: 'P1', process: 'Thermo', machine: 'R8', status: 'Idle / Waiting', operator: 'Rose Marie Abasula', remarks: 'No planned production', efficiency: 0 },
        { plant: 'P1', process: 'Thermo', machine: 'R14', status: 'Breakdown', operator: 'Genelyn Agon', remarks: 'Under maintenance', efficiency: 0 },
        { plant: 'P1', process: 'Printing', machine: 'Vandam1', status: 'Breakdown', operator: 'Jeanny Medalla', remarks: 'Corona Treater replacement', efficiency: 0 },
        { plant: 'P1', process: 'Printing', machine: 'Vandam2', status: 'Running/Operating', operator: 'Sharon Linga', remarks: 'Running', efficiency: 81 },
        { plant: 'P1', process: 'Printing', machine: 'Vandam3', status: 'Breakdown', operator: 'Joana Fe Andaya', remarks: 'Worn out main drive', efficiency: 0 },
        { plant: 'P1', process: 'Injection', machine: 'IM4', status: 'Running/Operating', operator: 'Rose Ann Autos', remarks: 'Running', efficiency: 89 },
        { plant: 'P1', process: 'Injection', machine: 'IM5', status: 'Running/Operating', operator: 'Charlyn De Veyra', remarks: 'Running', efficiency: 84 },
        { plant: 'P1', process: 'Injection', machine: 'IM17', status: 'Under Maintenance', operator: 'Andro Basbas', remarks: 'Worn out toggle pin', efficiency: 0 },
        { plant: 'P2', process: 'Thermo Lids', machine: 'ALF13', status: 'Running/Operating', operator: 'Charyz Borromeo', remarks: 'Running', efficiency: 96 },
        { plant: 'P2', process: 'Thermo Lids', machine: 'ALF14', status: 'Running/Operating', operator: 'Roderick Bristol', remarks: 'Running', efficiency: 100 },
        { plant: 'P2', process: 'Paper Cups', machine: 'PCM11', status: 'Breakdown', operator: 'Jerry Calaluan', remarks: 'Cam follower bearing worn out', efficiency: 0 },
        { plant: 'P2', process: 'Paper Cups', machine: 'PCM14', status: 'Idle / Waiting', operator: 'Sheryl Cañeta', remarks: 'Waiting for blanks', efficiency: 21 },
      ]);
    }
  }, [excelMachines]);

  const filteredMachines = machines.filter(m => {
    if (plant !== 'all' && m.plant !== plant) return false;
    if (filter !== 'all' && !m.status.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status) => {
    if (status.includes('Running')) return 'bg-green-100 text-green-800 border-green-200';
    if (status.includes('Idle')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (status.includes('Breakdown')) return 'bg-red-100 text-red-800 border-red-200';
    if (status.includes('Maintenance')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    if (status.includes('Running')) return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    if (status.includes('Idle')) return <ClockIcon className="h-5 w-5 text-yellow-600" />;
    if (status.includes('Breakdown')) return <XCircleIcon className="h-5 w-5 text-red-600" />;
    if (status.includes('Maintenance')) return <WrenchScrewdriverIcon className="h-5 w-5 text-purple-600" />;
    return null;
  };

  const stats = {
    total: machines.length,
    running: machines.filter(m => m.status.includes('Running')).length,
    idle: machines.filter(m => m.status.includes('Idle')).length,
    breakdown: machines.filter(m => m.status.includes('Breakdown')).length,
    maintenance: machines.filter(m => m.status.includes('Maintenance')).length,
  };

  return (
    <div className="space-y-6">
      {/* Header with GLADES branding */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-200" />
            <div>
              <h1 className="text-2xl font-bold tracking-wider">GLADES INTERNATIONAL CORPORATION</h1>
              <p className="text-blue-200 mt-1">Machine Status Monitor • Real-time Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-blue-800 px-4 py-2 rounded-lg">
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
            <span className="text-sm">Last Update: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <p className="text-sm font-medium text-gray-600">Total Machines</p>
          <p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Running</p>
              <p className="text-3xl font-semibold text-green-600">{stats.running}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Idle</p>
              <p className="text-3xl font-semibold text-yellow-600">{stats.idle}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <XCircleIcon className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Breakdown</p>
              <p className="text-3xl font-semibold text-red-600">{stats.breakdown}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-3xl font-semibold text-purple-600">{stats.maintenance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={plant}
            onChange={(e) => setPlant(e.target.value)}
            className="input-field w-48 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Plants</option>
            <option value="P1">Plant 1</option>
            <option value="P2">Plant 2</option>
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field w-48 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Running">Running</option>
            <option value="Idle">Idle</option>
            <option value="Breakdown">Breakdown</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Machines Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Machine Status Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMachines.map((machine, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      machine.plant === 'P1' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {machine.plant}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{machine.process}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{machine.machine}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(machine.status)}
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full border ${getStatusColor(machine.status)}`}>
                        {machine.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{machine.operator}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {machine.efficiency > 0 ? (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">{machine.efficiency}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              machine.efficiency >= 90 ? 'bg-green-500' : 
                              machine.efficiency >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${machine.efficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{machine.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()} • Machine Status Monitoring
        <span className="mx-2">•</span>
        <span className="text-blue-600">Plant 1</span>
        <span className="mx-2">|</span>
        <span className="text-green-600">Plant 2</span>
      </div>
    </div>
  );
};

export default MachineStatus;