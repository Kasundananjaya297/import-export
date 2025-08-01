/** @format */

import { Request, Response } from "express";
import * as productRepo from "../repos/productRepo";

export const productController = {
  async create(req: Request, res: Response) {
    try {
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);

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
        userId,
      } = req.body;

      // Validate required fields
      if (!name || !category || !description || !price || !quantity || !unit) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: name, category, description, price, quantity, unit",
        });
      }

      // Handle uploaded images
      let imageUrls: string[] = images;
      if (req.files && Array.isArray(req.files)) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        imageUrls = req.files.map(
          (file: Express.Multer.File) =>
            `${baseUrl}/shared/uploads/${file.filename}`,
        );
      }

      // Get userId from authenticated user if available
      const authenticatedUserId = (req as any).user?.id || parseInt(userId);

      const product = await productRepo.createProduct({
        name,
        category,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        unit,
        minOrderQuantity: minOrderQuantity ? parseInt(minOrderQuantity) : 1,
        specifications: specifications || "",
        origin: origin || "",
        certification: certification || "",
        images: imageUrls,
        userId: authenticatedUserId,
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
      const products = await productRepo.getAllProducts();
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
      const product = await productRepo.getProductById(Number(id));

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

      const product = await productRepo.getProductById(Number(id));

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

      const product = await productRepo.findOneProduct({ id, userId });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found or unauthorized",
        });
      }

      await productRepo.deleteProduct(product);

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
