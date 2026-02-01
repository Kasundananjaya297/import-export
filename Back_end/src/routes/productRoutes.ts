/** @format */

import express, { RequestHandler } from "express";
import { productController } from "../controllers/productController";
import { verifyToken, isAdmin } from "../middleware/auth";

const router = express.Router();

// Protected routes - require authentication
router.post(
  "/create",
  verifyToken as RequestHandler,
  productController.create as RequestHandler,
);
router.get("/all", productController.getAllProducts as RequestHandler);
// Product by current user 
router.get(
  "/me",
  verifyToken as RequestHandler,
  productController.getProductByUserId as RequestHandler,
);

// Admin routes for product approval
router.get(
  "/admin/pending",
  verifyToken as RequestHandler,
  isAdmin as RequestHandler,
  productController.getPendingProducts as RequestHandler,
);

router.patch(
  "/:id/approve",
  verifyToken as RequestHandler,
  isAdmin as RequestHandler,
  productController.approveProduct as RequestHandler,
);

router.patch(
  "/:id/reject",
  verifyToken as RequestHandler,
  isAdmin as RequestHandler,
  productController.rejectProduct as RequestHandler,
);

router.get("/:id", productController.getProductById as RequestHandler);
router.get("/public/stall/:stallId", productController.getProductsByStallId as RequestHandler);
router.get(
  "",
  verifyToken as RequestHandler,
  productController.getProductByUserId as RequestHandler,
);

router.put(
  "/:id",
  verifyToken as RequestHandler,
  productController.updateProduct as RequestHandler,
);
router.delete(
  "/:id",
  verifyToken as RequestHandler,
  productController.deleteProduct as RequestHandler,
);

export default router;
