import React, { useState } from 'react';
import api from '../services/api';

const TestApi = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      // Test basic connection
      const result = await api.get('/test');
      setResponse(result.data);
    } catch (err) {
      setError(err.message || 'Connection failed');
      console.error('Connection test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get('/items');
      setResponse(result.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow mt-10">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      
      <div className="mb-4">
        <p className="font-medium">API URL:</p>
        <p className="text-blue-600">{process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'}</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={testConnection}
          disabled={loading}
          className="btn-primary w-full"
        >
          Test Connection
        </button>
        
        <button
          onClick={fetchItems}
          disabled={loading}
          className="btn-secondary w-full"
        >
          Fetch Sample Items
        </button>
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <div className="spinner"></div>
        </div>
      )}

      {response && (
        <div className="mt-4">
          <p className="font-medium text-green-600">✓ Success!</p>
          <pre className="bg-gray-100 p-2 rounded text-sm mt-2 overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <p className="font-medium text-red-600">✗ Error:</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TestApi;