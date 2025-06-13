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
} from "@mui/material";

const TransactionHistory: React.FC = () => {
  // Mock data - replace with actual data from your backend
  const transactions = [
    {
      id: 1,
      date: "2024-03-15",
      orderNumber: "ORD001",
      amount: 2599.0,
      type: "sale",
      status: "completed",
    },
    {
      id: 2,
      date: "2024-03-14",
      orderNumber: "ORD002",
      amount: 1550.0,
      type: "sale",
      status: "pending",
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Transaction History
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Order Number</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.orderNumber}</TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={transaction.type}
                    color={transaction.type === "sale" ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={transaction.status}
                    color={
                      transaction.status === "completed" ? "success" : "warning"
                    }
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

export default TransactionHistory;
