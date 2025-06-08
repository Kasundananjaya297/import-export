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
  ShoppingCart as ShoppingCartIcon,
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
import { importerStats } from "../../data/stats";
import { orders } from "../../data/orders";
import { complaints } from "../../data/complaints";

const COLORS = ["#1976D2", "#90CAF9", "#42A5F5", "#64B5F6", "#2196F3"];

const ImporterDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  

  // Filter orders for the current user
  const userOrders = orders.filter(
    (order) => order.buyerId === currentUser?.id,
  );

  // Filter complaints for the current user
  const userComplaints = complaints.filter(
    (complaint) => complaint.buyerId === currentUser?.id,
  );

  // Get recent orders (last 3)
  const recentOrders = [...userOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Welcome, {currentUser?.fname}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's what's happening with your imports
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={importerStats.totalOrders}
            icon={<ShoppingCartIcon fontSize="large" />}
            subtitle="All time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Orders"
            value={importerStats.processingOrders + importerStats.shippedOrders}
            icon={<LocalShippingIcon fontSize="large" />}
            subtitle="In progress"
            change={{ value: 12, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Orders"
            value={importerStats.deliveredOrders}
            icon={<CheckCircleIcon fontSize="large" />}
            subtitle="Successfully delivered"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Complaints"
            value={userComplaints.length}
            icon={<SupportAgentIcon fontSize="large" />}
            subtitle={`${
              userComplaints.filter((c) => c.status === "resolved").length
            } resolved`}
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
                  { name: "Pending", value: importerStats.pendingOrders },
                  { name: "Processing", value: importerStats.processingOrders },
                  { name: "Shipped", value: importerStats.shippedOrders },
                  { name: "Delivered", value: importerStats.deliveredOrders },
                  { name: "Cancelled", value: importerStats.cancelledOrders },
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
            subtitle="Distribution of ordered products"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={importerStats.productCategories}
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
                  {importerStats.productCategories.map((entry, index) => (
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
                    secondaryText={`${order.products.length} products from ${order.sellerName}`}
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
                    icon={<ShoppingCartIcon />}
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
              {userComplaints.length > 0 ? (
                userComplaints.map((complaint) => (
                  <RecentActivityItem
                    key={complaint.id}
                    primaryText={complaint.subject}
                    secondaryText={`Order #${complaint.orderNumber} - ${complaint.sellerName}`}
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

export default ImporterDashboard;
