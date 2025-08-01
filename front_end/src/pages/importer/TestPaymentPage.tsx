/** @format */

import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";

const TestPaymentPage: React.FC = () => {
  const { orderId } = useParams();

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Test Payment Page
      </Typography>

      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Route Test Successful!
        </Typography>
        <Typography variant="body1">Order ID from URL: {orderId}</Typography>
        <Typography variant="body1">
          This page is accessible without authentication.
        </Typography>
        <Typography variant="body1">
          If you can see this, the routing is working correctly.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TestPaymentPage;
