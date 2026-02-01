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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import {
    Search as SearchIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Visibility as VisibilityIcon,
    Store as StoreIcon,
} from "@mui/icons-material";
import { productService, Product } from "../../services/productService";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const ProductApproval = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [actionType, setActionType] = useState<"approve" | "reject">("approve");
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    const fetchPendingProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getPendingProducts();
            setProducts(data || []);
        } catch (error: any) {
            console.error("Error fetching pending products:", error);
            enqueueSnackbar("Failed to load pending products", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleActionClick = (product: Product, type: "approve" | "reject") => {
        setSelectedProduct(product);
        setActionType(type);
        setActionDialogOpen(true);
    };

    const confirmAction = async () => {
        if (!selectedProduct) return;
        try {
            if (actionType === "approve") {
                await productService.approveProduct(selectedProduct.id);
                enqueueSnackbar("Product approved successfully", { variant: "success" });
            } else {
                await productService.rejectProduct(selectedProduct.id);
                enqueueSnackbar("Product rejected successfully", { variant: "info" });
            }
            setProducts(products.filter((p) => p.id !== selectedProduct.id));
        } catch (error: any) {
            enqueueSnackbar(error.message || `Failed to ${actionType} product`, { variant: "error" });
        } finally {
            setActionDialogOpen(false);
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
                Product Approvals
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search pending products..."
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
                                <TableCell sx={{ fontWeight: "bold" }}>Stall</TableCell>
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
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <StoreIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                                <Typography variant="body2">
                                                    {product.stall?.stallName || "No Stall"}
                                                </Typography>
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
                                                label="PENDING"
                                                size="small"
                                                color="warning"
                                                sx={{ fontWeight: "bold", fontSize: "0.65rem" }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                                <Tooltip title="Approve">
                                                    <IconButton
                                                        size="small"
                                                        color="success"
                                                        onClick={() => handleActionClick(product, "approve")}
                                                    >
                                                        <CheckIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Reject">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleActionClick(product, "reject")}
                                                    >
                                                        <CloseIcon />
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
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        No pending products found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Action Confirmation Dialog */}
            <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
                <DialogTitle>Confirm {actionType === "approve" ? "Approval" : "Rejection"}</DialogTitle>
                <DialogContent>
                    Are you sure you want to <strong>{actionType}</strong> product "<strong>{selectedProduct?.name}</strong>"?
                    {actionType === "approve"
                        ? " This will make the product visible to all users."
                        : " This product will stay in the rejected state and won't be visible to users."}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={confirmAction}
                        color={actionType === "approve" ? "success" : "error"}
                        variant="contained"
                    >
                        Confirm {actionType === "approve" ? "Approve" : "Reject"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductApproval;
