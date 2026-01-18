/** @format */

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  List,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
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
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/dashboard/StatCard";
import ChartContainer from "../../components/dashboard/ChartContainer";
import RecentActivityItem from "../../components/dashboard/RecentActivityItem";
import { orderService } from "../../services/orderService";
import { complaintService } from "../../services/complaintService";

const COLORS = ["#1976D2", "#90CAF9", "#42A5F5", "#64B5F6", "#2196F3"];

const ImporterDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    openComplaints: 0,
    resolvedComplaints: 0,
  });
  const [productCategories, setProductCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersData, complaintsData] = await Promise.all([
        orderService.getBuyerOrders(),
        complaintService.getBuyerComplaints()
      ]);
      setOrders(ordersData);
      setComplaints(complaintsData);

      // Calculate stats
      const totalOrders = ordersData.length;
      const completedOrders = ordersData.filter(
        (o: any) => o.status === "delivered"
      ).length;
      const activeOrders = ordersData.filter(
        (o: any) =>
          o.status === "confirmed" ||
          o.status === "shipped" ||
          o.status === "pending"
      ).length;
      const totalSpent = ordersData.reduce(
        (sum: number, o: any) => sum + parseFloat(o.totalAmount || 0),
        0
      );

      const pendingOrders = ordersData.filter(
        (o: any) => o.status === "pending"
      ).length;
      const confirmedOrders = ordersData.filter(
        (o: any) => o.status === "confirmed"
      ).length;
      const shippedOrders = ordersData.filter(
        (o: any) => o.status === "shipped"
      ).length;
      const deliveredOrders = ordersData.filter(
        (o: any) => o.status === "delivered"
      ).length;
      const cancelledOrders = ordersData.filter(
        (o: any) => o.status === "cancelled"
      ).length;
      const openComplaints = complaintsData.filter(
        (c: any) => c.status === "open" || c.status === "in_progress"
      ).length;
      const resolvedComplaints = complaintsData.filter(
        (c: any) => c.status === "resolved" || c.status === "closed"
      ).length;

      setStats({
        totalOrders,
        activeOrders,
        completedOrders,
        totalSpent,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        openComplaints,
        resolvedComplaints,
      });

      // Calculate product categories
      const categoryMap = new Map<string, number>();
      ordersData.forEach((order: any) => {
        if (order.product?.category) {
          const category = order.product.category;
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        }
      });

      const categories = Array.from(categoryMap.entries()).map(
        ([category, count]) => ({
          category,
          count,
        })
      );
      setProductCategories(categories);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get recent orders (last 3)
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  // Get recent complaints (last 3)
  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Welcome, {currentUser?.fname}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Your import orders and purchase statistics
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Orders Placed"
            value={stats.totalOrders}
            icon={<ShoppingCartIcon fontSize="large" />}
            subtitle="Total purchases"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Orders"
            value={stats.activeOrders}
            icon={<LocalShippingIcon fontSize="large" />}
            subtitle="Being processed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completedOrders}
            icon={<CheckCircleIcon fontSize="large" />}
            subtitle="Received orders"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Spent"
            value={`$${stats.totalSpent.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            icon={<ShoppingCartIcon fontSize="large" />}
            subtitle="All purchases"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="My Complaints"
            value={stats.openComplaints}
            icon={<SupportAgentIcon fontSize="large" />}
            subtitle={`${stats.resolvedComplaints} resolved`}
          />
        </Grid>

        {/* Order Status Chart */}
        <Grid item xs={12} md={8}>
          <ChartContainer
            title="My Order Status"
            subtitle="Current status of your purchase orders"
            height={350}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Pending", value: stats.pendingOrders },
                  { name: "Confirmed", value: stats.confirmedOrders },
                  { name: "Shipped", value: stats.shippedOrders },
                  { name: "Delivered", value: stats.deliveredOrders },
                  { name: "Cancelled", value: stats.cancelledOrders },
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
            title="Products Purchased"
            subtitle="Categories of items you ordered"
            height={350}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productCategories}
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
                  {productCategories.map((entry, index) => (
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
                My Recent Orders
              </Typography>
              <Button variant="text" size="small" onClick={() => navigate("/importer/orders")}>
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
                    secondaryText={`${order.quantity} ${order.product?.unit || "items"} - ${order.product?.name || "Product"}`}
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
                My Recent Complaints
              </Typography>
              <Button variant="text" size="small" onClick={() => navigate("/importer/complaint")}>
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
                    secondaryText={`${complaint.category} - Priority: ${complaint.priority}`}
                    timestamp={complaint.createdAt}
                    status={
                      complaint.status === "resolved" || complaint.status === "closed"
                        ? "success"
                        : complaint.status === "in_progress"
                        ? "info"
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
