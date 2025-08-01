/** @format */

import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Chip,
  Fade,
} from "@mui/material";
import { Close, ZoomIn } from "@mui/icons-material";

interface ImageGalleryProps {
  images: string[];
  maxHeight?: number;
  showImageCount?: boolean;
  allowZoom?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  maxHeight = 200,
  showImageCount = true,
  allowZoom = true,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    if (allowZoom) {
      setSelectedImage(imageUrl);
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          border: "2px dashed #e0e0e0",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        <Typography variant="body2">No images uploaded</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {showImageCount && (
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" component="span">
            Product Images
          </Typography>
          <Chip
            label={`${images.length} image${images.length > 1 ? "s" : ""}`}
            size="small"
            color="primary"
          />
        </Box>
      )}

      <Grid container spacing={2}>
        {images.map((imageUrl, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Card
              sx={{
                position: "relative",
                cursor: allowZoom ? "pointer" : "default",
                transition: "transform 0.2s ease-in-out",
                "&:hover": allowZoom
                  ? {
                      transform: "scale(1.02)",
                      boxShadow: 3,
                    }
                  : {},
              }}
              onClick={() => handleImageClick(imageUrl)}
            >
              <CardMedia
                component="img"
                height={maxHeight}
                image={imageUrl}
                alt={`Product image ${index + 1}`}
                sx={{
                  objectFit: "cover",
                }}
              />

              {/* Image number badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
              >
                {index + 1}
              </Box>

              {/* Zoom icon overlay */}
              {allowZoom && (
                <Fade in>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                      borderRadius: "50%",
                      p: 0.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ZoomIn fontSize="small" />
                  </Box>
                </Fade>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Full-size image modal */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
              zIndex: 1,
            }}
          >
            <Close />
          </IconButton>

          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size product image"
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ImageGallery;
