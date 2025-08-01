/** @format */

import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { productService, AddProductData } from "../../services/productService";
import CloudinaryImageUpload from "../../components/common/CloudinaryImageUpload";
import ImageGallery from "../../components/common/ImageGallery";

const categories = [
  "Tea",
  "Spices",
  "Coconut",
  "Rubber",
  "Textiles",
  "Gems",
  "Other",
];

const units = ["kg", "g", "lb", "ton", "piece", "box", "container"];

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<AddProductData>({
    name: "",
    category: "",
    description: "",
    price: "",
    quantity: "",
    unit: "",
    minOrderQuantity: "",
    images: [],
    specifications: "",
    origin: "",
    certification: "",
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof AddProductData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof AddProductData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImagesChange = (urls: string[]) => {
    setImageUrls(urls);
    // Clear image error if images are uploaded
    if (urls.length > 0 && errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.minOrderQuantity)
      newErrors.minOrderQuantity = "Minimum order quantity is required";
    if (!formData.origin) newErrors.origin = "Origin is required";
    if (imageUrls.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create product data with image URLs instead of files
      const productData = {
        ...formData,
        images: imageUrls, // Use the uploaded image URLs
      };

      await productService.addProduct(productData);
      enqueueSnackbar("Product added successfully!", { variant: "success" });
      navigate("/exporter/dashboard");
    } catch (error) {
      console.error("Error adding product:", error);
      enqueueSnackbar("Failed to add product. Please try again.", {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Product
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Fill in the details below to list your product
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleSelectChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                error={!!errors.origin}
                helperText={errors.origin}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Specifications"
                name="specifications"
                value={formData.specifications}
                onChange={handleChange}
                placeholder="Enter product specifications, features, and details"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Quantity Available"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.unit}>
                <InputLabel>Unit</InputLabel>
                <Select
                  name="unit"
                  value={formData.unit}
                  label="Unit"
                  onChange={handleSelectChange}
                >
                  {units.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Minimum Order Quantity"
                name="minOrderQuantity"
                type="number"
                value={formData.minOrderQuantity}
                onChange={handleChange}
                error={!!errors.minOrderQuantity}
                helperText={errors.minOrderQuantity}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Certification"
                name="certification"
                value={formData.certification}
                onChange={handleChange}
                placeholder="Enter any certifications or quality standards"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Product Images
              </Typography>
              <CloudinaryImageUpload
                onImagesChange={handleImagesChange}
                maxImages={5}
                error={errors.images}
              />
            </Grid>

            {imageUrls.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Image Preview
                </Typography>
                <ImageGallery
                  images={imageUrls}
                  maxHeight={150}
                  showImageCount={false}
                  allowZoom={true}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/exporter/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding Product..." : "Add Product"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddProduct;
