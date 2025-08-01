/** @format */

import { Request, Response } from "express";
import * as orderRepo from "../repos/orderRepo";
import * as productRepo from "../repos/productRepo";
import * as userRepo from "../repos/userRepo";

export const orderController = {
  async createOrder(req: Request, res: Response) {
    try {
      const {
        productId,
        quantity,
        unitPrice,
        shippingAddress,
        paymentMethod,
        notes,
      } = req.body;

      // Validate required fields
      if (
        !productId ||
        !quantity ||
        !unitPrice ||
        !shippingAddress ||
        !paymentMethod
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: productId, quantity, unitPrice, shippingAddress, paymentMethod",
        });
      }

      // Get buyer ID from authenticated user
      const buyerId = (req as any).user.id;

      // Get product details to find seller
      const product = await productRepo.getProductById(Number(productId));
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const sellerId = product.userId;
      const totalAmount = parseFloat(unitPrice) * parseInt(quantity);

      const orderData = {
        productId: Number(productId),
        buyerId,
        sellerId,
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice),
        totalAmount,
        shippingAddress,
        paymentMethod,
        notes: notes || "",
      };

      const order = await orderRepo.createOrder(orderData);

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating order",
      });
    }
  },

  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await orderRepo.getAllOrders();
      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching orders",
      });
    }
  },

  async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await orderRepo.getOrderById(Number(id));

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching order",
      });
    }
  },

  async getOrdersByBuyerId(req: Request, res: Response) {
    try {
      const buyerId = (req as any).user.id;
      const orders = await orderRepo.getOrdersByBuyerId(buyerId);

      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error("Error fetching buyer orders:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching buyer orders",
      });
    }
  },

  async getOrdersBySellerId(req: Request, res: Response) {
    try {
      const sellerId = (req as any).user.id;
      const orders = await orderRepo.getOrdersBySellerId(sellerId);

      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching seller orders",
      });
    }
  },

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const order = await orderRepo.updateOrderStatus(Number(id), status);

      res.json({
        success: true,
        message: "Order status updated successfully",
        data: order,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({
        success: false,
        message: "Error updating order status",
      });
    }
  },

  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      if (!paymentStatus) {
        return res.status(400).json({
          success: false,
          message: "Payment status is required",
        });
      }

      const order = await orderRepo.updatePaymentStatus(
        Number(id),
        paymentStatus,
      );

      res.json({
        success: true,
        message: "Payment status updated successfully",
        data: order,
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({
        success: false,
        message: "Error updating payment status",
      });
    }
  },

  async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await orderRepo.getOrderById(Number(id));

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      await orderRepo.deleteOrder(order);

      res.json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting order",
      });
    }
  },
};
