/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  LocalShipping as ShippingIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { orderService, Order } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";
import { useAuth } from "../../context/AuthContext";

const paymentSteps = [
  "Payment Submitted",
  "Payment Processing",
  "Payment Confirmed",
  "Order Confirmed by Seller",
  "Order in Production",
  "Order Shipped",
  "Order Delivered",
];

const PaymentPage: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, currentUser } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // [ADDED FOR REQUIREMENT COMPLETION]: debug logging
  console.log("PaymentPage rendered with orderId:", orderId);
  console.log("Authentication status:", isAuthenticated);
  console.log("Current user:", currentUser);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID is required");
        setLoading(false);
        return;
      }

      console.log("Fetching order with ID:", orderId);

      try {
        const orderData = await orderService.getOrderById(parseInt(orderId));
        console.log("Order data received:", orderData);
        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleProcessPayment = async () => {
    if (!order) return;

    setProcessingPayment(true);
    try {
      // Create payment record
      const paymentData = {
        orderId: order.id,
        amount: order.totalAmount,
        paymentMethod: paymentMethod,
        paymentDetails: {
          cardNumber: cardNumber.replace(/\s/g, "").slice(-4),
          expiryDate,
          paymentMethod,
        },
      };

      const payment = await paymentService.createPayment(paymentData);

      // Process the payment
      const processedPayment = await paymentService.processPayment(payment.id, {
        transactionId: `TXN_${Date.now()}`,
        paymentDetails: paymentData.paymentDetails,
      });

      // Refresh order data
      const updatedOrder = await orderService.getOrderById(order.id);
      setOrder(updatedOrder);

      enqueueSnackbar("Payment processed successfully!", {
        variant: "success",
      });
      setShowPaymentDialog(false);
    } catch (error: any) {
      console.error("Payment processing error:", error);
      enqueueSnackbar(
        error.response?.data?.message || "Payment processing failed",
        { variant: "error" },
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  const getCurrentStep = () => {
    if (!order) return 0;

    switch (order.status) {
      case "pending":
        return 1; // Payment Processing
      case "confirmed":
        return 3; // Order Confirmed by Seller
      case "shipped":
        return 5; // Order Shipped
      case "delivered":
        return 6; // Order Delivered
      default:
        return 0;
    }
  };

  const getPaymentStatusColor = () => {
    if (!order) return "default";

    switch (order.paymentStatus) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircleIcon color="success" />;
      case "pending":
        return <PendingIcon color="warning" />;
      case "failed":
        return <PaymentIcon color="error" />;
      default:
        return <PaymentIcon />;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          flexDirection: "column",
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading payment details for order {orderId}...
        </Typography>
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
          Payment & Order Status
        </Typography>

        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Order not found"}
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Debug Information:
          </Typography>
          <Typography variant="body2">Order ID from URL: {orderId}</Typography>
          <Typography variant="body2">
            Authentication Status:{" "}
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </Typography>
          <Typography variant="body2">
            Current User:{" "}
            {currentUser
              ? `${currentUser.fname} ${currentUser.lname}`
              : "No user"}
          </Typography>
          <Typography variant="body2">Error: {error}</Typography>
          <Typography variant="body2">
            Order data: {order ? "Found" : "Not found"}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate("/importer/orders")}
          sx={{ mr: 2 }}
        >
          Back to Orders
        </Button>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Payment & Order Status
      </Typography>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 4, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5">Order #{order.orderNumber}</Typography>
              <Chip
                label={order.paymentStatus.toUpperCase()}
                color={getPaymentStatusColor()}
                icon={getStatusIcon(order.paymentStatus)}
              />
            </Box>

            {/* Payment Status Stepper */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Payment & Order Timeline
              </Typography>
              <Stepper activeStep={getCurrentStep()} alternativeLabel>
                {paymentSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Current Status */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Current Status
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PaymentIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    Payment Status: {order.paymentStatus.toUpperCase()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <ShippingIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    Order Status: {order.status.toUpperCase()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <BusinessIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    Payment Method:{" "}
                    {order.paymentMethod.replace("_", " ").toUpperCase()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Who Needs to Confirm */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Payment Confirmation Parties
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PaymentIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Payment Processor"
                      secondary="Validates payment details and confirms transaction"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Exporter (Seller)"
                      secondary="Confirms order can be fulfilled and begins production"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AdminIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Platform Admin"
                      secondary="Monitors transactions and handles disputes"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Next Steps
                </Typography>
                {order.paymentStatus === "pending" && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Your payment is being processed. This usually takes 1-2
                    business days.
                  </Alert>
                )}
                {order.paymentStatus === "paid" &&
                  order.status === "pending" && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Payment confirmed! Waiting for seller to confirm order
                      fulfillment.
                    </Alert>
                  )}
                {order.status === "confirmed" && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Order confirmed by seller! Production has begun.
                  </Alert>
                )}
                {order.status === "shipped" && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Order has been shipped! Track your delivery.
                  </Alert>
                )}
                {order.status === "delivered" && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Order delivered successfully!
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Order Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Order Summary
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Order Date: {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Quantity: {order.quantity}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Unit Price: ${order.unitPrice.toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Total Amount: ${order.totalAmount.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Shipping Address:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.shippingAddress.line1}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.state} {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </Typography>
            </Box>

            {order.notes && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Notes:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.notes}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {order.paymentStatus === "pending" && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setShowPaymentDialog(true)}
                  sx={{ mb: 2 }}
                >
                  Process Payment
                </Button>
              )}
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate("/importer/orders")}
              >
                View All Orders
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/importer/catalog")}
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Payment Processing Dialog */}
      <Dialog
        open={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Process Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Order #{order?.orderNumber}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
              Total Amount: ${order?.totalAmount.toFixed(2)}
            </Typography>

            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="credit_card"
                  control={<Radio />}
                  label="Credit Card"
                />
                <FormControlLabel
                  value="debit_card"
                  control={<Radio />}
                  label="Debit Card"
                />
                <FormControlLabel
                  value="bank_transfer"
                  control={<Radio />}
                  label="Bank Transfer"
                />
              </RadioGroup>
            </FormControl>

            {paymentMethod.includes("card") && (
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            <Alert severity="info" sx={{ mb: 2 }}>
              This is a demo payment. No real charges will be made.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowPaymentDialog(false)}
            disabled={processingPayment}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProcessPayment}
            variant="contained"
            disabled={processingPayment}
          >
            {processingPayment ? "Processing..." : "Confirm Payment"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentPage;
