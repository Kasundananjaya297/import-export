/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  FormHelperText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { productService, Product } from "../../services/productService";
import {
  orderService,
  CreateOrderData,
  ShippingAddress,
  BillingAddress,
} from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";

const steps = [
  "Product Details",
  "Order Information",
  "Shipping & Billing",
  "Review & Confirm",
];

const PlaceOrder: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useAuth();

  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [useSameAddress, setUseSameAddress] = useState(true);

  // Address data - structured fields
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "USA",
    postalCode: "",
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "USA",
    postalCode: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID is required");
        setLoading(false);
        return;
      }

      try {
        const productData = await productService.getProductById(productId);
        setProduct(productData);
        setQuantity(productData.minOrderQuantity.toString());
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Calculate order summary
  const calculateOrderSummary = () => {
    if (!product || !quantity) return null;

    const qty = parseInt(quantity);
    const price = parseFloat(product.price);
    const subtotal = qty * price;
    const shipping = 50; // Fixed shipping cost
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return {
      quantity: qty,
      unitPrice: price,
      subtotal,
      shipping,
      tax,
      total,
    };
  };

  const orderSummary = calculateOrderSummary();

  // Validation functions
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Product Details
        if (
          !quantity ||
          parseInt(quantity) < (product?.minOrderQuantity || 1)
        ) {
          newErrors.quantity = `Minimum order quantity is ${
            product?.minOrderQuantity || 1
          }`;
        }
        break;

      case 1: // Order Information
        if (!paymentMethod) {
          newErrors.paymentMethod = "Payment method is required";
        }
        break;

      case 2: // Shipping & Billing
        if (!shippingAddress.line1)
          newErrors.shippingLine1 = "Shipping address line 1 is required";
        if (!shippingAddress.city)
          newErrors.shippingCity = "Shipping city is required";
        if (!shippingAddress.state)
          newErrors.shippingState = "Shipping state is required";
        if (!shippingAddress.postalCode)
          newErrors.shippingPostalCode = "Shipping postal code is required";

        if (!useSameAddress) {
          if (!billingAddress.line1)
            newErrors.billingLine1 = "Billing address line 1 is required";
          if (!billingAddress.city)
            newErrors.billingCity = "Billing city is required";
          if (!billingAddress.state)
            newErrors.billingState = "Billing state is required";
          if (!billingAddress.postalCode)
            newErrors.billingPostalCode = "Billing postal code is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!product || !orderSummary) return;

    setSubmitting(true);
    setError("");

    try {
      const orderData: CreateOrderData = {
        productId: product.id,
        quantity: orderSummary.quantity,
        unitPrice: orderSummary.unitPrice,
        shippingAddress,
        paymentMethod,
        notes,
      };

      const order = await orderService.createOrder(orderData);

      enqueueSnackbar("Order placed successfully!", { variant: "success" });
      navigate(`/importer/payment/${order.id}`);
    } catch (err: any) {
      console.error("Error placing order:", err);
      setError(
        err.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
      enqueueSnackbar("Failed to place order", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleShippingAddressChange = (
    field: keyof ShippingAddress,
    value: string,
  ) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
    if (useSameAddress) {
      setBillingAddress((prev) => ({ ...prev, [field]: value }));
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
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !product) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/importer/catalog")}
        >
          Back to Catalog
        </Button>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box>
        <Alert severity="error">Product not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Place Order
      </Typography>

      {/* Stepper */}
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Grid container spacing={3}>
        {/* Main Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Step 0: Product Details */}
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Product Details
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={
                          product.images && product.images.length > 0
                            ? product.images[0]
                            : "https://via.placeholder.com/300x200?text=No+Image"
                        }
                        alt={product.name}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {product.description}
                        </Typography>
                        <Chip
                          label={product.category}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={`Origin: ${product.origin}`}
                          size="small"
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      error={!!errors.quantity}
                      helperText={
                        errors.quantity ||
                        `Minimum order: ${product.minOrderQuantity} ${product.unit}`
                      }
                      InputProps={{
                        inputProps: { min: product.minOrderQuantity },
                      }}
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Notes (Optional)"
                      multiline
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requirements or notes..."
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Step 1: Order Information */}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Payment Method
                </Typography>

                <FormControl fullWidth error={!!errors.paymentMethod}>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={paymentMethod}
                    label="Payment Method"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <MenuItem value="credit_card">Credit Card</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="letter_of_credit">
                      Letter of Credit
                    </MenuItem>
                    <MenuItem value="paypal">PayPal</MenuItem>
                  </Select>
                  {errors.paymentMethod && (
                    <FormHelperText>{errors.paymentMethod}</FormHelperText>
                  )}
                </FormControl>
              </Box>
            )}

            {/* Step 2: Shipping & Billing */}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Shipping & Billing Address
                </Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useSameAddress}
                      onChange={(e) => setUseSameAddress(e.target.checked)}
                    />
                  }
                  label="Use same address for billing"
                  sx={{ mb: 3 }}
                />

                <Grid container spacing={3}>
                  {/* Shipping Address */}
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, display: "flex", alignItems: "center" }}
                    >
                      <ShippingIcon sx={{ mr: 1 }} />
                      Shipping Address
                    </Typography>

                    <TextField
                      fullWidth
                      label="Address Line 1"
                      value={shippingAddress.line1}
                      onChange={(e) =>
                        handleShippingAddressChange("line1", e.target.value)
                      }
                      error={!!errors.shippingLine1}
                      helperText={errors.shippingLine1}
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Address Line 2 (Optional)"
                      value={shippingAddress.line2}
                      onChange={(e) =>
                        handleShippingAddressChange("line2", e.target.value)
                      }
                      sx={{ mb: 2 }}
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="City"
                          value={shippingAddress.city}
                          onChange={(e) =>
                            handleShippingAddressChange("city", e.target.value)
                          }
                          error={!!errors.shippingCity}
                          helperText={errors.shippingCity}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="State"
                          value={shippingAddress.state}
                          onChange={(e) =>
                            handleShippingAddressChange("state", e.target.value)
                          }
                          error={!!errors.shippingState}
                          helperText={errors.shippingState}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Postal Code"
                          value={shippingAddress.postalCode}
                          onChange={(e) =>
                            handleShippingAddressChange(
                              "postalCode",
                              e.target.value,
                            )
                          }
                          error={!!errors.shippingPostalCode}
                          helperText={errors.shippingPostalCode}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Country"
                          value={shippingAddress.country}
                          onChange={(e) =>
                            handleShippingAddressChange(
                              "country",
                              e.target.value,
                            )
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Billing Address */}
                  {!useSameAddress && (
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle1"
                        sx={{ mb: 2, display: "flex", alignItems: "center" }}
                      >
                        <PaymentIcon sx={{ mr: 1 }} />
                        Billing Address
                      </Typography>

                      <TextField
                        fullWidth
                        label="Address Line 1"
                        value={billingAddress.line1}
                        onChange={(e) =>
                          setBillingAddress((prev) => ({
                            ...prev,
                            line1: e.target.value,
                          }))
                        }
                        error={!!errors.billingLine1}
                        helperText={errors.billingLine1}
                        sx={{ mb: 2 }}
                      />

                      <TextField
                        fullWidth
                        label="Address Line 2 (Optional)"
                        value={billingAddress.line2}
                        onChange={(e) =>
                          setBillingAddress((prev) => ({
                            ...prev,
                            line2: e.target.value,
                          }))
                        }
                        sx={{ mb: 2 }}
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="City"
                            value={billingAddress.city}
                            onChange={(e) =>
                              setBillingAddress((prev) => ({
                                ...prev,
                                city: e.target.value,
                              }))
                            }
                            error={!!errors.billingCity}
                            helperText={errors.billingCity}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="State"
                            value={billingAddress.state}
                            onChange={(e) =>
                              setBillingAddress((prev) => ({
                                ...prev,
                                state: e.target.value,
                              }))
                            }
                            error={!!errors.billingState}
                            helperText={errors.billingState}
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Postal Code"
                            value={billingAddress.postalCode}
                            onChange={(e) =>
                              setBillingAddress((prev) => ({
                                ...prev,
                                postalCode: e.target.value,
                              }))
                            }
                            error={!!errors.billingPostalCode}
                            helperText={errors.billingPostalCode}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Country"
                            value={billingAddress.country}
                            onChange={(e) =>
                              setBillingAddress((prev) => ({
                                ...prev,
                                country: e.target.value,
                              }))
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Step 3: Review & Confirm */}
            {activeStep === 3 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Review Order Details
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Product Information
                    </Typography>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {product.description}
                        </Typography>
                        <Typography variant="body2">
                          Quantity: {quantity} {product.unit}
                        </Typography>
                        <Typography variant="body2">
                          Unit Price: ${parseFloat(product.price).toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Payment & Shipping
                    </Typography>
                    <Card>
                      <CardContent>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Payment Method:{" "}
                          {paymentMethod.replace("_", " ").toUpperCase()}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Shipping Address: {shippingAddress.line1},{" "}
                          {shippingAddress.city}, {shippingAddress.state}
                        </Typography>
                        {!useSameAddress && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Billing Address: {billingAddress.line1},{" "}
                            {billingAddress.city}, {billingAddress.state}
                          </Typography>
                        )}
                        {notes && (
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Notes: {notes}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>

              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                    startIcon={
                      submitting ? (
                        <CircularProgress size={20} />
                      ) : (
                        <CheckCircleIcon />
                      )
                    }
                  >
                    {submitting ? "Placing Order..." : "Place Order"}
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Order Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography
              variant="h6"
              sx={{ mb: 3, display: "flex", alignItems: "center" }}
            >
              <ShoppingCartIcon sx={{ mr: 1 }} />
              Order Summary
            </Typography>

            {orderSummary && (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {orderSummary.quantity} {product.unit}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unit Price: ${orderSummary.unitPrice.toFixed(2)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Subtotal:</Typography>
                    <Typography variant="body2">
                      ${orderSummary.subtotal.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Shipping:</Typography>
                    <Typography variant="body2">
                      ${orderSummary.shipping.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Tax (8%):</Typography>
                    <Typography variant="body2">
                      ${orderSummary.tax.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Total:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ${orderSummary.total.toFixed(2)}
                  </Typography>
                </Box>

                {paymentMethod && (
                  <Chip
                    label={`Payment: ${paymentMethod
                      .replace("_", " ")
                      .toUpperCase()}`}
                    color="primary"
                    variant="outlined"
                    sx={{ width: "100%" }}
                  />
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlaceOrder;
