import React, { useState, useEffect } from 'react';
import customerService from '../../services/customerService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerService.getCustomers(page, searchTerm);
      setCustomers(data.customers);
      setTotalPages(data.pages);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        fetchCustomers(); // Refresh list
      } catch (error) {
        // Error is already handled in service
      }
    }
  };

  const handleImport = async (file) => {
    try {
      await customerService.importCustomers(file);
      fetchCustomers(); // Refresh list
    } catch (error) {
      // Error is already handled in service
    }
  };

  const handleExport = async () => {
    try {
      await customerService.exportCustomers();
    } catch (error) {
      // Error is already handled in service
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  if (loading && !customers.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="space-x-2">
          <button
            onClick={handleExport}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export
          </button>
          <button
            onClick={() => window.location.href = '/customers/new'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Customer
          </button>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, code, or email..."
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Search
          </button>
        </div>
      </form>

      {/* Customers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td className="px-4 py-2 border">{customer.code}</td>
                <td className="px-4 py-2 border">{customer.name}</td>
                <td className="px-4 py-2 border">{customer.email}</td>
                <td className="px-4 py-2 border">{customer.phone}</td>
                <td className="px-4 py-2 border">
                  <span className={`px-2 py-1 rounded text-xs ${
                    customer.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => window.location.href = `/customers/edit/${customer._id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerList;