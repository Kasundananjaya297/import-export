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
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
      return {
        status: "out_of_stock",
        color: "error",
        text: "Out of Stock",
        icon: <CancelIcon />,
      };
    } else if (product.quantity <= product.minOrderQuantity) {
      return {
        status: "low_stock",
        color: "warning",
        text: "Low Stock",
        icon: <WarningIcon />,
      };
    } else if (product.quantity <= product.minOrderQuantity * 3) {
      return {
        status: "moderate_stock",
        color: "info",
        text: "Moderate Stock",
        icon: <InventoryIcon />,
      };
    } else {
      return {
        status: "in_stock",
        color: "success",
        text: "In Stock",
        icon: <TrendingUpIcon />,
      };
    }
  };

  const getStockPercentage = () => {
    // Calculate stock percentage based on a reasonable maximum (e.g., 10x min order)
    const maxStock = product.minOrderQuantity * 10;
    return Math.min((product.quantity / maxStock) * 100, 100);
  };

  const stockStatus = getStockStatus();
  const stockPercentage = getStockPercentage();

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
            icon={stockStatus.icon}
            label={stockStatus.text}
            color={stockStatus.color as any}
            size="small"
            variant="filled"
          />
        </Box>

        {/* Action Menu */}
        <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
            }}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <InventoryIcon sx={{ mr: 1, fontSize: "1rem" }} />
              Stock: {product.quantity} {product.unit}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stockPercentage.toFixed(0)}% full
            </Typography>
          </Box>

          {/* Stock Progress Bar */}
          <Box
            sx={{
              width: "100%",
              bgcolor: "grey.200",
              borderRadius: 1,
              height: 6,
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: `${stockPercentage}%`,
                height: "100%",
                bgcolor:
                  stockStatus.color === "error"
                    ? "error.main"
                    : stockStatus.color === "warning"
                    ? "warning.main"
                    : stockStatus.color === "info"
                    ? "info.main"
                    : "success.main",
                borderRadius: 1,
                transition: "width 0.3s ease",
              }}
            />
          </Box>

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

        {/* Action Buttons */}
        <Box sx={{ mt: "auto" }}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                fullWidth
                size="small"
                onClick={() => onViewDetails?.(product)}
                startIcon={<VisibilityIcon />}
              >
                View
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                fullWidth
                size="small"
                onClick={() => onEdit?.(product)}
                startIcon={<EditIcon />}
                color="primary"
              >
                Edit
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                fullWidth
                size="small"
                onClick={() => onDelete?.(product)}
                startIcon={<DeleteIcon />}
                color="error"
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            onViewDetails?.(product);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onEdit?.(product);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Product</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete?.(product);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Product</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default ProductManagementCard;
