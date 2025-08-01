/** @format */

import { Request, Response } from "express";
import * as paymentRepo from "../repos/paymentRepo";
import * as orderRepo from "../repos/orderRepo";

export const paymentController = {
  async createPayment(req: Request, res: Response) {
    try {
      const { orderId, amount, paymentMethod, paymentDetails } = req.body;

      // Validate required fields
      if (!orderId || !amount || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: orderId, amount, paymentMethod",
        });
      }

      // Check if order exists
      const order = await orderRepo.getOrderById(Number(orderId));
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Check if payment already exists for this order
      const existingPayment = await paymentRepo.getPaymentByOrderId(
        Number(orderId),
      );
      if (existingPayment) {
        return res.status(400).json({
          success: false,
          message: "Payment already exists for this order",
        });
      }

      const paymentData = {
        orderId: Number(orderId),
        amount: parseFloat(amount),
        paymentMethod,
        paymentDetails: paymentDetails || {},
        status: "pending",
      };

      const payment = await paymentRepo.createPayment(paymentData);

      res.status(201).json({
        success: true,
        message: "Payment created successfully",
        data: payment,
      });
    } catch (error) {
      console.error("Payment creation error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating payment",
      });
    }
  },

  async processPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const { transactionId, paymentDetails } = req.body;

      // Simulate payment processing
      const payment = await paymentRepo.getPaymentById(Number(paymentId));
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      // Simulate payment gateway processing
      const isPaymentSuccessful = Math.random() > 0.1; // 90% success rate

      if (isPaymentSuccessful) {
        // Update payment status to completed
        const updatedPayment = await paymentRepo.updatePaymentStatus(
          Number(paymentId),
          "completed",
          transactionId || `TXN_${Date.now()}`,
        );

        // Update order payment status using the orderId from the payment
        const orderId = updatedPayment.getDataValue("orderId");
        await orderRepo.updatePaymentStatus(orderId, "paid");

        res.json({
          success: true,
          message: "Payment processed successfully",
          data: updatedPayment,
        });
      } else {
        // Update payment status to failed
        const updatedPayment = await paymentRepo.updatePaymentStatus(
          Number(paymentId),
          "failed",
        );

        // Update order payment status using the orderId from the payment
        const orderId = updatedPayment.getDataValue("orderId");
        await orderRepo.updatePaymentStatus(orderId, "failed");

        res.status(400).json({
          success: false,
          message: "Payment processing failed",
          data: updatedPayment,
        });
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      res.status(500).json({
        success: false,
        message: "Error processing payment",
      });
    }
  },

  async getPaymentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await paymentRepo.getPaymentById(Number(id));

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching payment",
      });
    }
  },

  async getPaymentByOrderId(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const payment = await paymentRepo.getPaymentByOrderId(Number(orderId));

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found for this order",
        });
      }

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching payment",
      });
    }
  },

  async getAllPayments(req: Request, res: Response) {
    try {
      const payments = await paymentRepo.getAllPayments();
      res.json({
        success: true,
        data: payments,
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching payments",
      });
    }
  },

  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const payment = await paymentRepo.getPaymentById(Number(paymentId));
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      const updatedPayment = await paymentRepo.updatePaymentStatus(
        Number(paymentId),
        status,
      );

      res.json({
        success: true,
        message: "Payment status updated successfully",
        data: updatedPayment,
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({
        success: false,
        message: "Error updating payment status",
      });
    }
  },

  async refundPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const { reason } = req.body;

      const payment = await paymentRepo.getPaymentById(Number(paymentId));
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      // Check if payment is already refunded
      if (payment.getDataValue("status") === "refunded") {
        return res.status(400).json({
          success: false,
          message: "Payment is already refunded",
        });
      }

      // Update payment status to refunded
      const updatedPayment = await paymentRepo.updatePaymentStatus(
        Number(paymentId),
        "refunded",
      );

      // Update order payment status
      const orderId = updatedPayment.getDataValue("orderId");
      await orderRepo.updatePaymentStatus(orderId, "refunded");

      res.json({
        success: true,
        message: "Payment refunded successfully",
        data: updatedPayment,
      });
    } catch (error) {
      console.error("Error refunding payment:", error);
      res.status(500).json({
        success: false,
        message: "Error refunding payment",
      });
    }
  },
};
