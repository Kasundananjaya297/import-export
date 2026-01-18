/** @format */

import { Request, Response } from "express";
import * as complaintRepo from "../repos/complaintRepo";

export const complaintController = {
  async createComplaint(req: Request, res: Response) {
    try {
      const { orderid, subject, description, category, priority } = req.body;
      const buyerid = (req as any).user?.id;

      console.log("Creating complaint - User ID:", buyerid);
      console.log("Request body:", req.body);

      if (!buyerid) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      if (!orderid || !subject || !description || !category) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: orderid, subject, description, category",
        });
      }

      // Get seller ID from the order
      const Order = require("../models/orders").default;
      const order = await Order.findByPk(orderid);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      console.log("Order found:", order.id, "Seller ID:", order.sellerId);

      const complaint = await complaintRepo.createComplaint({
        orderid,
        buyerid,
        sellerid: order.sellerId,
        subject,
        description,
        category,
        priority: priority || 'Medium',
        status: 'open',
      });

      console.log("Complaint created successfully");

      res.status(201).json({
        success: true,
        message: "Complaint submitted successfully",
        data: complaint,
      });
    } catch (error) {
      console.error("Error creating complaint:", error);
      res.status(500).json({
        success: false,
        message: "Error creating complaint",
      });
    }
  },

  async getAllComplaints(req: Request, res: Response) {
    try {
      const complaints = await complaintRepo.getAllComplaints();
      res.json({
        success: true,
        data: complaints,
        count: complaints.length,
      });
    } catch (error) {
      console.error("Error fetching complaints:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching complaints",
      });
    }
  },

  async getComplaintById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const complaint = await complaintRepo.getComplaintById(Number(id));

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found",
        });
      }

      res.json({
        success: true,
        data: complaint,
      });
    } catch (error) {
      console.error("Error fetching complaint:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching complaint",
      });
    }
  },

  async getComplaintsByBuyerId(req: Request, res: Response) {
    try {
      const buyerid = (req as any).user?.id;
      console.log("Fetching complaints for buyer ID:", buyerid);
      
      if (!buyerid) {
        return res.status(400).json({
          success: false,
          message: "Buyer ID not found in token",
        });
      }
      
      const complaints = await complaintRepo.getComplaintsByBuyerId(buyerid);
      console.log("Fetched buyer complaints:", complaints?.length);

      res.json({
        success: true,
        data: complaints,
        count: complaints.length,
      });
    } catch (error: any) {
      console.error("Error fetching buyer complaints:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({
        success: false,
        message: "Error fetching buyer complaints",
        error: error.message,
      });
    }
  },

  async getComplaintsBySellerId(req: Request, res: Response) {
    try {
      const sellerid = (req as any).user?.id;
      console.log("Fetching complaints for seller ID:", sellerid);
      
      if (!sellerid) {
        return res.status(400).json({
          success: false,
          message: "Seller ID not found in token",
        });
      }
      
      const complaints = await complaintRepo.getComplaintsBySellerId(sellerid);
      console.log("Fetched complaints:", complaints?.length);

      res.json({
        success: true,
        data: complaints,
        count: complaints.length,
      });
    } catch (error: any) {
      console.error("Error fetching seller complaints:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({
        success: false,
        message: "Error fetching seller complaints",
        error: error.message,
      });
    }
  },

  async updateComplaint(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const complaint = await complaintRepo.updateComplaint(
        Number(id),
        updateData
      );

      res.json({
        success: true,
        message: "Complaint updated successfully",
        data: complaint,
      });
    } catch (error) {
      console.error("Error updating complaint:", error);
      res.status(500).json({
        success: false,
        message: "Error updating complaint",
      });
    }
  },

  async deleteComplaint(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await complaintRepo.deleteComplaint(Number(id));

      res.json({
        success: true,
        message: "Complaint deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting complaint:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting complaint",
      });
    }
  },
};
