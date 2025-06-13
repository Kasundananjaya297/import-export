/** @format */

import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ExporterDashboard from "../pages/exporter/Dashboard";
import AddProduct from "../pages/exporter/AddProduct";

const ExporterRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["exporter"]}>
            <ExporterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-product"
        element={
          <ProtectedRoute roles={["exporter"]}>
            <AddProduct />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default ExporterRoutes;
