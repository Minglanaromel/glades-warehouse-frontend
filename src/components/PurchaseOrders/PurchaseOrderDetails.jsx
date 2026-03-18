import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PurchaseOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/purchase-orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      toast.error('Failed to fetch purchase order details');
      navigate('/purchase-orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.put(`/purchase-orders/${id}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrder();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'received': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/purchase-orders')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Purchase Order {order.poNumber}
          </h1>
          <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        <div className="flex space-x-3">
          {order.status === 'draft' && (
            <Link
              to={`/purchase-orders/edit/${id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PencilIcon className="-ml-1 mr-2 h-5 w-5" />
              Edit
            </Link>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <DocumentArrowDownIcon className="-ml-1 mr-2 h-5 w-5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Status Actions */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Update Status:</span>
          <div className="flex space-x-2">
            {order.status === 'draft' && (
              <button
                onClick={() => handleStatusUpdate('pending')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
              >
                Submit for Approval
              </button>
            )}
            {order.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('approved')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate('cancelled')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <XCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                  Reject
                </button>
              </>
            )}
            {order.status === 'approved' && (
              <button
                onClick={() => handleStatusUpdate('shipped')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <TruckIcon className="-ml-1 mr-2 h-5 w-5" />
                Mark as Shipped
              </button>
            )}
            {order.status === 'shipped' && (
              <button
                onClick={() => handleStatusUpdate('received')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                Mark as Received
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Order Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Items</h2>
            </div>
            <div className="p-6">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-medium text-gray-500">Item</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">Quantity</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">Unit Price</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500">{item.description}</div>
                        )}
                      </td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-3 text-right font-medium">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t">
                  <tr>
                    <td colSpan="3" className="py-3 text-right font-medium">Subtotal:</td>
                    <td className="py-3 text-right">${order.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="py-2 text-right font-medium">Tax (10%):</td>
                    <td className="py-2 text-right">${order.tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="py-2 text-right font-medium">Shipping:</td>
                    <td className="py-2 text-right">${order.shipping.toFixed(2)}</td>
                  </tr>
                  <tr className="text-lg font-semibold">
                    <td colSpan="3" className="py-3 text-right">Total:</td>
                    <td className="py-3 text-right">${order.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Supplier Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Supplier Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{order.supplierName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Person</p>
                <p>{order.supplierContact || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-blue-600">{order.supplierEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{order.supplierPhone}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p>{new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expected Delivery</p>
                <p>{order.expectedDelivery ? new Date(order.expectedDelivery).toLocaleDateString() : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Terms</p>
                <p className="capitalize">{order.paymentTerms}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Shipping Address</p>
                <p>{order.shippingAddress || '-'}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-3">
              {order.createdAt && (
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              )}
              {order.approvedAt && (
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <p>{new Date(order.approvedAt).toLocaleString()}</p>
                </div>
              )}
              {order.shippedAt && (
                <div>
                  <p className="text-sm text-gray-500">Shipped</p>
                  <p>{new Date(order.shippedAt).toLocaleString()}</p>
                </div>
              )}
              {order.receivedAt && (
                <div>
                  <p className="text-sm text-gray-500">Received</p>
                  <p>{new Date(order.receivedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetails;