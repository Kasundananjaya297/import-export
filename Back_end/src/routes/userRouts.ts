/** @format */

import express from "express";
import * as userController from "../controller/userController";
const router = express.Router();

router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);

export default router;
