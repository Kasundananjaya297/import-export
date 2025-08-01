/** @format */

import express, { RequestHandler } from "express";
import { paymentController } from "../controllers/paymentController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Protected routes - require authentication
router.post(
  "/create",
  verifyToken as RequestHandler,
  paymentController.createPayment as RequestHandler,
);

router.post(
  "/:paymentId/process",
  verifyToken as RequestHandler,
  paymentController.processPayment as RequestHandler,
);

router.get("/all", paymentController.getAllPayments as RequestHandler);

router.get("/:id", paymentController.getPaymentById as RequestHandler);

router.get(
  "/order/:orderId",
  verifyToken as RequestHandler,
  paymentController.getPaymentByOrderId as RequestHandler,
);

// Add missing routes
router.put(
  "/:paymentId/status",
  verifyToken as RequestHandler,
  paymentController.updatePaymentStatus as RequestHandler,
);

router.post(
  "/:paymentId/refund",
  verifyToken as RequestHandler,
  paymentController.refundPayment as RequestHandler,
);

export default router;
