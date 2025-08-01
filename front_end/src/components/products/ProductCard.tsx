/** @format */

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { Product } from "../../services/productService";
import StatusBadge from "../common/StatusBadge";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showActions = true,
}) => {
  const navigate = useNavigate();
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

  const handleOrderClick = () => {
    navigate(`/importer/place-order/${product.id}`);
  };

  const handleViewDetails = () => {
    // For a real app, this would navigate to a product details page
    console.log("View details for product:", product.id);
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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        },
      }}
      className="product-card"
    >
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

        {/* Status Badge */}
        <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
          <StatusBadge status="active" />
        </Box>
      </Box>

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ mb: 1 }}>
          <Chip
            label={product.category}
            size="small"
            sx={{
              bgcolor: "primary.light",
              color: "primary.dark",
              fontSize: "0.7rem",
              mb: 1,
            }}
          />
        </Box>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "medium", mb: 1 }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, flexGrow: 1 }}
        >
          {product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Origin: {product.origin}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            ${parseFloat(product.price).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Min Order: {product.minOrderQuantity} {product.unit}
          </Typography>
        </Box>
        {showActions && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: "auto",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={handleViewDetails}
              sx={{ flexGrow: 1, mr: 1 }}
            >
              Details
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleOrderClick}
              sx={{ flexGrow: 1 }}
            >
              Order
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
