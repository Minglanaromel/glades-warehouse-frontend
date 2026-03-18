import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SalesOrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [formData, setFormData] = useState({
    soNumber: '',
    customerId: '',
    orderDate: new Date().toISOString().split('T')[0],
    requiredDate: '',
    paymentTerms: 'net30',
    shippingAddress: '',
    billingAddress: '',
    notes: '',
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  });

  useEffect(() => {
    fetchCustomers();
    fetchStockItems();
    if (id) {
      fetchSalesOrder();
    } else {
      generateSONumber();
    }
  }, [id]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data.filter(c => c.isActive));
    } catch (error) {
      toast.error('Failed to fetch customers');
    }
  };

  const fetchStockItems = async () => {
    try {
      const response = await api.get('/stock-items');
      setStockItems(response.data.filter(item => item.isActive));
    } catch (error) {
      toast.error('Failed to fetch stock items');
    }
  };

  const fetchSalesOrder = async () => {
    try {
      const response = await api.get(`/sales-orders/${id}`);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to fetch sales order');
      navigate('/sales-orders');
    }
  };

  const generateSONumber = async () => {
    try {
      const response = await api.get('/sales-orders/generate-number');
      setFormData(prev => ({ ...prev, soNumber: response.data.soNumber }));
    } catch (error) {
      console.error('Failed to generate SO number:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now(),
          stockItemId: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          total: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => {
      const newItems = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: newItems };
    });
    calculateTotals();
  };

  const updateItem = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Calculate item total
      if (field === 'quantity' || field === 'unitPrice') {
        newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
      }
      
      return { ...prev, items: newItems };
    });
    
    setTimeout(() => calculateTotals(), 0);
  };

  const calculateTotals = () => {
    setFormData(prev => {
      const subtotal = prev.items.reduce((sum, item) => sum + (item.total || 0), 0);
      const tax = subtotal * 0.1; // 10% tax rate
      const total = subtotal + tax + (prev.shipping || 0);
      
      return {
        ...prev,
        subtotal,
        tax,
        total,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setLoading(true);

    try {
      if (id) {
        await api.put(`/sales-orders/${id}`, formData);
        toast.success('Sales order updated successfully');
      } else {
        await api.post('/sales-orders', formData);
        toast.success('Sales order created successfully');
      }
      navigate('/sales-orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save sales order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {id ? 'Edit Sales Order' : 'New Sales Order'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SO Number
              </label>
              <input
                type="text"
                name="soNumber"
                value={formData.soNumber}
                readOnly
                className="input-field bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer *
              </label>
              <select
                name="customerId"
                required
                value={formData.customerId}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Date *
              </label>
              <input
                type="date"
                name="orderDate"
                required
                value={formData.orderDate}
                onChange={handleChange}
                className="input-field"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Date
              </label>
              <input
                type="date"
                name="requiredDate"
                value={formData.requiredDate}
                onChange={handleChange}
                className="input-field"
                min={formData.orderDate}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Terms
              </label>
              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                className="input-field"
              >
                <option value="immediate">Immediate</option>
                <option value="net15">Net 15</option>
                <option value="net30">Net 30</option>
                <option value="net45">Net 45</option>
                <option value="net60">Net 60</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipping Address
            </label>
            <textarea
              name="shippingAddress"
              rows="2"
              value={formData.shippingAddress}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter shipping address"
            ></textarea>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Address
            </label>
            <textarea
              name="billingAddress"
              rows="2"
              value={formData.billingAddress}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter billing address (if different from shipping)"
            ></textarea>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
              Add Item
            </button>
          </div>

          {formData.items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No items added. Click "Add Item" to start.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                      <select
                        value={item.stockItemId}
                        onChange={(e) => updateItem(index, 'stockItemId', e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select item</option>
                        {stockItems.map(stockItem => (
                          <option key={stockItem.id} value={stockItem.id}>
                            {stockItem.name} - ${stockItem.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Unit Price"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="input-field"
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900 font-medium">
                        ${item.total?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Totals */}
          {formData.items.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-sm font-medium">${formData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tax (10%):</span>
                    <span className="text-sm font-medium">${formData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Shipping:</span>
                    <input
                      type="number"
                      name="shipping"
                      min="0"
                      step="0.01"
                      value={formData.shipping}
                      onChange={handleChange}
                      className="w-24 text-right input-field py-1"
                    />
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${formData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className="input-field"
            placeholder="Additional notes or instructions..."
          ></textarea>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/sales-orders')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Saving...' : id ? 'Update Order' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesOrderForm;