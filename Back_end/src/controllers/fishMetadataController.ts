/** @format */
import { Request, Response } from "express";
import { Species, Variety } from "../models";

// Species CRUD
export const getAllSpecies = async (req: Request, res: Response) => {
    try {
        const species = await Species.findAll({
            include: [{ model: Variety, as: "varieties" }]
        });
        res.status(200).json({ success: true, data: species });
    } catch (error) {
        console.error("Error fetching species:", error);
        res.status(500).json({ success: false, message: "Error fetching species" });
    }
};

export const createSpecies = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }
        const species = await Species.create({ name });
        res.status(201).json({ success: true, data: species, message: "Species created successfully" });
    } catch (error: any) {
        console.error("Error creating species:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ success: false, message: "Species name already exists" });
        }
        res.status(500).json({ success: false, message: "Error creating species" });
    }
};

export const updateSpecies = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as any;
        const { name } = req.body;
        const species = await Species.findByPk(id);
        if (!species) {
            return res.status(404).json({ success: false, message: "Species not found" });
        }
        await species.update({ name });
        res.status(200).json({ success: true, data: species, message: "Species updated successfully" });
    } catch (error: any) {
        console.error("Error updating species:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ success: false, message: "Species name already exists" });
        }
        res.status(500).json({ success: false, message: "Error updating species" });
    }
};

export const deleteSpecies = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as any;
        const species = await Species.findByPk(id);
        if (!species) {
            return res.status(404).json({ success: false, message: "Species not found" });
        }
        await species.destroy();
        res.status(200).json({ success: true, message: "Species deleted successfully" });
    } catch (error) {
        console.error("Error deleting species:", error);
        res.status(500).json({ success: false, message: "Error deleting species" });
    }
};

// Variety CRUD
export const getAllVarieties = async (req: Request, res: Response) => {
    try {
        const varieties = await Variety.findAll({
            include: [{ model: Species, as: "species" }]
        });
        res.status(200).json({ success: true, data: varieties });
    } catch (error) {
        console.error("Error fetching varieties:", error);
        res.status(500).json({ success: false, message: "Error fetching varieties" });
    }
};

export const createVariety = async (req: Request, res: Response) => {
    try {
        const { name, speciesId } = req.body;
        if (!name || !speciesId) {
            return res.status(400).json({ success: false, message: "Name and speciesId are required" });
        }
        const variety = await Variety.create({ name, speciesId });
        res.status(201).json({ success: true, data: variety, message: "Variety created successfully" });
    } catch (error) {
        console.error("Error creating variety:", error);
        res.status(500).json({ success: false, message: "Error creating variety" });
    }
};

export const updateVariety = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as any;
        const { name, speciesId } = req.body;
        const variety = await Variety.findByPk(id);
        if (!variety) {
            return res.status(404).json({ success: false, message: "Variety not found" });
        }
        await variety.update({ name: name || (variety as any).name, speciesId: speciesId || (variety as any).speciesId });
        res.status(200).json({ success: true, data: variety, message: "Variety updated successfully" });
    } catch (error) {
        console.error("Error updating variety:", error);
        res.status(500).json({ success: false, message: "Error updating variety" });
    }
};

export const deleteVariety = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as any;
        const variety = await Variety.findByPk(id);
        if (!variety) {
            return res.status(404).json({ success: false, message: "Variety not found" });
        }
        await variety.destroy();
        res.status(200).json({ success: true, message: "Variety deleted successfully" });
    } catch (error) {
        console.error("Error deleting variety:", error);
        res.status(500).json({ success: false, message: "Error deleting variety" });
    }
};
