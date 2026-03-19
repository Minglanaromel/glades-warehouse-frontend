// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';
import Layout from './components/Layout/Layout';
import CCTV from './components/CCTV/CCTV';
import PrivateRoute from './components/Auth/PrivateRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ProductionDashboard from './components/Dashboard/ProductionDashboard';
import CapacityUtilization from './components/Dashboard/CapacityUtilization';
import MachineStatus from './components/Dashboard/MachineStatus';
import DowntimeMonitor from './components/Dashboard/DowntimeMonitor';
import AttendanceTracker from './components/Dashboard/AttendanceTracker';
import OTIFDashboard from './components/Dashboard/OTIFDashboard';
import ProfilePage from './components/Profile/ProfilePage';
import NotificationsPage from './components/Notifications/NotificationsPage';
import SettingsPage from './components/Settings/SettingsPage';
import MessagesPage from './components/Messages/MessagesPage';

// Stock Items
import StockItemList from './components/StockItems/StockItemList';
import StockItemForm from './components/StockItems/StockItemForm';
import StockItemImport from './components/StockItems/StockItemImport';

// Customers
import CustomerList from './components/Customers/CustomerList';
import CustomerForm from './components/Customers/CustomerForm';
import CustomerImport from './components/Customers/CustomerImport';

// Suppliers
import SupplierList from './components/Suppliers/SupplierList';
import SupplierForm from './components/Suppliers/SupplierForm';
import SupplierImport from './components/Suppliers/SupplierImport';

// Purchase Orders
import PurchaseOrderList from './components/PurchaseOrders/PurchaseOrderList';
import PurchaseOrderForm from './components/PurchaseOrders/PurchaseOrderForm';
import PurchaseOrderDetails from './components/PurchaseOrders/PurchaseOrderDetails';

// Sales Orders
import SalesOrderList from './components/SalesOrders/SalesOrderList';
import SalesOrderForm from './components/SalesOrders/SalesOrderForm';
import SalesOrderDetails from './components/SalesOrders/SalesOrderDetails';

// Reports
import DailyActivityReport from './components/Reports/DailyActivityReport';
import SalesReport from './components/Reports/SalesReport';
import PurchaseReport from './components/Reports/PurchaseReport';
import SalesOutstanding from './components/Reports/SalesOutstanding';
import PurchaseOutstanding from './components/Reports/PurchaseOutstanding';
import LowStockReport from './components/Reports/LowStockReport';
import ProdnTroubleReport from './components/Reports/ProdnTroubleReport';

// User Management
import UserList from './components/UserManagement/UserList';
import UserForm from './components/UserManagement/UserForm';
import UserAccess from './components/UserManagement/UserAccess';

// CCTV
import CCTVGrid from './components/CCTV/CCTVGrid';
import CameraDetails from './components/CCTV/CameraDetails';
import CCTVFullscreen from './components/CCTV/CCTVFullscreen';
import Recordings from './components/CCTV/Recordings';

function App() {
  return (
    <AuthProvider>
      <MessageProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Main Layout Routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard Routes */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="production-dashboard" element={<ProductionDashboard />} />
            <Route path="capacity-utilization" element={<CapacityUtilization />} />
            <Route path="machine-status" element={<MachineStatus />} />
            <Route path="downtime-monitor" element={<DowntimeMonitor />} />
            <Route path="attendance" element={<AttendanceTracker />} />
            <Route path="otif-dashboard" element={<OTIFDashboard />} />
            
            {/* Profile, Notifications, Messages and Settings */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            
            {/* Stock Items Routes */}
            <Route path="stock-items">
              <Route index element={<StockItemList />} />
              <Route path="new" element={<StockItemForm />} />
              <Route path="edit/:id" element={<StockItemForm />} />
              <Route path="import" element={<StockItemImport />} />
            </Route>
            
            {/* Customers Routes */}
            <Route path="customers">
              <Route index element={<CustomerList />} />
              <Route path="new" element={<CustomerForm />} />
              <Route path="edit/:id" element={<CustomerForm />} />
              <Route path="import" element={<CustomerImport />} />
            </Route>
            
            {/* Suppliers Routes */}
            <Route path="suppliers">
              <Route index element={<SupplierList />} />
              <Route path="new" element={<SupplierForm />} />
              <Route path="edit/:id" element={<SupplierForm />} />
              <Route path="import" element={<SupplierImport />} />
            </Route>
            
            {/* Purchase Orders Routes */}
            <Route path="purchase-orders">
              <Route index element={<PurchaseOrderList />} />
              <Route path="new" element={<PurchaseOrderForm />} />
              <Route path=":id" element={<PurchaseOrderDetails />} />
              <Route path="edit/:id" element={<PurchaseOrderForm />} />
            </Route>
            
            {/* Sales Orders Routes */}
            <Route path="sales-orders">
              <Route index element={<SalesOrderList />} />
              <Route path="new" element={<SalesOrderForm />} />
              <Route path=":id" element={<SalesOrderDetails />} />
              <Route path="edit/:id" element={<SalesOrderForm />} />
            </Route>
            
            {/* Reports Routes */}
            <Route path="reports">
              <Route path="daily-activity" element={<DailyActivityReport />} />
              <Route path="sales" element={<SalesReport />} />
              <Route path="purchase" element={<PurchaseReport />} />
              <Route path="sales-outstanding" element={<SalesOutstanding />} />
              <Route path="purchase-outstanding" element={<PurchaseOutstanding />} />
              <Route path="low-stock" element={<LowStockReport />} />
              <Route path="trouble-reports" element={<ProdnTroubleReport />} />
            </Route>
            
            {/* User Management Routes */}
            <Route path="users">
              <Route index element={<UserList />} />
              <Route path="new" element={<UserForm />} />
              <Route path="edit/:id" element={<UserForm />} />
              <Route path="access/:id" element={<UserAccess />} />
            </Route>
          </Route>

          {/* CCTV Routes with their own layout */}
          <Route path="/cctv" element={
            <PrivateRoute>
              <CCTV />
            </PrivateRoute>
          }>
            <Route index element={<CCTVGrid />} />
            <Route path="cameras" element={<CCTVGrid />} />
            <Route path="camera/:id" element={<CameraDetails />} />
            <Route path="recordings" element={<Recordings />} />
            <Route path="fullscreen" element={<CCTVFullscreen />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </MessageProvider>
    </AuthProvider>
  );
}

export default App;