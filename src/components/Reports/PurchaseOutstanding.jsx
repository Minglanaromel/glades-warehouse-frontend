import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

const PurchaseOutstanding = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOutstandingBills();
  }, []);

  const fetchOutstandingBills = async () => {
    try {
      const response = await api.get('/reports/purchase-outstanding');
      setBills(response.data);
    } catch (error) {
      console.error('Failed to fetch outstanding bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBills = bills.filter(bill => {
    if (filter === 'overdue') {
      return new Date(bill.dueDate) < new Date();
    }
    if (filter === 'due-soon') {
      const dueDate = new Date(bill.dueDate);
      const today = new Date();
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays > 0;
    }
    return true;
  });

  const totalOutstanding = filteredBills.reduce((sum, bill) => sum + bill.balance, 0);
  const overdueTotal = filteredBills
    .filter(bill => new Date(bill.dueDate) < new Date())
    .reduce((sum, bill) => sum + bill.balance, 0);

  const exportToExcel = () => {
    const exportData = filteredBills.map(bill => ({
      'Bill #': bill.billNumber,
      'Supplier': bill.supplierName,
      'Bill Date': new Date(bill.billDate).toLocaleDateString(),
      'Due Date': new Date(bill.dueDate).toLocaleDateString(),
      'Total Amount': bill.total,
      'Paid Amount': bill.paid,
      'Balance': bill.balance,
      'Status': new Date(bill.dueDate) < new Date() ? 'Overdue' : 'Outstanding',
      'Days Overdue': Math.ceil((new Date() - new Date(bill.dueDate)) / (1000 * 60 * 60 * 24)),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Purchase Outstanding');
    XLSX.writeFile(wb, 'purchase_outstanding.xlsx');
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
        <h1 className="text-2xl font-semibold text-gray-900">Purchase Outstanding</h1>
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
            <option value="all">All Outstanding</option>
            <option value="overdue">Overdue</option>
            <option value="due-soon">Due Soon (7 days)</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
          <p className="text-3xl font-semibold text-gray-900">
            ${totalOutstanding.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {filteredBills.length} bills
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Overdue Total</p>
          <p className="text-3xl font-semibold text-red-600">
            ${overdueTotal.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {filteredBills.filter(bill => new Date(bill.dueDate) < new Date()).length} bills
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Due Soon</p>
          <p className="text-3xl font-semibold text-yellow-600">
            ${filteredBills
              .filter(bill => {
                const dueDate = new Date(bill.dueDate);
                const today = new Date();
                const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                return diffDays <= 7 && diffDays > 0;
              })
              .reduce((sum, bill) => sum + bill.balance, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Bill #</th>
              <th className="table-header">Supplier</th>
              <th className="table-header">Bill Date</th>
              <th className="table-header">Due Date</th>
              <th className="table-header">Total</th>
              <th className="table-header">Paid</th>
              <th className="table-header">Balance</th>
              <th className="table-header">Status</th>
              <th className="table-header">Days</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBills.map((bill) => {
              const isOverdue = new Date(bill.dueDate) < new Date();
              const dueDate = new Date(bill.dueDate);
              const today = new Date();
              const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
              
              return (
                <tr key={bill.id}>
                  <td className="table-cell font-mono">{bill.billNumber}</td>
                  <td className="table-cell">{bill.supplierName}</td>
                  <td className="table-cell">
                    {new Date(bill.billDate).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    {new Date(bill.dueDate).toLocaleDateString()}
                  </td>
                  <td className="table-cell">${bill.total.toFixed(2)}</td>
                  <td className="table-cell">${bill.paid.toFixed(2)}</td>
                  <td className="table-cell font-medium">${bill.balance.toFixed(2)}</td>
                  <td className="table-cell">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        isOverdue
                          ? 'bg-red-100 text-red-800'
                          : daysDiff <= 7
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {isOverdue ? 'Overdue' : daysDiff <= 7 ? 'Due Soon' : 'Outstanding'}
                    </span>
                  </td>
                  <td className="table-cell">
                    {isOverdue ? Math.abs(daysDiff) : daysDiff}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOutstanding;