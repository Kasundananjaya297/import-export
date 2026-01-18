/** @format */

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { complaintService, CreateComplaintData, Complaint } from "../../services/complaintService";
import { orderService, Order } from "../../services/orderService";

const SubmitComplaint: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [formData, setFormData] = useState<CreateComplaintData>({
    orderid: 0,
    subject: "",
    description: "",
    category: "",
    priority: "Medium",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [ordersData, complaintsData] = await Promise.all([
        orderService.getBuyerOrders(),
        complaintService.getBuyerComplaints(),
      ]);
      console.log("Orders fetched:", ordersData);
      console.log("Complaints fetched:", complaintsData);
      setOrders(ordersData);
      setComplaints(complaintsData);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      enqueueSnackbar(
        error.response?.data?.message || "Failed to load data", 
        { variant: "error" }
      );
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.orderid || formData.orderid === 0) {
      newErrors.orderid = "Please select an order";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      enqueueSnackbar("Please fix the errors in the form", { variant: "error" });
      return;
    }

    try {
      setLoading(true);
      await complaintService.createComplaint(formData);
      enqueueSnackbar("Complaint submitted successfully", { variant: "success" });
      
      // Reset form
      setFormData({
        orderid: 0,
        subject: "",
        description: "",
        category: "",
        priority: "Medium",
      });
      setErrors({});
      
      // Refresh complaints list
      fetchData();
    } catch (error: any) {
      console.error("Error submitting complaint:", error);
      enqueueSnackbar(
        error.response?.data?.message || "Failed to submit complaint",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateComplaintData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "error";
      case "in_progress":
        return "warning";
      case "resolved":
        return "success";
      case "closed":
        return "default";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "error";
      case "High":
        return "warning";
      case "Medium":
        return "info";
      case "Low":
        return "default";
      default:
        return "default";
    }
  };

  const viewComplaintDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setDetailsOpen(true);
  };

  if (loadingData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Submit Complaint
      </Typography>

      <Grid container spacing={3}>
        {/* Complaint Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              New Complaint
            </Typography>
            
            {loadingData ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : orders.length === 0 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                You don't have any orders yet. Please place an order before submitting a complaint.
              </Alert>
            ) : (
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <FormControl fullWidth margin="normal" error={!!errors.orderid}>
                  <InputLabel>Select Order</InputLabel>
                  <Select
                    value={formData.orderid}
                    label="Select Order"
                    onChange={(e) => handleChange("orderid", e.target.value)}
                  >
                    <MenuItem value={0}>
                      <em>Select an order</em>
                    </MenuItem>
                    {orders.map((order) => (
                      <MenuItem key={order.id} value={order.id}>
                        <Box>
                          <Typography variant="body2">
                            Order #{order.orderNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.product?.name} - {order.quantity} {order.product?.unit} - Status: {order.status}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.orderid && (
                    <Typography variant="caption" color="error">
                      {errors.orderid}
                    </Typography>
                  )}
                </FormControl>

              <FormControl fullWidth margin="normal" error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => handleChange("category", e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select a category</em>
                  </MenuItem>
                  <MenuItem value="Product Quality">Product Quality</MenuItem>
                  <MenuItem value="Shipping Delay">Shipping Delay</MenuItem>
                  <MenuItem value="Damaged Product">Damaged Product</MenuItem>
                  <MenuItem value="Wrong Product">Wrong Product</MenuItem>
                  <MenuItem value="Payment Issue">Payment Issue</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error">
                    {errors.category}
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => handleChange("priority", e.target.value)}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Subject"
                margin="normal"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                error={!!errors.subject}
                helperText={errors.subject || "Brief summary of your complaint"}
                required
              />

              <TextField
                fullWidth
                label="Description"
                margin="normal"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                error={!!errors.description}
                helperText={errors.description || "Detailed description of the issue"}
                required
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading || orders.length === 0}
              >
                {loading ? <CircularProgress size={24} /> : "Submit Complaint"}
              </Button>
            </Box>
            )}
          </Paper>
        </Grid>

        {/* My Complaints List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              My Complaints
            </Typography>
            {loadingData ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : complaints.length === 0 ? (
              <Alert severity="info">No complaints submitted yet</Alert>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order / Product</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {complaints.map((complaint) => (
                      <TableRow key={complaint.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            #{complaint.order?.orderNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {complaint.order?.product?.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {complaint.subject}
                          </Typography>
                          <Chip
                            label={complaint.priority}
                            color={getPriorityColor(complaint.priority) as any}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={complaint.status.replace('_', ' ')}
                            color={getStatusColor(complaint.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => viewComplaintDetails(complaint)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Complaint Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Complaint Details
          <IconButton
            onClick={() => setDetailsOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedComplaint && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Order
                </Typography>
                <Typography variant="body1">
                  #{selectedComplaint.order?.orderNumber}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Product
                </Typography>
                <Typography variant="body1">
                  {selectedComplaint.order?.product?.name || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Seller
                </Typography>
                <Typography variant="body1">
                  {selectedComplaint.seller?.company || selectedComplaint.seller?.fname + ' ' + selectedComplaint.seller?.lname || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1">{selectedComplaint.category}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Priority
                </Typography>
                <Chip
                  label={selectedComplaint.priority}
                  color={getPriorityColor(selectedComplaint.priority) as any}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Subject
                </Typography>
                <Typography variant="body1">{selectedComplaint.subject}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">{selectedComplaint.description}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={selectedComplaint.status}
                  color={getStatusColor(selectedComplaint.status) as any}
                />
              </Grid>
              {selectedComplaint.resolution && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Resolution
                  </Typography>
                  <Typography variant="body1">{selectedComplaint.resolution}</Typography>
                </Grid>
              )}
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body2">
                  {new Date(selectedComplaint.createdAt).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Updated
                </Typography>
                <Typography variant="body2">
                  {new Date(selectedComplaint.updatedAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubmitComplaint;