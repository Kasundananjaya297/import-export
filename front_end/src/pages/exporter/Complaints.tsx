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
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon, CheckCircle, Visibility } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { complaintService, Complaint } from "../../services/complaintService";

const Complaints: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [resolution, setResolution] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const complaintsData = await complaintService.getSellerComplaints();
      setComplaints(complaintsData);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      enqueueSnackbar("Failed to load complaints", { variant: "error" });
    } finally {
      setLoading(false);
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

  const openResolveDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status === "open" ? "in_progress" : complaint.status);
    setResolution(complaint.resolution || "");
    setResolveOpen(true);
  };

  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return;

    if (newStatus === "resolved" && !resolution.trim()) {
      enqueueSnackbar("Please provide a resolution", { variant: "error" });
      return;
    }

    try {
      setSubmitting(true);
      await complaintService.updateComplaint(selectedComplaint.id, {
        status: newStatus as any,
        resolution: resolution.trim() || undefined,
      });
      enqueueSnackbar("Complaint updated successfully", { variant: "success" });
      setResolveOpen(false);
      setSelectedComplaint(null);
      setResolution("");
      fetchComplaints();
    } catch (error: any) {
      console.error("Error updating complaint:", error);
      enqueueSnackbar(
        error.response?.data?.message || "Failed to update complaint",
        { variant: "error" }
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" component="h1">
            Complaints
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage customer complaints for your products
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No complaints found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>#{complaint.order?.orderNumber}</TableCell>
                  <TableCell>{complaint.subject}</TableCell>
                  <TableCell>{complaint.category}</TableCell>
                  <TableCell>
                    {complaint.buyer?.fname} {complaint.buyer?.lname}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={complaint.priority}
                      color={getPriorityColor(complaint.priority) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={complaint.status}
                      color={getStatusColor(complaint.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => viewComplaintDetails(complaint)}
                      title="View Details"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    {complaint.status !== "resolved" && complaint.status !== "closed" && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => openResolveDialog(complaint)}
                        title="Update Status"
                      >
                        <CheckCircle fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Order
                </Typography>
                <Typography variant="body1">
                  #{selectedComplaint.order?.orderNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Buyer
                </Typography>
                <Typography variant="body1">
                  {selectedComplaint.buyer?.fname} {selectedComplaint.buyer?.lname}
                  <br />
                  <Typography variant="caption">{selectedComplaint.buyer?.email}</Typography>
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
          {selectedComplaint && selectedComplaint.status !== "resolved" && selectedComplaint.status !== "closed" && (
            <Button onClick={() => { setDetailsOpen(false); openResolveDialog(selectedComplaint); }} color="primary">
              Update Status
            </Button>
          )}
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Resolve/Update Complaint Dialog */}
      <Dialog
        open={resolveOpen}
        onClose={() => setResolveOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Complaint Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Resolution / Notes"
              margin="normal"
              multiline
              rows={4}
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              helperText={newStatus === "resolved" ? "Required for resolved status" : "Optional notes"}
              required={newStatus === "resolved"}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResolveOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateComplaint}
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Complaints;
