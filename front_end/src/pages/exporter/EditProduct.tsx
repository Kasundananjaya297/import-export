/** @format */

import React, { useState, useEffect } from "react";
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
    CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { productService, AddProductWithCloudinaryData } from "../../services/productService";
import CloudinaryImageUpload from "../../components/common/CloudinaryImageUpload";
import ImageGallery from "../../components/common/ImageGallery";

const units = ["Piece", "Pair"];

const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<AddProductWithCloudinaryData>({
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

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const product = await productService.getProductById(id);

                // Populate form data
                setFormData({
                    name: product.name,
                    category: product.category || "",
                    description: product.description || "",
                    price: product.price.toString(),
                    quantity: product.quantity.toString(),
                    unit: product.unit,
                    minOrderQuantity: product.minOrderQuantity?.toString() || "",
                    images: product.images || [],
                    specifications: product.specifications || "",
                    origin: product.origin || "",
                    certification: product.certification || "",
                    // @ts-ignore - these might be on the object from backend
                    species: product.species || "",
                    // @ts-ignore
                    variety: product.variety || "",
                    // @ts-ignore
                    wholesalePrice: product.wholesalePrice?.toString() || "",
                    // @ts-ignore
                    sizeValue: product.sizeValue?.toString() || "",
                    // @ts-ignore
                    sizeUnit: product.sizeUnit || "cm",
                    // @ts-ignore
                    ageValue: product.ageValue?.toString() || "",
                    // @ts-ignore
                    ageUnit: product.ageUnit || "months",
                    // @ts-ignore
                    gender: product.gender || "mixed",
                    // @ts-ignore
                    breedingStatus: product.breedingStatus || "not_paired",
                    // @ts-ignore
                    feedingFoodType: product.feedingFoodType || "",
                    // @ts-ignore
                    feedingFrequency: product.feedingFrequency || "",
                    // @ts-ignore
                    video: product.video || "",
                });
                setImageUrls(product.images || []);
            } catch (err) {
                console.error("Error fetching product:", err);
                enqueueSnackbar("Failed to load product details", { variant: "error" });
                navigate("/exporter/products");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate, enqueueSnackbar]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleImagesChange = (urls: string[]) => {
        setImageUrls(urls);
        if (urls.length > 0 && errors.images) {
            setErrors((prev) => ({ ...prev, images: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Product name is required";
        if (!formData.price) newErrors.price = "Price is required";
        if (!formData.quantity) newErrors.quantity = "Quantity is required";
        if (!formData.unit) newErrors.unit = "Unit is required";
        if (imageUrls.length === 0) {
            newErrors.images = "At least one product image is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !id) return;

        setIsSubmitting(true);
        try {
            const updateData = {
                ...formData,
                images: imageUrls,
            };
            await productService.updateProduct(id, updateData);
            enqueueSnackbar("Product updated successfully!", { variant: "success" });
            navigate("/exporter/products");
        } catch (error) {
            console.error("Error updating product:", error);
            enqueueSnackbar("Failed to update product", { variant: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                    Edit Product
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                    Modify the details of your listed product
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

                        {/* Fish Listing Fields */}
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
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Feeding Frequency"
                                name="feedingFrequency"
                                value={formData.feedingFrequency}
                                onChange={handleChange}
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
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Retail Price"
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
                                Product Media
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
                                    Current Media
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
                            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate("/exporter/products")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    sx={{ px: 4 }}
                                >
                                    {isSubmitting ? "Updating..." : "Update Product"}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default EditProduct;
