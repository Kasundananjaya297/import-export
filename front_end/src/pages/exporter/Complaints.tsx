/** @format */

import React from "react";
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
} from "@mui/material";

const Complaints: React.FC = () => {
  // Mock data - replace with actual data from your backend
  const complaints = [
    {
      id: 1,
      orderNumber: "ORD001",
      subject: "Product Quality Issue",
      buyer: "Global Imports Inc",
      date: "2024-03-15",
      status: "open",
    },
    {
      id: 2,
      orderNumber: "ORD002",
      subject: "Shipping Delay",
      buyer: "Spice Traders Ltd",
      date: "2024-03-14",
      status: "resolved",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "error";
      case "in_progress":
        return "warning";
      case "resolved":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          Complaints
        </Typography>
        <Button variant="contained" color="primary">
          View All
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell>{complaint.orderNumber}</TableCell>
                <TableCell>{complaint.subject}</TableCell>
                <TableCell>{complaint.buyer}</TableCell>
                <TableCell>{complaint.date}</TableCell>
                <TableCell>
                  <Chip
                    label={complaint.status}
                    color={getStatusColor(complaint.status) as any}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Complaints;
