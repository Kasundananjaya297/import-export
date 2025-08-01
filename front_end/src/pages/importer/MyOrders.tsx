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
} from "@mui/material";
import { useSnackbar } from "notistack";
import StatusBadge from "../../components/common/StatusBadge";
import { orderService, Order } from "../../services/orderService";

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
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

    fetchOrders();
  }, [enqueueSnackbar]);

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
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No orders found
          </Typography>
          <Typography color="text.secondary">
            Your order history will appear here once you make a purchase.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
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
                    <Grid item xs={12} sm={6}>
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

                    {/* Status and Total */}
                    <Grid item xs={12} sm={3}>
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
                        <Typography variant="h6" color="primary">
                          ${order.totalAmount.toFixed(2)}
                        </Typography>
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
    </Container>
  );
};

export default MyOrders;
