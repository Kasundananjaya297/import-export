/** @format */

import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  List,
  Button,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Money as MoneyIcon,
  SupportAgent as SupportAgentIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/dashboard/StatCard";
import ChartContainer from "../../components/dashboard/ChartContainer";
import RecentActivityItem from "../../components/dashboard/RecentActivityItem";
import { useNavigate } from "react-router-dom";

const COLORS = ["#1976D2", "#90CAF9", "#42A5F5", "#64B5F6", "#2196F3"];

// Mock data - replace with actual data from your backend
const exporterStats = {
  totalProducts: 25,
  activeOrders: 8,
  completedOrders: 45,
  totalRevenue: 125000,
  productCategories: [
    { category: "Tea", count: 10 },
    { category: "Spices", count: 8 },
    { category: "Coconut", count: 5 },
    { category: "Rubber", count: 2 },
  ],
  pendingOrders: 3,
  processingOrders: 5,
  shippedOrders: 2,
  deliveredOrders: 45,
  cancelledOrders: 1,
};

const ExporterDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Mock data - replace with actual data from your backend
  const recentOrders = [
    {
      id: 1,
      orderNumber: "ORD001",
      buyerName: "Global Imports Inc",
      products: ["Ceylon Tea", "Black Pepper"],
      status: "processing",
      createdAt: "2024-03-15T10:30:00",
    },
    {
      id: 2,
      orderNumber: "ORD002",
      buyerName: "Spice Traders Ltd",
      products: ["Cinnamon", "Cardamom"],
      status: "shipped",
      createdAt: "2024-03-14T15:45:00",
    },
  ];

  const recentComplaints = [
    {
      id: 1,
      subject: "Product Quality Issue",
      orderNumber: "ORD001",
      buyerName: "Global Imports Inc",
      status: "open",
      createdAt: "2024-03-15T11:20:00",
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Welcome, {currentUser?.fname}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your export products and orders
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/exporter/add-product")}
        >
          Add New Product
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={exporterStats.totalProducts}
            icon={<InventoryIcon fontSize="large" />}
            subtitle="Listed products"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Orders"
            value={exporterStats.activeOrders}
            icon={<LocalShippingIcon fontSize="large" />}
            subtitle="In progress"
            change={{ value: 12, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Orders"
            value={exporterStats.completedOrders}
            icon={<CheckCircleIcon fontSize="large" />}
            subtitle="Successfully delivered"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${exporterStats.totalRevenue.toLocaleString()}`}
            icon={<MoneyIcon fontSize="large" />}
            subtitle="All time"
          />
        </Grid>

        {/* Order Status Chart */}
        <Grid item xs={12} md={8}>
          <ChartContainer
            title="Orders by Status"
            subtitle="Current distribution of your orders"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Pending", value: exporterStats.pendingOrders },
                  { name: "Processing", value: exporterStats.processingOrders },
                  { name: "Shipped", value: exporterStats.shippedOrders },
                  { name: "Delivered", value: exporterStats.deliveredOrders },
                  { name: "Cancelled", value: exporterStats.cancelledOrders },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1976D2" barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>

        {/* Product Categories Pie Chart */}
        <Grid item xs={12} md={4}>
          <ChartContainer
            title="Product Categories"
            subtitle="Distribution of your products"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={exporterStats.productCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="category"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {exporterStats.productCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 2,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                Recent Orders
              </Typography>
              <Button variant="text" size="small">
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ p: 0 }}>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <RecentActivityItem
                    key={order.id}
                    primaryText={`Order #${order.orderNumber}`}
                    secondaryText={`${order.products.length} products for ${order.buyerName}`}
                    timestamp={order.createdAt}
                    status={
                      order.status === "cancelled"
                        ? "error"
                        : order.status === "delivered"
                        ? "success"
                        : order.status === "pending"
                        ? "warning"
                        : "info"
                    }
                    statusText={order.status}
                    icon={<LocalShippingIcon />}
                  />
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  No recent orders found
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Recent Complaints */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 2,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                Recent Complaints
              </Typography>
              <Button variant="text" size="small">
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ p: 0 }}>
              {recentComplaints.length > 0 ? (
                recentComplaints.map((complaint) => (
                  <RecentActivityItem
                    key={complaint.id}
                    primaryText={complaint.subject}
                    secondaryText={`Order #${complaint.orderNumber} - ${complaint.buyerName}`}
                    timestamp={complaint.createdAt}
                    status={
                      complaint.status === "resolved"
                        ? "success"
                        : complaint.status === "open"
                        ? "error"
                        : "warning"
                    }
                    statusText={complaint.status}
                    icon={<SupportAgentIcon />}
                  />
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  No complaints found
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExporterDashboard;
