/** @format */
import { Request, Response } from "express";
import { Stall } from "../models";
import { responseDTO } from "../responseDTO/responseDTO";

export const createStall = async (req: Request, res: Response) => {
    try {
        const { stallName, description, logo } = req.body;
        const userId = (req as any).user?.id; // Assuming user id is in req.user from auth middleware

        if (!userId) {
            console.error("Stall creation failed: No userId found in request");
            return res.status(401).json({ success: false, message: "Unauthorized: User ID missing" });
        }

        const existingStall = await Stall.findOne({ where: { userId } });
        if (existingStall) {
            return res.status(400).json({ success: false, message: "User already has a stall" });
        }

        const stall = await Stall.create({
            userId,
            stallName,
            description,
            logo,
        });

        res.status(201).json({ success: true, data: stall, message: "Stall created successfully" });
    } catch (error) {
        console.error("Error creating stall:", error);
        res.status(500).json({ success: false, message: "Error creating stall" });
    }
};

export const getStall = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const stall = await Stall.findOne({ where: { userId } });
        if (!stall) {
            return res.status(404).json({ success: false, message: "Stall not found" });
        }

        res.status(200).json({ success: true, data: stall, message: "Stall retrieved successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error retrieving stall" });
    }
};

export const updateStall = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const { stallName, description, logo, status } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const stall = await Stall.findOne({ where: { userId } });
        if (!stall) {
            return res.status(404).json({ success: false, message: "Stall not found" });
        }

        await stall.update({
            stallName: stallName || stall.stallName,
            description: description !== undefined ? description : stall.description,
            logo: logo || stall.logo,
            status: status || stall.status,
        });

        res.status(200).json({ success: true, data: stall, message: "Stall updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating stall" });
    }
};

export const getStallById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const stallId = typeof id === 'string' ? id : id[0];
        const stall = await Stall.findByPk(stallId, {
            include: [
                {
                    model: (require("../models").User),
                    as: "user",
                    attributes: ["id", "fname", "lname", "email", "contact"],
                }
            ]
        });
        if (!stall) {
            return res.status(404).json({ success: false, message: "Stall not found" });
        }
        res.status(200).json({ success: true, data: stall });
    } catch (error) {
        console.error("Error fetching stall by ID:", error);
        res.status(500).json({ success: false, message: "Error fetching stall" });
    }
};
