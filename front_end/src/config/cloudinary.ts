/** @format */

// Cloudinary Configuration
// You need to set these values based on your Cloudinary account
export const CLOUDINARY_CONFIG = {
  // Get these from your Cloudinary dashboard
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "demo",
  uploadPreset:
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
    "docs_upload_example_us_preset",

  // Optional: Default transformations
  defaultTransformations: {
    quality: "auto",
    format: "auto",
    crop: "fill",
  },

  // Upload settings
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
  folder: "products", // Organize uploads in folders
};

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {},
): string => {
  const { width, height, quality = "auto", format = "auto" } = options;

  let transformations = `q_${quality},f_${format}`;

  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  if (width && height) transformations += `,c_fill`;

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformations}/${publicId}`;
};

// Validation helper
export const validateImageFile = (file: File): string | null => {
  if (file.size > CLOUDINARY_CONFIG.maxFileSize) {
    return `File size must be less than ${
      CLOUDINARY_CONFIG.maxFileSize / 1024 / 1024
    }MB`;
  }

  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  if (
    !fileExtension ||
    !CLOUDINARY_CONFIG.allowedFormats.includes(fileExtension)
  ) {
    return `Allowed formats: ${CLOUDINARY_CONFIG.allowedFormats.join(", ")}`;
  }

  return null;
};
