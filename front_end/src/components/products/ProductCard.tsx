/** @format */

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  Grid,
  IconButton,
  Badge,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Product } from "../../services/productService";
import StatusBadge from "../common/StatusBadge";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showAddToCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  showAddToCart = true,
}) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying && product.images && product.images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === product.images.length - 1 ? 0 : prev + 1,
        );
      }, 3000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, product.images]);

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const getCurrentImage = () => {
    if (!product.images || product.images.length === 0) {
      return "https://via.placeholder.com/300x200?text=No+Image";
    }
    return product.images[currentImageIndex];
  };

  const getStockStatus = () => {
    if (product.quantity === 0) {
      return { status: "out_of_stock", color: "error", text: "Out of Stock" };
    } else if (product.quantity <= product.minOrderQuantity) {
      return { status: "low_stock", color: "warning", text: "Low Stock" };
    } else {
      return { status: "in_stock", color: "success", text: "In Stock" };
    }
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      navigate(`/importer/place-order/${product.id}`);
    }
  };

  const handleViewDetails = () => {
    navigate(`/importer/place-order/${product.id}`);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Image Carousel */}
      <Box
        sx={{
          position: "relative",
          height: 200,
          overflow: "hidden",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardMedia
          component="img"
          height="200"
          image={getCurrentImage()}
          alt={product.name}
          sx={{
            objectFit: "cover",
            width: "100%",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />

        {/* Navigation Arrows */}
        {product.images && product.images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.8)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
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
                bgcolor: "rgba(255,255,255,0.8)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              }}
              size="small"
            >
              <NavigateNextIcon />
            </IconButton>
          </>
        )}

        {/* Image Counter */}
        {product.images && product.images.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0,0,0,0.7)",
              color: "white",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.75rem",
            }}
          >
            {currentImageIndex + 1} / {product.images.length}
          </Box>
        )}

        {/* Auto-play Badge */}
        {isAutoPlaying && product.images && product.images.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              bgcolor: "rgba(0,0,0,0.7)",
              color: "white",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.75rem",
            }}
          >
            Auto
          </Box>
        )}

        {/* Dots Indicator */}
        {product.images && product.images.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 0.5,
            }}
          >
            {product.images.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor:
                    index === currentImageIndex
                      ? "white"
                      : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </Box>
        )}

        {/* Stock Status Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: product.images && product.images.length > 1 ? 60 : 8,
            zIndex: 1,
          }}
        >
          <Chip
            icon={
              stockStatus.status === "out_of_stock" ? (
                <CancelIcon />
              ) : stockStatus.status === "low_stock" ? (
                <WarningIcon />
              ) : (
                <InventoryIcon />
              )
            }
            label={stockStatus.text}
            color={stockStatus.color as any}
            size="small"
            variant="filled"
          />
        </Box>
      </Box>

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, flexGrow: 1 }}
        >
          {product.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: "bold" }}>
            ${parseFloat(product.price).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            per {product.unit}
          </Typography>
        </Box>

        {/* Stock Information */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <InventoryIcon sx={{ mr: 1, fontSize: "1rem" }} />
            Available: {product.quantity} {product.unit}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Min Order: {product.minOrderQuantity} {product.unit}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Chip label={product.category} size="small" sx={{ mr: 1 }} />
          <Chip
            label={`Origin: ${product.origin}`}
            size="small"
            variant="outlined"
          />
        </Box>

        <Box sx={{ mt: "auto" }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth
                size="small"
                onClick={handleViewDetails}
                disabled={product.quantity === 0}
              >
                View Details
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                size="small"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                sx={{
                  bgcolor: product.quantity === 0 ? "grey.400" : "primary.main",
                  "&:hover": {
                    bgcolor:
                      product.quantity === 0 ? "grey.400" : "primary.dark",
                  },
                }}
              >
                {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
