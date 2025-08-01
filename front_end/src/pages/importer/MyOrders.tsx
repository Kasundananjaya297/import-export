/** @format */

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  CardMedia,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Search, FilterList, Cancel, Refresh } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import StatusBadge from "../../components/common/StatusBadge";
import { orderService, Order } from "../../services/orderService";

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, paymentStatusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getBuyerOrders();
      setOrders(ordersData);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
      enqueueSnackbar("Failed to fetch orders", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.product?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      setCancelling(true);
      await orderService.cancelOrder(selectedOrder.id);

      // Update the order in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: "cancelled" }
            : order,
        ),
      );

      enqueueSnackbar("Order cancelled successfully", {
        variant: "success",
      });
      setCancelDialogOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      enqueueSnackbar(err.response?.data?.message || "Failed to cancel order", {
        variant: "error",
      });
    } finally {
      setCancelling(false);
    }
  };

  const openCancelDialog = (order: Order) => {
    if (order.status === "delivered" || order.status === "cancelled") {
      enqueueSnackbar("This order cannot be cancelled", { variant: "warning" });
      return;
    }
    setSelectedOrder(order);
    setCancelDialogOpen(true);
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          My Orders
        </Typography>
        <Button
          startIcon={<Refresh />}
          onClick={fetchOrders}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Search orders..."
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
              ? "Your order history will appear here once you make a purchase."
              : "Try adjusting your search criteria."}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredOrders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    {/* Product Image */}
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        height="120"
                        image={
                          order.product?.images &&
                          order.product.images.length > 0
                            ? order.product.images[0]
                            : "https://via.placeholder.com/200x120?text=No+Image"
                        }
                        alt={order.product?.name || "Product"}
                        sx={{ objectFit: "cover", borderRadius: 1 }}
                      />
                    </Grid>

                    {/* Order Details */}
                    <Grid item xs={12} sm={5}>
                      <Typography variant="h6" gutterBottom>
                        {order.product?.name || "Product"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Order #{order.orderNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {order.quantity}{" "}
                        {order.product?.unit || "units"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Unit Price: ${order.unitPrice.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Order Date:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                      {order.seller && (
                        <Typography variant="body2" color="text.secondary">
                          Seller: {order.seller.fname} {order.seller.lname} (
                          {order.seller.company})
                        </Typography>
                      )}
                    </Grid>

                    {/* Status and Actions */}
                    <Grid item xs={12} sm={4}>
                      <Box textAlign="right">
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status) as any}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <Chip
                          label={order.paymentStatus}
                          color={
                            getPaymentStatusColor(order.paymentStatus) as any
                          }
                          size="small"
                          sx={{ mb: 2 }}
                        />
                        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                          ${order.totalAmount.toFixed(2)}
                        </Typography>

                        {/* Cancel Button */}
                        {order.status !== "delivered" &&
                          order.status !== "cancelled" && (
                            <Tooltip title="Cancel Order">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => openCancelDialog(order)}
                              >
                                <Cancel />
                              </IconButton>
                            </Tooltip>
                          )}
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Additional Details */}
                  {order.notes && (
                    <Box
                      sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        <strong>Notes:</strong> {order.notes}
                      </Typography>
                    </Box>
                  )}

                  {order.shippingAddress && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Shipping Address:</strong>{" "}
                        {order.shippingAddress}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancel Order Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to cancel order #{selectedOrder?.orderNumber}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Keep Order</Button>
          <Button
            onClick={handleCancelOrder}
            color="error"
            variant="contained"
            disabled={cancelling}
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyOrders;
