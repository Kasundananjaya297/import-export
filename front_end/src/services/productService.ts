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
  status:string,
  createdAt: string;
  updatedAt: string;
}

export interface AddProductData {
  name: string;
  category: string;
  description: string;
  price: string;
  quantity: string;
  unit: string;
  minOrderQuantity: string;
  images: File[] | string[]; // Support both files and URLs
  specifications: string;
  origin: string;
  certification: string;
}

export interface AddProductWithCloudinaryData {
  name: string;
  category: string;
  description: string;
  price: string;
  quantity: string;
  unit: string;
  minOrderQuantity: string;
  images: string[]; // Image URLs from Cloudinary
  specifications: string;
  origin: string;
  certification: string;
}

// API Request Parameters
export interface AddProductRequest {
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  minOrderQuantity: number;
  specifications: string;
  origin: string;
  certification: string;
  images: File[];
}

export interface AddProductWithCloudinaryRequest {
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  minOrderQuantity: number;
  specifications: string;
  origin: string;
  certification: string;
  images: string[];
}

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
      if (userData.jwt) {
        config.headers.Authorization = `Bearer ${userData.jwt}`;
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
      minOrderQuantity: parseInt(productData.minOrderQuantity),
      specifications: productData.specifications,
      origin: productData.origin,
      certification: productData.certification,
      images: productData.images as File[],
    };

    console.log("====", requestData);

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
      minOrderQuantity: parseInt(productData.minOrderQuantity),
      specifications: productData.specifications,
      origin: productData.origin,
      certification: productData.certification,
      images: productData.images,
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
}

export const productService = new ProductService();
