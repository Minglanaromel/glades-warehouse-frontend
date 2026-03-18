import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

const SalesOutstanding = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOutstandingInvoices();
  }, []);

  const fetchOutstandingInvoices = async () => {
    try {
      const response = await api.get('/reports/sales-outstanding');
      setInvoices(response.data);
    } catch (error) {
      console.error('Failed to fetch outstanding invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filter === 'overdue') {
      return new Date(invoice.dueDate) < new Date();
    }
    if (filter === 'due-soon') {
      const dueDate = new Date(invoice.dueDate);
      const today = new Date();
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays > 0;
    }
    return true;
  });

  const totalOutstanding = filteredInvoices.reduce((sum, inv) => sum + inv.balance, 0);
  const overdueTotal = filteredInvoices
    .filter(inv => new Date(inv.dueDate) < new Date())
    .reduce((sum, inv) => sum + inv.balance, 0);

  const exportToExcel = () => {
    const exportData = filteredInvoices.map(invoice => ({
      'Invoice #': invoice.invoiceNumber,
      'Customer': invoice.customerName,
      'Invoice Date': new Date(invoice.invoiceDate).toLocaleDateString(),
      'Due Date': new Date(invoice.dueDate).toLocaleDateString(),
      'Total Amount': invoice.total,
      'Paid Amount': invoice.paid,
      'Balance': invoice.balance,
      'Status': new Date(invoice.dueDate) < new Date() ? 'Overdue' : 'Outstanding',
      'Days Overdue': Math.ceil((new Date() - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24)),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Outstanding');
    XLSX.writeFile(wb, 'sales_outstanding.xlsx');
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
        <h1 className="text-2xl font-semibold text-gray-900">Sales Outstanding</h1>
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
            {filteredInvoices.length} invoices
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Overdue Total</p>
          <p className="text-3xl font-semibold text-red-600">
            ${overdueTotal.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {filteredInvoices.filter(inv => new Date(inv.dueDate) < new Date()).length} invoices
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Due Soon</p>
          <p className="text-3xl font-semibold text-yellow-600">
            ${filteredInvoices
              .filter(inv => {
                const dueDate = new Date(inv.dueDate);
                const today = new Date();
                const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                return diffDays <= 7 && diffDays > 0;
              })
              .reduce((sum, inv) => sum + inv.balance, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Invoice #</th>
              <th className="table-header">Customer</th>
              <th className="table-header">Invoice Date</th>
              <th className="table-header">Due Date</th>
              <th className="table-header">Total</th>
              <th className="table-header">Paid</th>
              <th className="table-header">Balance</th>
              <th className="table-header">Status</th>
              <th className="table-header">Days</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => {
              const isOverdue = new Date(invoice.dueDate) < new Date();
              const dueDate = new Date(invoice.dueDate);
              const today = new Date();
              const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
              
              return (
                <tr key={invoice.id}>
                  <td className="table-cell font-mono">{invoice.invoiceNumber}</td>
                  <td className="table-cell">{invoice.customerName}</td>
                  <td className="table-cell">
                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="table-cell">${invoice.total.toFixed(2)}</td>
                  <td className="table-cell">${invoice.paid.toFixed(2)}</td>
                  <td className="table-cell font-medium">${invoice.balance.toFixed(2)}</td>
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

export default SalesOutstanding;