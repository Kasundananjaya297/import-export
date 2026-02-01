/** @format */

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { productService, Product } from "../../services/productService";
import ProductManagementCard from "../../components/products/ProductManagementCard";
import { useAuth } from "../../context/AuthContext";

const ProductManagement: React.FC = () => {
  const { currentUser, hasStall } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getProductByUserId();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      enqueueSnackbar("Failed to load products", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleStatusChange = async (product: Product, newStatus: string) => {
    try {
      await productService.updateProduct(product.id.toString(), { status: newStatus });
      setProducts((current) =>
        current.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
      );
      enqueueSnackbar(
        `Product marked as ${newStatus === "available" ? "available" : "sold out"}`,
        { variant: "success" }
      );
    } catch (err) {
      console.error("Error updating product status:", err);
      enqueueSnackbar("Failed to update product status", { variant: "error" });
    }
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(productId.toString());
        enqueueSnackbar("Product deleted successfully", { variant: "success" });
        setProducts((current) => current.filter((p) => p.id !== productId));
      } catch (err) {
        console.error("Error deleting product:", err);
        enqueueSnackbar("Failed to delete product", { variant: "error" });
      }
    }
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Product Management
        </Typography>
        {(currentUser?.role === "seller" || currentUser?.role === "exporter") && !hasStall ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/create-stall")}
          >
            Create Stall
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/exporter/add-product")}
          >
            Add New Product
          </Button>
        )}
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="Tea">Tea</MenuItem>
                <MenuItem value="Spices">Spices</MenuItem>
                <MenuItem value="Coconut">Coconut</MenuItem>
                <MenuItem value="Rubber">Rubber</MenuItem>
                <MenuItem value="Textiles">Textiles</MenuItem>
                <MenuItem value="Gems">Gems</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="out_of_stock">Sold Out</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              {filteredProducts.length} product(s) found
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        /* Products Grid */
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductManagementCard
                product={product}
                onEdit={(product) => navigate(`/exporter/edit-product/${product.id}`)}
                onDelete={(product) => handleDelete(product.id)}
                onViewDetails={(product) => navigate(`/listing/${product.id}`)}
                onStatusChange={handleStatusChange}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProductManagement;
