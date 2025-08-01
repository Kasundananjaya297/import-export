/** @format */

import React from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Chip,
} from "@mui/material";
import {
  ShoppingCart,
  CheckCircle,
  LocalShipping,
  Home,
  Cancel,
} from "@mui/icons-material";

interface OrderTrackingProps {
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({
  status,
  paymentStatus,
  createdAt,
  updatedAt,
}) => {
  const steps = [
    {
      label: "Order Placed",
      description: "Order has been successfully placed",
      icon: <ShoppingCart />,
      completed: true,
      date: createdAt,
    },
    {
      label: "Payment",
      description: `Payment status: ${paymentStatus}`,
      icon: <CheckCircle />,
      completed: paymentStatus === "paid",
      date: paymentStatus === "paid" ? updatedAt : null,
    },
    {
      label: "Confirmed",
      description: "Order has been confirmed by seller",
      icon: <CheckCircle />,
      completed: ["confirmed", "shipped", "delivered"].includes(status),
      date: ["confirmed", "shipped", "delivered"].includes(status)
        ? updatedAt
        : null,
    },
    {
      label: "Shipped",
      description: "Order has been shipped",
      icon: <LocalShipping />,
      completed: ["shipped", "delivered"].includes(status),
      date: ["shipped", "delivered"].includes(status) ? updatedAt : null,
    },
    {
      label: "Delivered",
      description: "Order has been delivered",
      icon: <Home />,
      completed: status === "delivered",
      date: status === "delivered" ? updatedAt : null,
    },
  ];

  const cancelledStep = {
    label: "Cancelled",
    description: "Order has been cancelled",
    icon: <Cancel />,
    completed: status === "cancelled",
    date: status === "cancelled" ? updatedAt : null,
  };

  const displaySteps =
    status === "cancelled" ? [steps[0], cancelledStep] : steps;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Order Tracking
      </Typography>
      <Stepper orientation="vertical">
        {displaySteps.map((step, index) => (
          <Step key={index} active={step.completed} completed={step.completed}>
            <StepLabel
              icon={step.icon}
              sx={{
                "& .MuiStepLabel-iconContainer": {
                  color: step.completed ? "success.main" : "grey.400",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" fontWeight="medium">
                  {step.label}
                </Typography>
                {step.completed && (
                  <Chip
                    label="Completed"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Box>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {step.description}
              </Typography>
              {step.date && (
                <Typography variant="caption" color="text.secondary">
                  {new Date(step.date).toLocaleString()}
                </Typography>
              )}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

export default OrderTracking;
