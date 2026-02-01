/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    Chip,
    IconButton,
    CircularProgress,
    Divider,
    Stack,
    Avatar,
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    ShoppingCart as ShoppingCartIcon,
    Inventory as InventoryIcon,
    LocationOn as LocationIcon,
    Waves as SpeciesIcon,
    Pets as VarietyIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Info as InfoIcon,
    Store as StoreIcon,
    Lightbulb as LightbulbIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { productService, Product } from "../services/productService";
import { useAuth } from "../context/AuthContext";

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error("Error fetching product:", err);
                enqueueSnackbar("Failed to load product details", { variant: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, enqueueSnackbar]);

    const handleNextImage = () => {
        if (!product?.images) return;
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const handlePrevImage = () => {
        if (!product?.images) return;
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            enqueueSnackbar("Please register to place an order", { variant: "info" });
            navigate("/register");
            return;
        }
        // Logic for adding to cart or redirecting to order placement
        navigate(`/importer/place-order/${id}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!product) {
        return (
            <Container sx={{ py: 8, textAlign: "center" }}>
                <Typography variant="h5" color="text.secondary">Product not found</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")} sx={{ mt: 2 }}>
                    Back to Home
                </Button>
            </Container>
        );
    }

    const isSoldOut = product.status === "out_of_stock" || product.quantity === 0;

    return (
        <Box sx={{ pb: { xs: 10, md: 4 } }}>
            {/* Mobile Top Header */}
            <Box sx={{
                display: { xs: 'flex', md: 'none' },
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                p: 2,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
                pointerEvents: 'none'
            }}>
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{ bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' }, pointerEvents: 'auto' }}
                >
                    <ArrowBackIcon />
                </IconButton>
            </Box>

            <Container maxWidth="lg" sx={{ pt: { xs: 0, md: 4 } }}>
                <Grid container spacing={4}>
                    {/* Left Side - Image Gallery */}
                    <Grid item xs={12} md={7}>
                        <Box sx={{ position: 'relative', borderRadius: { xs: 0, md: 4 }, overflow: 'hidden', bgcolor: 'black', aspectRatio: '4/3' }}>
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[currentImageIndex]}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            ) : (
                                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.500' }}>
                                    No Images Available
                                </Box>
                            )}

                            {/* Navigation Arrows */}
                            {product.images && product.images.length > 1 && (
                                <>
                                    <IconButton
                                        onClick={handlePrevImage}
                                        sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.3)', color: 'white' }}
                                    >
                                        <ChevronLeftIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={handleNextImage}
                                        sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.3)', color: 'white' }}
                                    >
                                        <ChevronRightIcon />
                                    </IconButton>

                                    {/* Indicators */}
                                    <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
                                        {product.images.map((_, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    width: idx === currentImageIndex ? 24 : 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: idx === currentImageIndex ? 'primary.main' : 'rgba(255,255,255,0.5)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </>
                            )}

                            {/* Sold Out Overlay */}
                            {isSoldOut && (
                                <Box sx={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    bgcolor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5
                                }}>
                                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', border: '5px solid white', px: 4, py: 2, transform: 'rotate(-15deg)', textTransform: 'uppercase' }}>
                                        Sold Out
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Thumbnail Strip (Desktop) */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mt: 2, overflowX: 'auto', pb: 1 }}>
                            {product.images?.map((img, idx) => (
                                <Box
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    sx={{
                                        width: 80, height: 80, borderRadius: 2, overflow: 'hidden', cursor: 'pointer',
                                        border: '3px solid', borderColor: idx === currentImageIndex ? 'primary.main' : 'transparent',
                                        flexShrink: 0, opacity: idx === currentImageIndex ? 1 : 0.6,
                                        '&:hover': { opacity: 1 }
                                    }}
                                >
                                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* Right Side - Product Info */}
                    <Grid item xs={12} md={5}>
                        <Box sx={{ px: { xs: 2, md: 0 } }}>
                            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                <Chip label={product.category} color="primary" variant="outlined" size="small" />
                                {isSoldOut ? (
                                    <Chip label="Unavailable" color="error" size="small" />
                                ) : (
                                    <Chip label="In Stock" color="success" size="small" />
                                )}
                            </Stack>

                            <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
                                {product.species || product.name}
                            </Typography>
                            <Typography variant="h6" color="cyan.600" sx={{ fontWeight: 600, mb: 2 }}>
                                {product.variety}
                            </Typography>

                            <Box sx={{ mb: 3, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
                                    Rs.{parseFloat(product.price).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">per {product.unit}</Typography>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                                {product.description}
                            </Typography>

                            {/* Metadata Grid */}
                            <Grid container spacing={2} sx={{ mb: 4 }}>
                                <Grid item xs={6}>
                                    <Box className="glass-panel" sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(240,249,255,0.5)', height: '100%' }}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <LocationIcon color="primary" fontSize="small" />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>ORIGIN</Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{product.origin || 'Not Specified'}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box className="glass-panel" sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(240,249,255,0.5)', height: '100%' }}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <InventoryIcon color="primary" fontSize="small" />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>QUANTITY</Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{product.quantity} {product.unit}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box className="glass-panel" sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(240,249,255,0.5)', height: '100%' }}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <LightbulbIcon color="primary" fontSize="small" />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>SIZE</Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{product.sizeValue} {product.sizeUnit}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box className="glass-panel" sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(240,249,255,0.5)', height: '100%' }}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <VarietyIcon color="primary" fontSize="small" />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>AGE</Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{product.ageValue} {product.ageUnit}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Authenticated Only Details */}
                            <Box className="glass-panel" sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.5)', mb: 4 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SpeciesIcon color="primary" /> Additional Information
                                </Typography>

                                {isAuthenticated ? (
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>SEX / GENDER</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>{product.gender || 'Mixed'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>BREEDING STATUS</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>{(product.breedingStatus || 'Not Specified').replace('_', ' ')}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 1, opacity: 0.5 }} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>FEED TYPE</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{product.feedingFoodType || 'Standard'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>FEED FREQUENCY</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{product.feedingFrequency || 'Daily'}</Typography>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                        <InfoIcon color="action" sx={{ mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Registered users can view gender, breeding status, and feeding details.
                                        </Typography>
                                        <Button variant="outlined" size="small" onClick={() => navigate('/register')}>
                                            Register to View
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            {/* Stall Section */}
                            {product.stall && (
                                <Box className="glass-panel" sx={{ p: 2, borderRadius: 4, bgcolor: 'rgba(0,183,235,0.05)', border: '1px solid rgba(0,183,235,0.1)', mb: 4 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar src={product.stall.logo} sx={{ bgcolor: 'primary.main' }}>
                                            <StoreIcon />
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{product.stall.stallName}</Typography>
                                            <Typography variant="caption" color="text.secondary">Professional Seller</Typography>
                                        </Box>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => navigate(`/stall/${product.stall?.id}`)}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Visit Shop
                                        </Button>
                                    </Stack>

                                    {/* Contact Section */}
                                    {(product.user?.contact || product.user?.email) && (
                                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,183,235,0.1)' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
                                                Contact Seller
                                            </Typography>
                                            <Stack spacing={1.5}>
                                                {product.user?.contact && (
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <PhoneIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                                                        <Typography
                                                            variant="body2"
                                                            component="a"
                                                            href={`tel:${product.user.contact}`}
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: 'inherit',
                                                                textDecoration: 'none',
                                                                '&:hover': { color: 'primary.main', textDecoration: 'underline' }
                                                            }}
                                                        >
                                                            {product.user.contact}
                                                        </Typography>
                                                        <IconButton
                                                            size="small"
                                                            component="a"
                                                            href={`https://wa.me/${product.user.contact.replace(/[^0-9]/g, '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            sx={{
                                                                color: '#25D366',
                                                                padding: '2px',
                                                                '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.1)' }
                                                            }}
                                                        >
                                                            <WhatsAppIcon sx={{ fontSize: '1.2rem' }} />
                                                        </IconButton>
                                                    </Stack>
                                                )}
                                                {product.user?.email && (
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <EmailIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                                                        <Typography
                                                            variant="body2"
                                                            component="a"
                                                            href={`mailto:${product.user.email}`}
                                                            sx={{
                                                                fontWeight: 600,
                                                                fontSize: '0.8rem',
                                                                color: 'inherit',
                                                                textDecoration: 'none',
                                                                '&:hover': { color: 'primary.main', textDecoration: 'underline' }
                                                            }}
                                                        >
                                                            {product.user.email}
                                                        </Typography>
                                                    </Stack>
                                                )}
                                            </Stack>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Desktop Sticky Action Bar */}
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    startIcon={<ShoppingCartIcon />}
                                    onClick={handleAddToCart}
                                    disabled={isSoldOut}
                                    sx={{
                                        borderRadius: 3,
                                        py: 2,
                                        fontWeight: 800,
                                        fontSize: '1.1rem',
                                        boxShadow: '0 8px 25px rgba(0,183,235,0.3)'
                                    }}
                                >
                                    {isSoldOut ? 'Currently Unavailable' : 'Place Order Now'}
                                </Button>
                                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: 'text.secondary' }}>
                                    Minimum Order Quantity: {product.minOrderQuantity} {product.unit}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Mobile Sticky Action Bar */}
            <Box sx={{
                display: { xs: 'flex', md: 'none' },
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                bgcolor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(0,0,0,0.1)',
                p: 2,
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Price</Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>Rs.{parseFloat(product.price).toLocaleString()}</Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={handleAddToCart}
                    disabled={isSoldOut}
                    sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
                >
                    {isSoldOut ? 'Sold Out' : 'Place Order'}
                </Button>
            </Box>
        </Box>
    );
};

export default ProductDetails;
