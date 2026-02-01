/** @format */

import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CircularProgress,
  Alert,
} from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import {
  cloudinaryService,
  CloudinaryUploadResponse,
} from "../../services/cloudinaryService";

interface ImageUploadProps {
  onImagesChange: (imageUrls: string[]) => void;
  maxImages?: number;
  error?: string;
}

interface UploadedImage {
  id: string;
  url: string;
  publicId: string;
  resourceType?: "image" | "video";
  isUploading?: boolean;
}

const CloudinaryImageUpload: React.FC<ImageUploadProps> = ({
  onImagesChange,
  maxImages = 5,
  error,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = useCallback(
    async (files: FileList) => {
      if (uploadedImages.length + files.length > maxImages) {
        enqueueSnackbar(`You can only upload up to ${maxImages} images`, {
          variant: "warning",
        });
        return;
      }

      setIsUploading(true);
      const newImages: UploadedImage[] = [];

      try {
        // Create temporary images with loading state
        const tempImages: UploadedImage[] = Array.from(files).map(
          (file, index) => ({
            id: `temp-${Date.now()}-${index}`,
            url: URL.createObjectURL(file),
            publicId: "",
            resourceType: file.type.startsWith("video/") ? "video" : "image",
            isUploading: true,
          }),
        );

        setUploadedImages((prev) => [...prev, ...tempImages]);

        // Upload files to Cloudinary
        const filesArray = Array.from(files);
        const uploadResults: CloudinaryUploadResponse[] =
          await cloudinaryService.uploadMultipleImages(filesArray);

        // Update with actual Cloudinary URLs
        uploadResults.forEach((result) => {
          const uploadedImage: UploadedImage = {
            id: result.public_id,
            url: result.secure_url,
            publicId: result.public_id,
            resourceType: (result.resource_type as "image" | "video") || "image",
            isUploading: false,
          };
          newImages.push(uploadedImage);
        });

        // Remove temp images and add real ones
        setUploadedImages((prev) => {
          const filtered = prev.filter((img) => !img.isUploading);
          return [...filtered, ...newImages];
        });

        // Clean up temporary URLs
        tempImages.forEach((img) => URL.revokeObjectURL(img.url));

        // Notify parent component
        const allImageUrls = [
          ...uploadedImages.filter((img) => !img.isUploading),
          ...newImages,
        ].map((img) => img.url);
        onImagesChange(allImageUrls);

        enqueueSnackbar(
          `${uploadResults.length} image(s) uploaded successfully!`,
          { variant: "success" },
        );
      } catch (error) {
        console.error("Upload error:", error);
        enqueueSnackbar("Failed to upload images. Please try again.", {
          variant: "error",
        });

        // Remove failed uploads
        setUploadedImages((prev) => prev.filter((img) => !img.isUploading));
      } finally {
        setIsUploading(false);
      }
    },
    [uploadedImages, maxImages, onImagesChange, enqueueSnackbar],
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files);
    }
    // Reset input value to allow uploading the same file again
    event.target.value = "";
  };

  const removeImage = (imageId: string) => {
    setUploadedImages((prev) => {
      const updated = prev.filter((img) => img.id !== imageId);
      const imageUrls = updated.map((img) => img.url);
      onImagesChange(imageUrls);
      return updated;
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<PhotoCamera />}
          disabled={isUploading || uploadedImages.length >= maxImages}
          sx={{ mr: 2 }}
        >
          {isUploading ? "Uploading..." : "Upload Images"}
          <input
            type="file"
            hidden
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
          />
        </Button>

        {isUploading && <CircularProgress size={24} sx={{ ml: 1 }} />}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {uploadedImages.length}/{maxImages} images uploaded
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {uploadedImages.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Uploaded Images ({uploadedImages.length}/{maxImages})
          </Typography>
          <Grid container spacing={2}>
            {uploadedImages.map((image, index) => (
              <Grid item xs={6} sm={4} md={3} key={image.id}>
                <Card
                  sx={{
                    position: "relative",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    overflow: "hidden",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: 3,
                    },
                  }}
                >
                  {image.resourceType === "video" ? (
                    <Box
                      component="video"
                      src={image.url}
                      controls={false} // Hide default controls for cleaner look
                      onClick={() => window.open(image.url, "_blank")}
                      sx={{
                        width: "100%",
                        height: 140,
                        objectFit: "cover",
                        cursor: "pointer",
                        display: "block",
                      }}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      height="140"
                      image={image.url}
                      alt={`Product media ${index + 1}`}
                      sx={{
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(image.url, "_blank")}
                    />
                  )}

                  {/* Image number badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      backgroundColor: "primary.main",
                      color: "white",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    {index + 1}
                  </Box>

                  {image.isUploading && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <CircularProgress color="primary" size={32} />
                      <Typography variant="caption" color="white">
                        Uploading...
                      </Typography>
                    </Box>
                  )}

                  {!image.isUploading && (
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(244, 67, 54, 0.9)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 1)",
                        },
                      }}
                      onClick={() => removeImage(image.id)}
                      title="Remove image"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}

                  {/* Image info footer */}
                  {!image.isUploading && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        p: 0.5,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="caption">
                        Click to view full size
                      </Typography>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default CloudinaryImageUpload;
