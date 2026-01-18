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
  Divider,
} from "@mui/material";
import { Search, Cancel, Refresh, Payment } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { orderService, Order } from "../../services/orderService";
import OrderDetailsModal from "../../components/common/OrderDetailsModal";

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
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
      setError(""); // Clear previous errors
      const ordersData = await orderService.getBuyerOrders();
      setOrders(ordersData);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      const errorMessage = err.response?.data?.message || "Failed to fetch orders";
      setError(errorMessage);
      
      // If it's an auth error, show a specific message
      if (err.response?.status === 401) {
        enqueueSnackbar("Session expired. Please log out and log in again.", { 
          variant: "error",
          autoHideDuration: 5000 
        });
      } else {
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
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
    // Cannot cancel if confirmed, shipped, delivered or cancelled
    if (order.status === "confirmed" || order.status === "shipped" || order.status === "delivered" || order.status === "cancelled") {
      enqueueSnackbar("This order cannot be cancelled", { variant: "warning" });
      return;
    }
    setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

  const handleCompletePayment = async () => {
    if (!selectedOrder) return;

    try {
      setProcessingPayment(true);
      // Update payment status to 'paid' in the database
      await orderService.updatePaymentStatus(selectedOrder.id, "paid");

      // Update the order in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, paymentStatus: "paid" }
            : order,
        ),
      );

      enqueueSnackbar("Payment completed successfully", {
        variant: "success",
      });
      setPaymentDialogOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error("Error completing payment:", err);
      enqueueSnackbar(err.response?.data?.message || "Failed to complete payment", {
        variant: "error",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const openPaymentDialog = (order: Order) => {
    // Check if order is confirmed
    if (order.status !== "confirmed") {
      enqueueSnackbar("Order must be confirmed before payment", { variant: "warning" });
      return;
    }
    // Check if already paid
    if (order.paymentStatus === "paid") {
      enqueueSnackbar("This order is already paid", { variant: "info" });
      return;
    }
    setSelectedOrder(order);
    setPaymentDialogOpen(true);
  };

  const handleOrderClick = (order: Order) => {
    // Open order details modal
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
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
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
                onClick={() => handleOrderClick(order)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Product Image */}
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        height="160"
                        image={
                          order.product?.images &&
                          order.product.images.length > 0
                            ? order.product.images[0]
                            : "https://via.placeholder.com/200x160?text=No+Image"
                        }
                        alt={order.product?.name || "Product"}
                        sx={{ 
                          objectFit: "cover", 
                          borderRadius: 2,
                          boxShadow: 2
                        }}
                      />
                    </Grid>

                    {/* Order Details */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                        {order.product?.name || "Product"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ fontWeight: 'medium', fontSize: '0.95rem' }}
                      >
                        Order #{order.orderNumber}
                      </Typography>
                      <Divider sx={{ my: 1.5 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <strong>Quantity:</strong> {order.quantity} {order.product?.unit || "piece"}
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <strong>Unit Price:</strong> ${Number(order.unitPrice).toFixed(2)}
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <strong>Order Date:</strong>{" "}
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric'
                          })}
                        </Typography>
                        {order.seller && (
                          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <strong>Seller:</strong> {order.seller.fname} {order.seller.lname} ()
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    {/* Status and Actions */}
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1.5 }}>
                        {/* Status Badges */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status) as any}
                            sx={{ 
                              fontWeight: 'bold',
                              textTransform: 'capitalize',
                              px: 1.5
                            }}
                          />
                          <Chip
                            label={order.paymentStatus}
                            color={
                              getPaymentStatusColor(order.paymentStatus) as any
                            }
                            sx={{ 
                              fontWeight: 'bold',
                              textTransform: 'capitalize',
                              px: 1.5
                            }}
                          />
                        </Box>
                        
                        {/* Total Price */}
                        <Typography 
                          variant="h4" 
                          color="primary" 
                          sx={{ 
                            fontWeight: 'bold',
                            mt: 1
                          }}
                        >
                          ${Number(order.totalAmount).toFixed(2)}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          {/* Payment Button */}
                          {order.paymentStatus === "pending" && (
                            <Tooltip title={order.status !== "confirmed" ? "Order must be confirmed first" : "Complete Payment"}>
                              <span>
                                <IconButton
                                  color="success"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openPaymentDialog(order);
                                  }}
                                  disabled={order.status !== "confirmed"}
                                >
                                  <Payment />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}

                          {/* Cancel Button */}
                          {order.status !== "delivered" &&
                            order.status !== "cancelled" && (
                              <Tooltip title={order.status === "confirmed" ? "Cannot cancel confirmed order" : "Cancel Order"}>
                                <span>
                                  <IconButton
                                    color="error"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openCancelDialog(order);
                                    }}
                                    disabled={order.status === "confirmed"}
                                  >
                                    <Cancel />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            )}
                        </Box>
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
                    <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <strong style={{ minWidth: '140px' }}>Shipping Address:</strong>{" "}
                        <span>
                          {typeof order.shippingAddress === "string"
                            ? (() => {
                                try {
                                  const addr = JSON.parse(order.shippingAddress);
                                  return `${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`;
                                } catch {
                                  return order.shippingAddress;
                                }
                              })()
                            : `${order.shippingAddress.line1}${order.shippingAddress.line2 ? ", " + order.shippingAddress.line2 : ""}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
                        </span>
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

      {/* Payment Confirmation Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
      >
        <DialogTitle>Complete Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Complete payment for order #{selectedOrder?.orderNumber}?
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            Amount: ${selectedOrder ? Number(selectedOrder.totalAmount).toFixed(2) : "0.00"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will mark the payment as completed in the system.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCompletePayment}
            color="success"
            variant="contained"
            disabled={processingPayment}
          >
            {processingPayment ? "Processing..." : "Complete Payment"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={orderDetailsOpen}
        onClose={() => {
          setOrderDetailsOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </Container>
  );
};

export default MyOrders;
