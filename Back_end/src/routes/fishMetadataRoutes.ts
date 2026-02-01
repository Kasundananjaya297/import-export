/** @format */
import { Router } from "express";
import * as fishMetadataController from "../controllers/fishMetadataController";
import { verifyToken, isAdmin } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/species", fishMetadataController.getAllSpecies);
router.get("/varieties", fishMetadataController.getAllVarieties);

// Admin only routes
router.use(verifyToken);
router.use(isAdmin);

router.post("/species", fishMetadataController.createSpecies);
router.put("/species/:id", fishMetadataController.updateSpecies);
router.delete("/species/:id", fishMetadataController.deleteSpecies);

router.post("/varieties", fishMetadataController.createVariety);
router.put("/varieties/:id", fishMetadataController.updateVariety);
router.delete("/varieties/:id", fishMetadataController.deleteVariety);

export default router;
