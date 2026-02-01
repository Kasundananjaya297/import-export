/** @format */

import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    TextField,
    InputAdornment,
    CircularProgress,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import {
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    Delete as DeleteIcon,
    Store as StoreIcon,
    ToggleOn as ToggleOnIcon,
    CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { adminService } from "../../services/adminService";
import { productService } from "../../services/productService";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getProducts();
            // Handle different response formats properly
            const responseData = response as any;
            const data = responseData.data || (Array.isArray(responseData) ? responseData : []);
            setProducts(data);
        } catch (error: any) {
            console.error("Error fetching products:", error);
            enqueueSnackbar("Failed to load products", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (product: any) => {
        try {
            const newStatus = product.status === "available" ? "out_of_stock" : "available";
            const updatedProduct = await productService.updateProduct(product.id, { status: newStatus });
            if (updatedProduct) {
                setProducts(products.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
                enqueueSnackbar(`Product status updated to ${newStatus.replace('_', ' ')}`, { variant: "success" });
            }
        } catch (error: any) {
            enqueueSnackbar(error.message || "Failed to update product status", { variant: "error" });
        }
    };

    const handleDeleteClick = (product: any) => {
        setSelectedProduct(product);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;
        try {
            await adminService.deleteProduct(selectedProduct.id);
            enqueueSnackbar("Product deleted successfully", { variant: "success" });
            setProducts(products.filter((p) => p.id !== selectedProduct.id));
        } catch (error: any) {
            enqueueSnackbar(error.message || "Failed to delete product", { variant: "error" });
        } finally {
            setDeleteDialogOpen(false);
            setSelectedProduct(null);
        }
    };

    const filteredProducts = products.filter((product) => {
        const searchString = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(searchString) ||
            (product.species && product.species.toLowerCase().includes(searchString)) ||
            (product.variety && product.variety.toLowerCase().includes(searchString)) ||
            (product.stall && product.stall.stallName.toLowerCase().includes(searchString))
        );
    });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
                Product Management
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by product name, species, variety or stall..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    size="small"
                />
            </Paper>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: "grey.50" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Category/Stall</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Details</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Avatar
                                                    src={product.images?.[0]}
                                                    variant="rounded"
                                                    sx={{ width: 40, height: 40 }}
                                                />
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                                        {product.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        ID: #{product.id}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Chip
                                                    label={product.category || "General"}
                                                    size="small"
                                                    sx={{ mb: 0.5, fontSize: '0.65rem' }}
                                                />
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                    <StoreIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                                                    <Typography variant="caption" color="textSecondary">
                                                        {product.stall?.stallName || "No Stall"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                                LKR {product.price}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                per {product.unit}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" display="block">
                                                {product.species} - {product.variety}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                Qty: {product.quantity}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={product.status?.toUpperCase() || "AVAILABLE"}
                                                size="small"
                                                color={product.status === "available" ? "success" : "default"}
                                                sx={{ fontWeight: "bold", fontSize: "0.65rem" }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                                <Tooltip title={product.status === "available" ? "Mark Out of Stock" : "Mark Available"}>
                                                    <IconButton
                                                        size="small"
                                                        color={product.status === "available" ? "success" : "default"}
                                                        onClick={() => handleToggleStatus(product)}
                                                    >
                                                        {product.status === "available" ? <ToggleOnIcon /> : <CheckCircleIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => navigate(`/listing/${product.id}`)}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Product">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteClick(product)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        No products found matching your search.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete product "<strong>{selectedProduct?.name}</strong>"?
                    This action cannot be undone and will remove the product from the marketplace.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Delete Product
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductManagement;
