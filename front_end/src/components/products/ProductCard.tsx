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
  Store as StoreIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Product } from "../../services/productService";
import StatusBadge from "../common/StatusBadge";
import { useAuth } from "../../context/AuthContext";

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
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<any>(null);

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
    if (!isAuthenticated) {
      enqueueSnackbar("Please register to place an order", { variant: "info" });
      navigate("/register");
      return;
    }

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      navigate(`/importer/place-order/${product.id}`);
    }
  };

  const handleViewDetails = () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please register to view details", { variant: "info" });
      navigate("/register");
      return;
    }
    navigate(`/listing/${product.id}`);
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
        sx={{ p: 1.5, "&:last-child": { pb: 1.5 }, flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              component="h2"
              noWrap
              sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {product.species || product.name}
            </Typography>
            <Typography variant="caption" color="cyan.700" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
              {product.variety || product.category}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right", flexShrink: 0 }}>
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 800, lineHeight: 1 }}>
              Rs.{parseFloat(product.price).toFixed(0)}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.4em',
            lineHeight: 1.2
          }}
        >
          {product.description}
        </Typography>

        {/* Fish Metadata Grid */}
        <Grid container spacing={0.5} sx={{ mb: 1 }}>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              <Box component="span" sx={{ fontWeight: 700, color: 'primary.main', mr: 0.5 }}>Qty:</Box>
              {product.quantity} {product.unit}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              <Box component="span" sx={{ fontWeight: 700, color: 'primary.main', mr: 0.5 }}>Size:</Box>
              {product.sizeValue}{product.sizeUnit}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              <Box component="span" sx={{ fontWeight: 700, color: 'primary.main', mr: 0.5 }}>Age:</Box>
              {product.ageValue} {product.ageUnit}
            </Typography>
          </Grid>
          {isAuthenticated && (
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <Box component="span" sx={{ fontWeight: 700, color: 'primary.main', mr: 0.5 }}>Sex:</Box>
                {product.gender}
              </Typography>
            </Grid>
          )}
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Chip
            label={`Origin: ${product.origin}`}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: '0.65rem' }}
          />
          {product.stall && (
            <Chip
              icon={<StoreIcon sx={{ fontSize: '0.8rem !important' }} />}
              label={product.stall.stallName}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/stall/${product.stall?.id}`);
              }}
              sx={{ height: 20, fontSize: '0.65rem', cursor: 'pointer' }}
            />
          )}
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
