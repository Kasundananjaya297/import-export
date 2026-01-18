/** @format */

import express, { RequestHandler } from "express";
import { complaintController } from "../controllers/complaintController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Create a new complaint (buyer only)
router.post(
  "/create",
  verifyToken as RequestHandler,
  complaintController.createComplaint as RequestHandler
);

// Get all complaints (admin)
router.get("/all", complaintController.getAllComplaints as RequestHandler);

// Get complaints by buyer
router.get(
  "/buyer/complaints",
  verifyToken as RequestHandler,
  complaintController.getComplaintsByBuyerId as RequestHandler
);

// Get complaints by seller
router.get(
  "/seller/complaints",
  verifyToken as RequestHandler,
  complaintController.getComplaintsBySellerId as RequestHandler
);

// Get complaint by ID
router.get("/:id", complaintController.getComplaintById as RequestHandler);

// Update complaint
router.put(
  "/:id",
  verifyToken as RequestHandler,
  complaintController.updateComplaint as RequestHandler
);

// Delete complaint
router.delete(
  "/:id",
  verifyToken as RequestHandler,
  complaintController.deleteComplaint as RequestHandler
);

export default router;
