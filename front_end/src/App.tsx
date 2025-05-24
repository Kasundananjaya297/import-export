import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Importer Pages
import ImporterDashboard from './pages/importer/Dashboard';
import ProductCatalog from './pages/importer/ProductCatalog';
import PlaceOrder from './pages/importer/PlaceOrder';
import MyOrders from './pages/importer/MyOrders';
import PaymentPage from './pages/importer/PaymentPage';
import { ComplaintsPage } from './pages/Complaints';
// import SubmitComplaint from './pages/importer/SubmitComplaint';

// Exporter Pages
// import ExporterDashboard from './pages/exporter/Dashboard';
// import ProductManagement from './pages/exporter/ProductManagement';
// import OrderManagement from './pages/exporter/OrderManagement';
// import TransactionHistory from './pages/exporter/TransactionHistory';
// import Complaints from './pages/exporter/Complaints';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
// import UserManagement from './pages/admin/UserManagement';
// import AdminComplaints from './pages/admin/Complaints';
// import Reports from './pages/admin/Reports';
// import SystemLogs from './pages/admin/SystemLogs';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Layout Wrapper */}
              <Route element={<Layout />}>
                {/* Shared Routes */}
                <Route path="/complaints" element={
                  <ProtectedRoute roles={['importer', 'exporter', 'admin']}>
                    <ComplaintsPage />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />

                {/* Importer Routes */}
                <Route path="/importer/dashboard" element={
                  <ProtectedRoute roles={['importer', 'admin']}>
                    <ImporterDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/importer/catalog" element={
                  <ProtectedRoute roles={['importer', 'admin']}>
                    <ProductCatalog />
                  </ProtectedRoute>
                } />
                <Route path="/importer/place-order/:productId?" element={
                  <ProtectedRoute roles={['importer', 'admin']}>
                    <PlaceOrder />
                  </ProtectedRoute>
                } />
                <Route path="/importer/orders" element={
                  <ProtectedRoute roles={['importer', 'admin']}>
                    <MyOrders />
                  </ProtectedRoute>
                } />
                <Route path="/importer/payment/:orderId" element={
                  <ProtectedRoute roles={['importer', 'admin']}>
                    <PaymentPage />
                  </ProtectedRoute>
                } />
                {/* <Route path="/importer/complaint" element={
                  <ProtectedRoute roles={['importer', 'admin']}>
                    <SubmitComplaint />
                  </ProtectedRoute>
                } /> */}
              </Route>

              {/* Exporter Routes */}
              {/* <Route element={<Layout />}>
                <Route path="/exporter/dashboard" element={
                  <ProtectedRoute roles={['exporter', 'admin']}>
                    <ExporterDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/exporter/products" element={
                  <ProtectedRoute roles={['exporter', 'admin']}>
                    <ProductManagement />
                  </ProtectedRoute>
                } />
                <Route path="/exporter/orders" element={
                  <ProtectedRoute roles={['exporter', 'admin']}>
                    <OrderManagement />
                  </ProtectedRoute>
                } />
                <Route path="/exporter/transactions" element={
                  <ProtectedRoute roles={['exporter', 'admin']}>
                    <TransactionHistory />
                  </ProtectedRoute>
                } />
                <Route path="/exporter/complaints" element={
                  <ProtectedRoute roles={['exporter', 'admin']}>
                    <Complaints />
                  </ProtectedRoute>
                } />
              </Route> */}

              {/* Admin Routes */}
              {/* <Route element={<Layout />}>
                <Route path="/admin/users" element={
                  <ProtectedRoute roles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/complaints" element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminComplaints />
                  </ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                  <ProtectedRoute roles={['admin']}>
                    <Reports />
                  </ProtectedRoute>
                } />
                <Route path="/admin/logs" element={
                  <ProtectedRoute roles={['admin']}>
                    <SystemLogs />
                  </ProtectedRoute>
                } />
              </Route> */}

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;