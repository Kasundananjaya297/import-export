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

const units = ["Piece", "Pair"];

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
    // New fields
    species: "",
    variety: "",
    wholesalePrice: "",
    sizeValue: "",
    sizeUnit: "cm",
    ageValue: "",
    ageUnit: "months",
    gender: "mixed",
    breedingStatus: "not_paired",
    feedingFoodType: "",
    feedingFrequency: "",
    video: "",
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
    // Category is now optional
    // Description is now optional
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    // Origin is now optional
    if (imageUrls.length === 0) {
      newErrors.images = "At least one product image or video is required";
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





            {/* New Fish Listing Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Species"
                name="species"
                value={formData.species}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Variety"
                name="variety"
                value={formData.variety}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Wholesale Price"
                name="wholesalePrice"
                type="number"
                value={formData.wholesalePrice}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender || "mixed"}
                  label="Gender"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="mixed">Mixed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Breeding Status</InputLabel>
                <Select
                  name="breedingStatus"
                  value={formData.breedingStatus || "not_paired"}
                  label="Breeding Status"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="not_paired">Not Paired</MenuItem>
                  <MenuItem value="paired_out">Paired Out</MenuItem>
                  <MenuItem value="confirmed_pair">Confirmed Pair</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Size"
                  name="sizeValue"
                  value={formData.sizeValue}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  type="number"
                />
                <FormControl sx={{ minWidth: 100 }}>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="sizeUnit"
                    value={formData.sizeUnit}
                    label="Unit"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="cm">cm</MenuItem>
                    <MenuItem value="inch">inch</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Age"
                  name="ageValue"
                  value={formData.ageValue}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  type="number"
                />
                <FormControl sx={{ minWidth: 100 }}>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="ageUnit"
                    value={formData.ageUnit}
                    label="Unit"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="months">Months</MenuItem>
                    <MenuItem value="years">Years</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Food Type"
                name="feedingFoodType"
                value={formData.feedingFoodType}
                onChange={handleChange}
                placeholder="e.g. Pellets, Live Food"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Feeding Frequency"
                name="feedingFrequency"
                value={formData.feedingFrequency}
                onChange={handleChange}
                placeholder="e.g. Twice a day"
              />
            </Grid>



            <Grid item xs={12}>
              <TextField
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





            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Product Images & Videos
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
                  Media Preview
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
    </Container >
  );
};

export default AddProduct;
