/** @format */

import { Request, Response } from "express";
import * as productRepo from "../repos/productRepo";
import { Stall } from "../models";

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
        // New fields
        species,
        variety,
        wholesalePrice,
        sizeValue,
        sizeUnit,
        ageValue,
        ageUnit,
        gender,
        breedingStatus,
        feedingFoodType,
        feedingFrequency,
        video,
      } = req.body;

      // Validate required fields
      if (!name || !description || !price || !quantity || !unit) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: name, description, price, quantity, unit",
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

      if (!authenticatedUserId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // Find user's stall
      const stall = await Stall.findOne({ where: { userId: authenticatedUserId } });
      if (!stall) {
        return res.status(400).json({
          success: false,
          message: "User must have a stall before adding products.",
        });
      }

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
        userid: authenticatedUserId,
        // New fields
        species,
        variety,
        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : undefined,
        sizeValue: sizeValue ? parseFloat(sizeValue) : undefined,
        sizeUnit,
        ageValue: ageValue ? parseFloat(ageValue) : undefined,
        ageUnit,
        gender: gender || 'mixed',
        breedingStatus: breedingStatus || 'not_paired',
        feedingFoodType,
        feedingFrequency,
        video,
        status: 'available',
        approvalStatus: 'pending',
        stallId: stall.id,
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
      const user = (req as any).user;

      const product = await productRepo.getProductById(Number(id));

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Allow if owner OR admin
      if ((product as any).userid !== user.id && user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
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

  async getProductByUserId(req: Request, res: Response) {
    try {
      // Get userId from query parameters (?userId=13)
      const userId = req.query.userId || (req as any).user?.id;

      console.log("Received userId from query:", req.query.userId);
      console.log("Final userId being used:", userId);

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required as query parameter (?userId=13)",
        });
      }

      const products = await productRepo.getProductByUserId(Number(userId));
      res.json({
        success: true,
        data: products,
        count: products.length,
      });
    } catch (error) {
      console.error("Error fetching products by user ID:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching products by user ID",
      });
    }
  },

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      const product = await productRepo.getProductById(Number(id));

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Allow if owner OR admin
      if ((product as any).userid !== user.id && user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
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

  async getProductsByStallId(req: Request, res: Response) {
    try {
      const { stallId } = req.params;
      if (!stallId) {
        return res.status(400).json({
          success: false,
          message: "Stall ID is required",
        });
      }

      const products = await productRepo.getProductByStallId(Number(stallId));
      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error("Error fetching products by stall ID:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching products by stall ID",
      });
    }
  },

  async getPendingProducts(req: Request, res: Response) {
    try {
      const products = await productRepo.getPendingProducts();
      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error("Error fetching pending products:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching pending products",
      });
    }
  },

  async approveProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productRepo.getProductById(Number(id));

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      await product.update({ approvalStatus: 'approved' });

      res.json({
        success: true,
        message: "Product approved successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error approving product:", error);
      res.status(500).json({
        success: false,
        message: "Error approving product",
      });
    }
  },

  async rejectProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productRepo.getProductById(Number(id));

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      await product.update({ approvalStatus: 'rejected' });

      res.json({
        success: true,
        message: "Product rejected successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error rejecting product:", error);
      res.status(500).json({
        success: false,
        message: "Error rejecting product",
      });
    }
  },
};
