/** @format */

import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Button,
  Chip,
} from "@mui/material";
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

  const handleOrderClick = () => {
    navigate(`/importer/place-order/${product.id}`);
  };

  const handleViewDetails = () => {
    // For a real app, this would navigate to a product details page
    console.log("View details for product:", product.id);
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
      <Box sx={{ position: "relative" }}>
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
        <Box sx={{ position: "absolute", top: 12, right: 12 }}>
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
