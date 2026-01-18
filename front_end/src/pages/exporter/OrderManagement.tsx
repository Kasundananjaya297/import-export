/** @format */

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  Search,
  Refresh,
  Visibility,
  Edit,
  LocalShipping,
  CheckCircle,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { orderService, Order } from "../../services/orderService";
import OrderDetailsModal from "../../components/common/OrderDetailsModal";

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    statusCounts: {} as Record<string, number>,
    paymentStatusCounts: {} as Record<string, number>,
  });
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] =
    useState<Order | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchOrders();
    
    // Auto-refresh every 30 seconds to get latest updates
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    filterOrders();
    calculateStats();
  }, [orders, searchTerm, statusFilter, paymentStatusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getSellerOrders();
      setOrders(ordersData);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
      enqueueSnackbar("Failed to fetch orders", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    // Calculate statistics from orders data
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, order) => {
      return sum + (Number(order.totalAmount) || 0);
    }, 0);

    const statusCounts = orders.reduce((counts, order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const paymentStatusCounts = orders.reduce((counts, order) => {
      counts[order.paymentStatus] = (counts[order.paymentStatus] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    setStats({
      totalOrders,
      totalAmount,
      statusCounts,
      paymentStatusCounts,
    });
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.product?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.buyer?.fname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.buyer?.lname?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (paymentStatusFilter) {
      filtered = filtered.filter(
        (order) => order.paymentStatus === paymentStatusFilter,
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      setUpdating(true);
      const updatedOrder = await orderService.updateOrderStatus(selectedOrder.id, newStatus);

      // Update the order in the local state with the response from server
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id
            ? updatedOrder
            : order,
        ),
      );

      // Close dialog and reset state
      setUpdateDialogOpen(false);
      setSelectedOrder(null);
      setNewStatus("");

      enqueueSnackbar("Order status updated successfully", {
        variant: "success",
      });

      // Stats will be recalculated automatically by useEffect
    } catch (err: any) {
      console.error("Error updating order status:", err);
      enqueueSnackbar(
        err.response?.data?.message || "Failed to update order status",
        { variant: "error" },
      );
    } finally {
      setUpdating(false);
    }
  };

  const openUpdateDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(""); // Start with empty value to show placeholder
    setUpdateDialogOpen(true);
  };

  const openDetailsModal = (order: Order) => {
    setSelectedOrderForDetails(order);
    setDetailsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getValidStatusOptions = (currentStatus: string): string[] => {
    const validTransitions: Record<string, string[]> = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };
    return validTransitions[currentStatus] || [];
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "paid":
        return "success";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "shipped":
        return <LocalShipping />;
      case "delivered":
        return <CheckCircle />;
      default:
        return <Edit />;
    }
  };

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          Order Management
        </Typography>
        <Button
          startIcon={<Refresh />}
          onClick={() => {
            fetchOrders();
          }}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4" component="div">
                {stats.totalOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" component="div" color="primary">
                ${Number(stats.totalAmount).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pending Orders
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {stats.statusCounts.pending || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Paid Orders
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {stats.paymentStatusCounts.paid || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Search orders, products, or buyers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={paymentStatusFilter}
                label="Payment Status"
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Payment Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setPaymentStatusFilter("");
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {filteredOrders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            {orders.length === 0
              ? "No orders found"
              : "No orders match your filters"}
          </Typography>
          <Typography color="text.secondary">
            {orders.length === 0
              ? "Orders from buyers will appear here once they place orders for your products."
              : "Try adjusting your search criteria."}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Buyer</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {order.orderNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {order.product?.name || "Product"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.product?.category || "Category"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {order.buyer && (
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {order.buyer.fname} {order.buyer.lname}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.buyer.company}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.quantity} {order.product?.unit || "units"}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      color="primary"
                    >
                      ${Number(order.totalAmount).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.paymentStatus}
                      color={getPaymentStatusColor(order.paymentStatus) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title={selectedOrder?.status === "delivered" ? "Cannot update delivered order" : "Update Status"}>
                        <span>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => openUpdateDialog(order)}
                            disabled={order.status === "delivered"}
                          >
                            {getStatusIcon(order.status)}
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => openDetailsModal(order)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Update Status Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          {selectedOrder?.status === "delivered" ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              This order has been delivered and cannot be modified.
            </Alert>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Order: {selectedOrder?.orderNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Product: {selectedOrder?.product?.name}
              </Typography>
            </>
          )}
          <FormControl fullWidth disabled={selectedOrder?.status === "delivered"}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              label="New Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {getValidStatusOptions(selectedOrder?.status || "pending").map((status) => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedOrder?.status === "pending" && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Next step: Confirm the order
            </Alert>
          )}
          {selectedOrder?.status === "confirmed" && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Next step: Ship the order
            </Alert>
          )}
          {selectedOrder?.status === "shipped" && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Next step: Mark as delivered
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Close</Button>
          <Button
            onClick={handleStatusUpdate}
            color="primary"
            variant="contained"
            disabled={updating || selectedOrder?.status === "delivered"}
          >
            {updating ? "Updating..." : "Update Status"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        order={selectedOrderForDetails}
      />
    </Box>
  );
};

export default OrderManagement;
