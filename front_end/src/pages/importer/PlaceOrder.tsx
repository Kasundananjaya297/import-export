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
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Visibility,
  VisibilityOff,
  Inventory as InventoryIcon,
  CreditCard as CreditCardIcon,
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
  "Payment Details",
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
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [currentStock, setCurrentStock] = useState<number>(0);

  // Form data
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [useSameAddress, setUseSameAddress] = useState(true);

  // Payment form data
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  // [ADDED FOR REQUIREMENT COMPLETION]: order preview state
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [showOrderPreview, setShowOrderPreview] = useState(false);

  // Credit card validation functions
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const validateCardNumber = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return "Card number must be between 13 and 19 digits";
    }

    // Luhn algorithm for card validation
    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0 ? "" : "Invalid card number";
  };

  const validateExpiryDate = (expiryDate: string) => {
    if (!expiryDate) return "Expiry date is required";

    const [month, year] = expiryDate.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expMonth < 1 || expMonth > 12) {
      return "Invalid month";
    }

    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      return "Card has expired";
    }

    return "";
  };

  const validateCVV = (cvv: string) => {
    if (!cvv) return "CVV is required";
    if (cvv.length < 3 || cvv.length > 4) {
      return "CVV must be 3 or 4 digits";
    }
    if (!/^\d+$/.test(cvv)) {
      return "CVV must contain only numbers";
    }
    return "";
  };

  // Fetch product details and current stock
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
        setCurrentStock(productData.quantity);
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

  // [ADDED FOR REQUIREMENT COMPLETION]: simplified stock updates without automatic quantity updates
  useEffect(() => {
    const updateStock = async () => {
      if (!productId) return;

      try {
        const currentStockLevel = await productService.getProductStockLevel(
          parseInt(productId),
        );
        setCurrentStock(currentStockLevel);
      } catch (error) {
        console.error("Error updating stock:", error);
      }
    };

    // Update stock every 30 seconds (read-only)
    const interval = setInterval(updateStock, 30000);
    return () => clearInterval(interval);
  }, [productId]);

  // Check availability when quantity changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (!product || !quantity || parseInt(quantity) <= 0) {
        setAvailabilityChecked(false);
        return;
      }

      try {
        const isAvailable = await productService.checkProductAvailability(
          product.id,
          parseInt(quantity),
        );
        setAvailabilityChecked(true);

        if (!isAvailable) {
          setErrors((prev) => ({
            ...prev,
            quantity: `Only ${currentStock} ${product.unit} available in stock`,
          }));
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.quantity;
            return newErrors;
          });
        }
      } catch (error) {
        console.error("Error checking availability:", error);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [quantity, product, currentStock]);

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
        if (product && parseInt(quantity) > currentStock) {
          newErrors.quantity = `Only ${currentStock} ${product.unit} available in stock`;
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

      case 3: // Payment Details
        if (paymentMethod === "credit_card") {
          const cardError = validateCardNumber(cardNumber);
          if (cardError) newErrors.cardNumber = cardError;

          const expiryError = validateExpiryDate(expiryDate);
          if (expiryError) newErrors.expiryDate = expiryError;

          const cvvError = validateCVV(cvv);
          if (cvvError) newErrors.cvv = cvvError;

          if (!cardholderName)
            newErrors.cardholderName = "Cardholder name is required";
        } else if (paymentMethod === "bank_transfer") {
          if (!bankAccount)
            newErrors.bankAccount = "Bank account number is required";
          if (!routingNumber)
            newErrors.routingNumber = "Routing number is required";
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
      // Final availability check before order
      const isAvailable = await productService.checkProductAvailability(
        product.id,
        orderSummary.quantity,
      );

      if (!isAvailable) {
        throw new Error(
          `Only ${currentStock} ${product.unit} available in stock`,
        );
      }

      // Format shipping address as a string for backend
      const formattedShippingAddress = `${shippingAddress.line1}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}, ${shippingAddress.country}`;

      const orderData: CreateOrderData = {
        productId: product.id,
        quantity: orderSummary.quantity,
        unitPrice: orderSummary.unitPrice,
        shippingAddress: formattedShippingAddress,
        paymentMethod,
        notes,
      };

      const order = await orderService.createOrder(orderData);

      // [ADDED FOR REQUIREMENT COMPLETION]: show order preview
      setCreatedOrder(order);
      setShowOrderPreview(true);
      enqueueSnackbar("Order placed successfully!", { variant: "success" });
    } catch (err: any) {
      console.error("Error placing order:", err);
      setError(err.message || "Failed to place order. Please try again.");
      enqueueSnackbar(err.message || "Failed to place order", {
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleShippingAddressChange = (
    field: keyof typeof shippingAddress,
    value: string,
  ) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
    if (useSameAddress) {
      setBillingAddress((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Handle card number formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);

    // Clear error when user starts typing
    if (errors.cardNumber) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.cardNumber;
        return newErrors;
      });
    }
  };

  // Handle expiry date formatting
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);

    // Clear error when user starts typing
    if (errors.expiryDate) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.expiryDate;
        return newErrors;
      });
    }
  };

  // Handle CVV change
  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(value);

    // Clear error when user starts typing
    if (errors.cvv) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.cvv;
        return newErrors;
      });
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

                        {/* Real-time Stock Information */}
                        <Box
                          sx={{ mt: 2, display: "flex", alignItems: "center" }}
                        >
                          <InventoryIcon
                            sx={{ mr: 1, color: "primary.main" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Current Stock: {currentStock} {product.unit}
                          </Typography>
                        </Box>
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
                        `Minimum order: ${product.minOrderQuantity} ${product.unit} | Available: ${currentStock} ${product.unit}`
                      }
                      InputProps={{
                        inputProps: {
                          min: product.minOrderQuantity,
                          max: currentStock,
                        },
                      }}
                      sx={{ mb: 2 }}
                    />

                    {/* Stock Status */}
                    {availabilityChecked && (
                      <Alert
                        severity={
                          parseInt(quantity) <= currentStock
                            ? "success"
                            : "error"
                        }
                        sx={{ mb: 2 }}
                      >
                        {parseInt(quantity) <= currentStock
                          ? `${currentStock - parseInt(quantity)} ${
                              product.unit
                            } will remain in stock`
                          : `Only ${currentStock} ${product.unit} available`}
                      </Alert>
                    )}

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

            {/* Step 3: Payment Details */}
            {activeStep === 3 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Payment Details
                </Typography>

                {paymentMethod === "credit_card" && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        error={!!errors.cardNumber}
                        helperText={
                          errors.cardNumber || "Enter 16-digit card number"
                        }
                        placeholder="1234 5678 9012 3456"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CreditCardIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        error={!!errors.expiryDate}
                        helperText={errors.expiryDate || "MM/YY"}
                        placeholder="MM/YY"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        type={showPassword ? "text" : "password"}
                        value={cvv}
                        onChange={handleCVVChange}
                        error={!!errors.cvv}
                        helperText={errors.cvv || "3 or 4 digits"}
                        placeholder="123"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Cardholder Name"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        error={!!errors.cardholderName}
                        helperText={errors.cardholderName}
                        placeholder="John Doe"
                      />
                    </Grid>
                  </Grid>
                )}

                {paymentMethod === "bank_transfer" && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bank Account Number"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        error={!!errors.bankAccount}
                        helperText={errors.bankAccount}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Routing Number"
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        error={!!errors.routingNumber}
                        helperText={errors.routingNumber}
                      />
                    </Grid>
                  </Grid>
                )}

                {paymentMethod === "paypal" && (
                  <Box>
                    <Alert severity="info">
                      You will be redirected to PayPal to complete your payment
                      after order confirmation.
                    </Alert>
                  </Box>
                )}

                {paymentMethod === "letter_of_credit" && (
                  <Box>
                    <Alert severity="info">
                      Letter of Credit details will be handled separately by our
                      trade finance team.
                    </Alert>
                  </Box>
                )}
              </Box>
            )}

            {/* Step 4: Review & Confirm */}
            {activeStep === 4 && (
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
                        <Typography variant="body2" color="text.secondary">
                          Stock after order: {currentStock - parseInt(quantity)}{" "}
                          {product.unit}
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

      {/* [ADDED FOR REQUIREMENT COMPLETION]: Order Preview Modal */}
      <Dialog
        open={showOrderPreview}
        onClose={() => setShowOrderPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" color="success.main">
              ✅ Order Placed Successfully!
            </Typography>
            <Chip
              label={createdOrder?.orderNumber || "Order"}
              color="primary"
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {createdOrder && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                {/* Order Details */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Order Details
                  </Typography>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Order Number:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {createdOrder.orderNumber}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Status:</Typography>
                      <Chip
                        label={createdOrder.status}
                        color={
                          createdOrder.status === "pending"
                            ? "warning"
                            : "success"
                        }
                        size="small"
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Payment Status:</Typography>
                      <Chip
                        label={createdOrder.paymentStatus}
                        color={
                          createdOrder.paymentStatus === "pending"
                            ? "warning"
                            : "success"
                        }
                        size="small"
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Total Amount:</Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="primary"
                      >
                        ${parseFloat(createdOrder.totalAmount).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Payment Method:</Typography>
                      <Typography variant="body2">
                        {createdOrder.paymentMethod
                          ?.replace("_", " ")
                          .toUpperCase()}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                {/* Product Details */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Product Information
                  </Typography>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Product:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {product?.name}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Quantity:</Typography>
                      <Typography variant="body2">
                        {createdOrder.quantity} {product?.unit}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Unit Price:</Typography>
                      <Typography variant="body2">
                        ${parseFloat(createdOrder.unitPrice).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Shipping Address:</Typography>
                      <Typography variant="body2" sx={{ maxWidth: "60%" }}>
                        {createdOrder.shippingAddress}
                      </Typography>
                    </Box>
                    {createdOrder.notes && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">Notes:</Typography>
                        <Typography variant="body2" sx={{ maxWidth: "60%" }}>
                          {createdOrder.notes}
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2">Subtotal:</Typography>
                          <Typography variant="body2">
                            $
                            {(
                              parseFloat(createdOrder.unitPrice) *
                              createdOrder.quantity
                            ).toFixed(2)}
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
                            ${orderSummary?.shipping.toFixed(2)}
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
                            ${orderSummary?.tax.toFixed(2)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Divider sx={{ my: 1 }} />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="h6" fontWeight="bold">
                            Total:
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary"
                          >
                            ${parseFloat(createdOrder.totalAmount).toFixed(2)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button variant="outlined" onClick={() => setShowOrderPreview(false)}>
            Continue Shopping
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowOrderPreview(false);
              navigate(`/importer/payment/${createdOrder.id}`);
            }}
          >
            Proceed to Payment
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setShowOrderPreview(false);
              navigate("/importer/orders");
            }}
          >
            View My Orders
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlaceOrder;
