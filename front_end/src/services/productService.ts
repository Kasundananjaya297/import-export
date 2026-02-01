/** @format */

import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string; // API returns price as string
  quantity: number;
  unit: string;
  minOrderQuantity: number;
  images: string[];
  specifications: string;
  origin: string;
  certification: string;
  userId: number; // API uses userId instead of sellerId
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddProductData {
  name: string;
  category?: string;
  description?: string;
  price: string;
  quantity: string;
  unit: string;
  minOrderQuantity?: string;
  images: File[] | string[]; // Support both files and URLs
  specifications?: string;
  origin?: string;
  certification?: string;
  // New fields
  species?: string;
  variety?: string;
  wholesalePrice?: string;
  sizeValue?: string;
  sizeUnit?: string;
  age?: string;
  gender?: string;
  breedingStatus?: string;
  feedingFoodType?: string;
  feedingFrequency?: string;
  video?: string;
}

export interface AddProductWithCloudinaryData {
  name: string;
  category?: string;
  description?: string;
  price: string;
  quantity: string;
  unit: string;
  minOrderQuantity?: string;
  images: string[]; // Image URLs from Cloudinary
  specifications?: string;
  origin?: string;
  certification?: string;
  // New fields
  species?: string;
  variety?: string;
  wholesalePrice?: string;
  sizeValue?: string;
  sizeUnit?: string;
  age?: string;
  gender?: string;
  breedingStatus?: string;
  feedingFoodType?: string;
  feedingFrequency?: string;
  video?: string;
}

// API Request Parameters
export interface AddProductRequest {
  name: string;
  category?: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  minOrderQuantity?: number;
  specifications?: string;
  origin?: string;
  certification?: string;
  images: File[];
  // New fields
  species?: string;
  variety?: string;
  wholesalePrice?: number;
  sizeValue?: number;
  sizeUnit?: string;
  age?: string;
  gender?: string;
  breedingStatus?: string;
  feedingFoodType?: string;
  feedingFrequency?: string;
  video?: string;
}

export interface AddProductWithCloudinaryRequest {
  name: string;
  category?: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  minOrderQuantity?: number;
  specifications?: string;
  origin?: string;
  certification?: string;
  images: string[];
  // New fields
  species?: string;
  variety?: string;
  wholesalePrice?: number;
  sizeValue?: number;
  sizeUnit?: string;
  age?: string;
  gender?: string;
  breedingStatus?: string;
  feedingFoodType?: string;
  feedingFrequency?: string;
  video?: string;
}

// [ADDED FOR REQUIREMENT COMPLETION]: removed UpdateProductQuantityRequest interface
// Inventory updates are now handled through the backend inventory service

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

class ProductService {
  async addProduct(productData: AddProductData): Promise<Product> {
    // Check if images are URLs (Cloudinary) or Files
    if (
      Array.isArray(productData.images) &&
      productData.images.length > 0 &&
      typeof productData.images[0] === "string"
    ) {
      return this.addProductWithCloudinary(
        productData as AddProductWithCloudinaryData,
      );
    }

    const formData = new FormData();

    // Convert string values to numbers where needed
    const requestData: AddProductRequest = {
      name: productData.name,
      category: productData.category,
      description: productData.description,
      price: parseFloat(productData.price),
      quantity: parseInt(productData.quantity),
      unit: productData.unit,
      minOrderQuantity: productData.minOrderQuantity ? parseInt(productData.minOrderQuantity) : undefined,
      specifications: productData.specifications,
      origin: productData.origin,
      certification: productData.certification,
      images: productData.images as File[],
      // New fields
      species: productData.species,
      variety: productData.variety,
      wholesalePrice: productData.wholesalePrice ? parseFloat(productData.wholesalePrice) : undefined,
      sizeValue: productData.sizeValue ? parseFloat(productData.sizeValue) : undefined,
      sizeUnit: productData.sizeUnit,
      ageValue: productData.ageValue ? parseFloat(productData.ageValue) : undefined,
      ageUnit: productData.ageUnit,
      gender: productData.gender,
      breedingStatus: productData.breedingStatus,
      feedingFoodType: productData.feedingFoodType,
      feedingFrequency: productData.feedingFrequency,
      video: productData.video,
    };

    // Append all text fields
    Object.entries(requestData).forEach(([key, value]) => {
      if (key !== "images") {
        formData.append(key, value.toString());
      }
    });

    // Append images
    requestData.images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await api.post(API_ENDPOINTS.PRODUCT.CREATE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data; // Access the data object from the response
  }

  async addProductWithCloudinary(
    productData: AddProductWithCloudinaryData,
  ): Promise<Product> {
    const requestData: AddProductWithCloudinaryRequest = {
      name: productData.name,
      category: productData.category,
      description: productData.description,
      price: parseFloat(productData.price),
      quantity: parseInt(productData.quantity),
      unit: productData.unit,
      minOrderQuantity: productData.minOrderQuantity ? parseInt(productData.minOrderQuantity) : undefined,
      specifications: productData.specifications,
      origin: productData.origin,
      certification: productData.certification,
      images: productData.images,
      // New fields
      species: productData.species,
      variety: productData.variety,
      wholesalePrice: productData.wholesalePrice ? parseFloat(productData.wholesalePrice) : undefined,
      sizeValue: productData.sizeValue ? parseFloat(productData.sizeValue) : undefined,
      sizeUnit: productData.sizeUnit,
      ageValue: productData.ageValue ? parseFloat(productData.ageValue) : undefined,
      ageUnit: productData.ageUnit,
      gender: productData.gender,
      breedingStatus: productData.breedingStatus,
      feedingFoodType: productData.feedingFoodType,
      feedingFrequency: productData.feedingFrequency,
      video: productData.video,
    };

    const response = await api.post(API_ENDPOINTS.PRODUCT.CREATE, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.data; // Access the data object from the response
  }

  async getProducts(): Promise<Product[]> {
    const response = await api.get(API_ENDPOINTS.PRODUCT.GET_ALL);
    return response.data.data; // Access the data array from the response
  }

  async getProductById(id: string): Promise<Product> {
    const response = await api.get(API_ENDPOINTS.PRODUCT.GET_BY_ID(id));
    return response.data.data; // Access the data object from the response
  }

  async getProductByUserId(): Promise<Product[]> {
    // Get user ID from session storage (check both sessionStorage and localStorage)
    const currentUser =
      sessionStorage.getItem("currentUser") ||
      localStorage.getItem("currentUser");
    if (!currentUser) {
      throw new Error("User not found in session storage");
    }

    const userData = JSON.parse(currentUser);
    const userId = userData.id || userData.userId;

    if (!userId) {
      throw new Error("User ID not found in session data");
    }

    // Use the GET_BY_USER_ID endpoint with userId as query parameter
    const response = await api.get(
      `${API_ENDPOINTS.PRODUCT.GET_BY_USER_ID}?userId=${userId}`,
    );
    return response.data.data; // Access the data array from the response
  }

  async updateProduct(
    id: string,
    productData: Partial<AddProductData>,
  ): Promise<Product> {
    const formData = new FormData();

    // Append all text fields
    Object.entries(productData).forEach(([key, value]) => {
      if (key !== "images" && value !== undefined) {
        if (typeof value === "string") {
          formData.append(key, value);
        }
      }
    });

    // Append new images if any
    if (productData.images) {
      productData.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await api.put(API_ENDPOINTS.PRODUCT.UPDATE(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data; // Access the data object from the response
  }

  async deleteProduct(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.PRODUCT.DELETE(id));
  }

  async getSellerProducts(sellerId: string): Promise<Product[]> {
    const response = await api.get(
      API_ENDPOINTS.PRODUCT.GET_SELLER_PRODUCTS(sellerId),
    );
    return response.data.data; // Access the data array from the response
  }

  // [ADDED FOR REQUIREMENT COMPLETION]: removed automatic quantity updates to follow inventory rules
  // Inventory is now managed through reservations and finalization only

  async checkProductAvailability(
    productId: number,
    requestedQuantity: number,
  ): Promise<boolean> {
    try {
      const product = await this.getProductById(productId.toString());
      return product.quantity >= requestedQuantity;
    } catch (error) {
      console.error("Error checking product availability:", error);
      return false;
    }
  }

  async getProductStockLevel(productId: number): Promise<number> {
    try {
      const product = await this.getProductById(productId.toString());
      return product.quantity;
    } catch (error) {
      console.error("Error getting product stock level:", error);
      return 0;
    }
  }
}

export const productService = new ProductService();
