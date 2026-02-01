/** @format */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "notistack";

import theme from "./theme";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import StallDetails from "./pages/StallDetails";

// Importer Pages
import ImporterDashboard from "./pages/importer/Dashboard";
import ProductCatalog from "./pages/importer/ProductCatalog";
import PlaceOrder from "./pages/importer/PlaceOrder";
import MyOrders from "./pages/importer/MyOrders";
import PaymentPage from "./pages/importer/PaymentPage";
import TestPaymentPage from "./pages/importer/TestPaymentPage";
import SubmitComplaint from "./pages/importer/SubmitComplaint";
import { ComplaintsPage } from "./pages/Complaints";

// Exporter Pages
import ExporterDashboard from "./pages/exporter/Dashboard";
import AddProduct from "./pages/exporter/AddProduct";
import ProductManagement from "./pages/exporter/ProductManagement";
import OrderManagement from "./pages/exporter/OrderManagement";
import TransactionHistory from "./pages/exporter/TransactionHistory";
import Complaints from "./pages/exporter/Complaints";
import CreateStall from "./pages/exporter/CreateStall";
import StallManagement from "./pages/exporter/StallManagement";
import EditProduct from "./pages/exporter/EditProduct";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";

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
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/listing/:id" element={<ProductDetails />} />
                <Route path="/stall/:id" element={<StallDetails />} />

                {/* Shared Routes */}
                <Route
                  path="/complaints"
                  element={
                    <ProtectedRoute roles={["importer", "exporter", "admin", "buyer", "seller"]}>
                      <ComplaintsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute roles={["importer", "exporter", "admin", "buyer", "seller"]}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Importer Routes */}
                <Route
                  path="/importer/dashboard"
                  element={
                    <ProtectedRoute roles={["importer", "admin", "buyer"]}>
                      <ImporterDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/importer/catalog"
                  element={
                    <ProtectedRoute roles={["importer", "admin", "buyer"]}>
                      <ProductCatalog />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/importer/place-order/:productId?"
                  element={
                    <ProtectedRoute roles={["importer", "admin", "buyer"]}>
                      <PlaceOrder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/importer/orders"
                  element={
                    <ProtectedRoute roles={["importer", "admin", "buyer"]}>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/importer/complaint"
                  element={
                    <ProtectedRoute roles={["importer", "admin", "buyer"]}>
                      <SubmitComplaint />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/importer/payment/:orderId"
                  element={
                    <ProtectedRoute roles={["importer", "admin", "buyer"]}>
                      <PaymentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/test/payment/:orderId"
                  element={<TestPaymentPage />}
                />

                {/* Exporter Routes */}
                <Route
                  path="/exporter/dashboard"
                  element={
                    <ProtectedRoute roles={["exporter", "admin", "seller"]}>
                      <ExporterDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exporter/add-product"
                  element={
                    <ProtectedRoute roles={["exporter", "seller"]}>
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exporter/edit-product/:id"
                  element={
                    <ProtectedRoute roles={["exporter", "seller"]}>
                      <EditProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-stall"
                  element={
                    <ProtectedRoute roles={["exporter", "seller"]}>
                      <CreateStall />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exporter/products"
                  element={
                    <ProtectedRoute roles={["exporter", "admin", "seller"]}>
                      <ProductManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exporter/orders"
                  element={
                    <ProtectedRoute roles={["exporter", "admin", "seller"]}>
                      <OrderManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exporter/transactions"
                  element={
                    <ProtectedRoute roles={["exporter", "admin", "seller"]}>
                      <TransactionHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exporter/complaints"
                  element={
                    <ProtectedRoute roles={["exporter", "admin", "seller"]}>
                      <Complaints />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exporter/stall-management"
                  element={
                    <ProtectedRoute roles={["exporter", "admin", "seller"]}>
                      <StallManagement />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
