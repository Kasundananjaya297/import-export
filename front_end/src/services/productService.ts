/** @format */

import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  minOrderQuantity: number;
  images: string[];
  specifications: string;
  origin: string;
  certification: string;
  sellerId: string;
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
  images: File[];
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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

class ProductService {
  async addProduct(productData: AddProductData): Promise<Product> {
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
      images: productData.images,
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

    return response.data;
  }

  async getProducts(): Promise<Product[]> {
    const response = await api.get(API_ENDPOINTS.PRODUCT.GET_ALL);
    return response.data;
  }

  async getProductById(id: string): Promise<Product> {
    const response = await api.get(API_ENDPOINTS.PRODUCT.GET_BY_ID(id));
    return response.data;
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

    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.PRODUCT.DELETE(id));
  }

  async getSellerProducts(sellerId: string): Promise<Product[]> {
    const response = await api.get(
      API_ENDPOINTS.PRODUCT.GET_SELLER_PRODUCTS(sellerId),
    );
    return response.data;
  }
}

export const productService = new ProductService();
