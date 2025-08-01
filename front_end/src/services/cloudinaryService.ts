/** @format */

import { CLOUDINARY_CONFIG, validateImageFile } from "../config/cloudinary";

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
}

export class CloudinaryService {
  private static instance: CloudinaryService;

  private constructor() {}

  public static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService();
    }
    return CloudinaryService.instance;
  }

  /**
   * Upload a single image to Cloudinary
   */
  async uploadImage(file: File): Promise<CloudinaryUploadResponse> {
    // Validate file before upload
    const validationError = validateImageFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    formData.append("folder", CLOUDINARY_CONFIG.folder);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result: CloudinaryUploadResponse = await response.json();
      return result;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  }

  /**
   * Upload multiple images to Cloudinary
   */
  async uploadMultipleImages(
    files: File[],
  ): Promise<CloudinaryUploadResponse[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      throw new Error("Failed to upload one or more images. Please try again.");
    }
  }

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedImageUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: string;
      format?: string;
    } = {},
  ): string {
    const { width, height, quality = "auto", format = "auto" } = options;

    let transformations = `q_${quality},f_${format}`;

    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;

    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformations}/${publicId}`;
  }

  /**
   * Delete an image from Cloudinary (requires backend implementation for security)
   */
  async deleteImage(_publicId: string): Promise<void> {
    // Note: For security reasons, image deletion should typically be handled on the backend
    // This is a placeholder for the frontend interface
    console.warn(
      "Image deletion should be implemented on the backend for security",
    );
    throw new Error("Image deletion must be implemented on the backend");
  }
}

export const cloudinaryService = CloudinaryService.getInstance();
