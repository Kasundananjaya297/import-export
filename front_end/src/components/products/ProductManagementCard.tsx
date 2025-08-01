/** @format */

import React from "react";
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
      <CardMedia
        component="img"
        height="200"
        image={
          product.images && product.images.length > 0
            ? product.images[0]
            : "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={product.name}
        sx={{ objectFit: "cover" }}
      />

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

        {product.images && product.images.length > 1 && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            +{product.images.length - 1} more image(s)
          </Typography>
        )}
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
