/** @format */

import express, { RequestHandler } from "express";
import { productController } from "../controllers/productController";
import { verifyToken } from "../middleware/auth";

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
