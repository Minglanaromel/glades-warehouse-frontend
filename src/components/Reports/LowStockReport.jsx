import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

const LowStockReport = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLowStockItems();
  }, []);

  const fetchLowStockItems = async () => {
    try {
      const response = await api.get('/reports/low-stock');
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch low stock items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'critical') {
      return item.currentStock <= (item.minStock * 0.5);
    }
    if (filter === 'warning') {
      return item.currentStock > (item.minStock * 0.5) && item.currentStock <= item.minStock;
    }
    return true;
  });

  const exportToExcel = () => {
    const exportData = filteredItems.map(item => ({
      'SKU': item.sku,
      'Name': item.name,
      'Category': item.category,
      'Current Stock': item.currentStock,
      'Minimum Stock': item.minStock,
      'Status': item.currentStock <= (item.minStock * 0.5) ? 'Critical' : 'Warning',
      'Location': item.location,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Low Stock Report');
    XLSX.writeFile(wb, 'low_stock_report.xlsx');
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
        <h1 className="text-2xl font-semibold text-gray-900">Low Stock Report</h1>
        <button
          onClick={exportToExcel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <DocumentArrowDownIcon className="-ml-1 mr-2 h-5 w-5" />
          Export to Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="all">All Low Stock</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Total Low Stock Items</p>
          <p className="text-3xl font-semibold text-gray-900">{items.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Critical</p>
          <p className="text-3xl font-semibold text-red-600">
            {items.filter(i => i.currentStock <= (i.minStock * 0.5)).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Warning</p>
          <p className="text-3xl font-semibold text-yellow-600">
            {items.filter(i => i.currentStock > (i.minStock * 0.5) && i.currentStock <= i.minStock).length}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">SKU</th>
              <th className="table-header">Item Name</th>
              <th className="table-header">Category</th>
              <th className="table-header">Current Stock</th>
              <th className="table-header">Min Stock</th>
              <th className="table-header">Status</th>
              <th className="table-header">Location</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td className="table-cell font-mono">{item.sku}</td>
                <td className="table-cell">
                  <div className="font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="table-cell">{item.category}</td>
                <td className="table-cell font-medium">{item.currentStock}</td>
                <td className="table-cell">{item.minStock}</td>
                <td className="table-cell">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.currentStock <= (item.minStock * 0.5)
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {item.currentStock <= (item.minStock * 0.5) ? 'Critical' : 'Warning'}
                  </span>
                </td>
                <td className="table-cell">{item.location || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockReport;