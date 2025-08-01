/** @format */

import express, { RequestHandler } from "express";
import { orderController } from "../controllers/orderController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Protected routes - require authentication
router.post(
  "/create",
  verifyToken as RequestHandler,
  orderController.createOrder as RequestHandler,
);

router.get("/all", orderController.getAllOrders as RequestHandler);

router.get("/:id", orderController.getOrderById as RequestHandler);

router.get(
  "/buyer/orders",
  verifyToken as RequestHandler,
  orderController.getOrdersByBuyerId as RequestHandler,
);

router.get(
  "/seller/orders",
  verifyToken as RequestHandler,
  orderController.getOrdersBySellerId as RequestHandler,
);

router.put(
  "/:id/status",
  verifyToken as RequestHandler,
  orderController.updateOrderStatus as RequestHandler,
);

router.put(
  "/:id/payment",
  verifyToken as RequestHandler,
  orderController.updatePaymentStatus as RequestHandler,
);

router.delete(
  "/:id",
  verifyToken as RequestHandler,
  orderController.deleteOrder as RequestHandler,
);

// New order management routes
router.post(
  "/:id/cancel",
  verifyToken as RequestHandler,
  orderController.cancelOrder as RequestHandler,
);

router.get(
  "/search",
  verifyToken as RequestHandler,
  orderController.searchOrders as RequestHandler,
);

router.get(
  "/stats",
  verifyToken as RequestHandler,
  orderController.getOrderStats as RequestHandler,
);

export default router;
