/** @format */

import { Request, Response } from "express";
import Product from "../models/products";
import { verifyToken } from "../middleware/auth";

export const productController = {
  async create(req: Request, res: Response) {
    try {
      const {
        name,
        category,
        description,
        price,
        quantity,
        unit,
        minOrderQuantity,
        specifications,
        origin,
        certification,
        images,
      } = req.body;

      // Get user ID from the authenticated request
      const userId = (req as any).user.id;

      // Create new product
      const product = await Product.create({
        name,
        category,
        description,
        price,
        quantity,
        unit,
        minOrderQuantity,
        specifications,
        origin,
        certification,
        images,
        userId,
      });

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      console.error("Product creation error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating product",
      });
    }
  },

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await Product.findAll();
      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching products",
      });
    }
  },

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching product",
      });
    }
  },

  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const product = await Product.findOne({
        where: { id, userId },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found or unauthorized",
        });
      }

      await product.update(req.body);

      res.json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({
        success: false,
        message: "Error updating product",
      });
    }
  },

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const product = await Product.findOne({
        where: { id, userId },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found or unauthorized",
        });
      }

      await product.destroy();

      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting product",
      });
    }
  },
};
