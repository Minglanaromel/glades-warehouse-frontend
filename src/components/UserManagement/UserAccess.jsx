import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UserAccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({
    dashboard: {
      view: false,
    },
    stockItems: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      import: false,
    },
    customers: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      import: false,
    },
    suppliers: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      import: false,
    },
    purchaseOrders: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      approve: false,
    },
    salesOrders: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      approve: false,
    },
    reports: {
      view: false,
      export: false,
    },
    users: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      access: false,
    },
  });

  useEffect(() => {
    fetchUserPermissions();
  }, [id]);

  const fetchUserPermissions = async () => {
    try {
      const response = await api.get(`/users/${id}/permissions`);
      setUser(response.data.user);
      setPermissions(response.data.permissions);
    } catch (error) {
      toast.error('Failed to fetch user permissions');
      navigate('/users');
    }
  };

  const handlePermissionChange = (module, action) => {
    setPermissions({
      ...permissions,
      [module]: {
        ...permissions[module],
        [action]: !permissions[module][action],
      },
    });
  };

  const handleModuleAllChange = (module, checked) => {
    const modulePermissions = permissions[module];
    const updatedModule = {};
    
    Object.keys(modulePermissions).forEach(key => {
      updatedModule[key] = checked;
    });

    setPermissions({
      ...permissions,
      [module]: updatedModule,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/users/${id}/permissions`, { permissions });
      toast.success('Permissions updated successfully');
      navigate('/users');
    } catch (error) {
      toast.error('Failed to update permissions');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const modules = [
    { key: 'dashboard', name: 'Dashboard', actions: ['view'] },
    { key: 'stockItems', name: 'Stock Items', actions: ['view', 'create', 'edit', 'delete', 'import'] },
    { key: 'customers', name: 'Customers', actions: ['view', 'create', 'edit', 'delete', 'import'] },
    { key: 'suppliers', name: 'Suppliers', actions: ['view', 'create', 'edit', 'delete', 'import'] },
    { key: 'purchaseOrders', name: 'Purchase Orders', actions: ['view', 'create', 'edit', 'delete', 'approve'] },
    { key: 'salesOrders', name: 'Sales Orders', actions: ['view', 'create', 'edit', 'delete', 'approve'] },
    { key: 'reports', name: 'Reports', actions: ['view', 'export'] },
    { key: 'users', name: 'User Management', actions: ['view', 'create', 'edit', 'delete', 'access'] },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        User Access Permissions
      </h1>
      <p className="text-gray-600 mb-6">
        Managing permissions for: <span className="font-medium">{user.name}</span> ({user.email})
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 space-y-6">
          {modules.map((module) => (
            <div key={module.key} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{module.name}</h3>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={Object.values(permissions[module.key]).every(Boolean)}
                      onChange={(e) => handleModuleAllChange(module.key, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Select All</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {module.actions.map((action) => (
                  <label key={action} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={permissions[module.key][action]}
                      onChange={() => handlePermissionChange(module.key, action)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {action}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserAccess;