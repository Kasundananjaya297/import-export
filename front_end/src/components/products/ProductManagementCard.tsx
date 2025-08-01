/** @format */

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { Product } from "../../services/productService";

interface ProductManagementCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

const ProductManagementCard: React.FC<ProductManagementCardProps> = ({
  product,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const hasMultipleImages = product.images && product.images.length > 1;

  // Auto-carousel functionality
  useEffect(() => {
    if (hasMultipleImages && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === product.images.length - 1 ? 0 : prev + 1,
        );
      }, 3000); // Change image every 3 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hasMultipleImages, isPaused, product.images.length]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(product);
    } else {
      console.log("Edit product:", product.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(product);
    } else {
      console.log("Delete product:", product.id);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      console.log("View details:", product.id);
    }
  };

  const handleNext = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const handlePrevious = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1,
      );
    }
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const getCurrentImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[currentImageIndex];
    }
    return "https://via.placeholder.com/300x200?text=No+Image";
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      {/* Carousel Section */}
      <Box
        sx={{ position: "relative" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardMedia
          component="img"
          height="200"
          image={getCurrentImage()}
          alt={`${product.name} - Image ${currentImageIndex + 1}`}
          sx={{ objectFit: "cover" }}
        />

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                },
                zIndex: 1,
              }}
              size="small"
            >
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                },
                zIndex: 1,
              }}
              size="small"
            >
              <NavigateNextIcon />
            </IconButton>
          </>
        )}

        {/* Dots Indicator */}
        {hasMultipleImages && (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 0.5,
              zIndex: 1,
            }}
          >
            {product.images.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor:
                    index === currentImageIndex
                      ? "white"
                      : "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor:
                      index === currentImageIndex
                        ? "white"
                        : "rgba(255, 255, 255, 0.8)",
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* Image Counter */}
        {hasMultipleImages && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.75rem",
              zIndex: 1,
            }}
          >
            {currentImageIndex + 1} / {product.images.length}
          </Box>
        )}

        {/* Auto-play Indicator */}
        {hasMultipleImages && !isPaused && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              bgcolor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.75rem",
              zIndex: 1,
            }}
          >
            Auto
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {product.name}
          </Typography>
          <Chip label="Active" color="success" size="small" />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              mr: 1,
              bgcolor: "primary.main",
            }}
          >
            <InventoryIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {product.category}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="primary">
            ${parseFloat(product.price).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.quantity} {product.unit}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Box>
          <IconButton color="primary" size="small" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" size="small" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
        <Button size="small" variant="outlined" onClick={handleViewDetails}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductManagementCard;
