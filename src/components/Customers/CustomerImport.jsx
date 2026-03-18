import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

const CustomerImport = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
    setData([]);
    setErrors([]);
  };

  const validateData = () => {
    const requiredFields = ['name', 'email', 'phone'];
    const newErrors = [];

    data.forEach((row, index) => {
      requiredFields.forEach((field) => {
        if (!row[field]) {
          newErrors.push(`Row ${index + 2}: ${field} is required`);
        }
      });

      // Validate email format
      if (row.email && !/\S+@\S+\.\S+/.test(row.email)) {
        newErrors.push(`Row ${index + 2}: Invalid email format`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleImport = async () => {
    if (!validateData()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    try {
      await api.post('/customers/bulk', { customers: data });
      toast.success('Customers imported successfully');
      navigate('/customers');
    } catch (error) {
      toast.error('Failed to import customers');
      setErrors([error.response?.data?.message || 'Import failed']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Import Customers
      </h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* File Upload */}
        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} />
            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag & drop an Excel or CSV file here, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supported formats: .xlsx, .xls, .csv
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <DocumentArrowUpIcon className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB • {data.length} records
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-800 mb-2">
              Validation Errors:
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm text-red-600">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Preview */}
        {data.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Preview ({data.length} records)
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.length > 5 && (
              <p className="mt-2 text-sm text-gray-500">
                Showing first 5 of {data.length} records
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        {file && (
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/customers')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={loading || errors.length > 0}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Importing...' : 'Import Customers'}
            </button>
          </div>
        )}

        {/* Template Download */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Don't have a template?
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Download our template file to get started.
          </p>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Download Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerImport;