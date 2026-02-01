/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    Avatar,
    IconButton,
    CircularProgress,
    Divider,
    Card,
    CardContent,
    Stack,
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    Store as StoreIcon,
    Lightbulb as LightbulbIcon,
    Info as InfoIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { productService, Product, Stall } from "../services/productService";
import ProductCard from "../components/products/ProductCard";

const StallDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [stall, setStall] = useState<Stall | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStallData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const [stallData, productsData] = await Promise.all([
                    productService.getStallById(id),
                    productService.getProductsByStallId(id),
                ]);
                setStall(stallData);
                setProducts(productsData);
            } catch (err) {
                console.error("Error fetching stall data:", err);
                enqueueSnackbar("Failed to load stall details", { variant: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchStallData();
    }, [id, enqueueSnackbar]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!stall) {
        return (
            <Container sx={{ py: 8, textAlign: "center" }}>
                <Typography variant="h5" color="text.secondary">Stall not found</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")} sx={{ mt: 2 }}>
                    Back to Home
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ pb: 6 }}>
            {/* Hero Header */}
            <Box
                sx={{
                    bgcolor: 'primary.dark',
                    color: 'white',
                    pt: { xs: 4, md: 8 },
                    pb: { xs: 6, md: 10 },
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        opacity: 0.1, background: 'radial-gradient(circle, #fff 0%, transparent 70%)'
                    }}
                />

                <Container maxWidth="lg">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{ color: 'white', mb: 3 }}
                    >
                        Back
                    </Button>

                    <Grid container spacing={4} alignItems="center">
                        <Grid item>
                            <Avatar
                                src={stall.logo}
                                sx={{
                                    width: { xs: 80, md: 120 },
                                    height: { xs: 80, md: 120 },
                                    bgcolor: 'white',
                                    border: '4px solid rgba(255,255,255,0.3)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                                }}
                            >
                                <StoreIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                            </Avatar>
                        </Grid>
                        <Grid item xs={12} sm>
                            <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
                                {stall.stallName}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, maxWidth: 600 }}>
                                {stall.description || "Welcome to our specialized fish stall. We provide the highest quality aquatic life for your collection."}
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 1 }}>
                <Grid container spacing={4}>
                    {/* Products Section */}
                    <Grid item xs={12} md={9}>
                        <Box className="glass-panel" sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, bgcolor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    Available Products ({products.length})
                                </Typography>
                                {/* Filter placeholders for later */}
                            </Box>

                            {products.length > 0 ? (
                                <Grid container spacing={3}>
                                    {products.map((product) => (
                                        <Grid item xs={12} sm={6} lg={4} key={product.id}>
                                            <ProductCard product={product} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        This stall hasn't listed any products yet.
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    {/* Sidebar / Info */}
                    <Grid item xs={12} md={3}>
                        <Stack spacing={3}>
                            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <InfoIcon color="primary" fontSize="small" /> Stall Info
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>MEMBER SINCE</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {new Date(stall.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>STATUS</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: stall.status === 'active' ? 'success.main' : 'error.main' }} />
                                                <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>{stall.status}</Typography>
                                            </Box>
                                        </Box>
                                    </Stack>

                                    <Divider sx={{ my: 2, opacity: 0.5 }} />

                                    {/* Contact Details Section */}
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        Contact Details
                                    </Typography>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.main' }}>
                                                    <PhoneIcon sx={{ fontSize: '1.2rem' }} />
                                                </Avatar>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="caption" display="block" color="text.secondary">Phone Number</Typography>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography
                                                            variant="body2"
                                                            component="a"
                                                            href={`tel:${stall.user?.contact}`}
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: 'inherit',
                                                                textDecoration: 'none',
                                                                '&:hover': { color: 'primary.main', textDecoration: 'underline' }
                                                            }}
                                                        >
                                                            {stall.user?.contact || 'Not provided'}
                                                        </Typography>
                                                        {stall.user?.contact && (
                                                            <IconButton
                                                                size="small"
                                                                component="a"
                                                                href={`https://wa.me/${stall.user.contact.replace(/[^0-9]/g, '')}`}
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
                                                        )}
                                                    </Stack>
                                                </Box>
                                            </Stack>
                                        </Box>

                                        <Box>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.light', color: 'secondary.main' }}>
                                                    <EmailIcon sx={{ fontSize: '1.2rem' }} />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="caption" display="block" color="text.secondary">Email Address</Typography>
                                                    <Typography
                                                        variant="body2"
                                                        component="a"
                                                        href={`mailto:${stall.user?.email}`}
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: stall.user?.email && stall.user.email.length > 20 ? '0.75rem' : '0.875rem',
                                                            color: 'inherit',
                                                            textDecoration: 'none',
                                                            '&:hover': { color: 'primary.main', textDecoration: 'underline' }
                                                        }}
                                                    >
                                                        {stall.user?.email || 'Not provided'}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Ready for ratings placeholder */}
                            <Card sx={{ borderRadius: 4, bgcolor: 'rgba(240,249,255,0.5)', border: '1px dashed rgba(0,183,235,0.3)', boxShadow: 'none' }}>
                                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                    <LightbulbIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1, opacity: 0.5 }} />
                                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 800 }}>Ratings & Reviews</Typography>
                                    <Typography variant="caption" color="text.secondary">Coming soon! You'll be able to see seller reputation and feedback here.</Typography>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default StallDetails;
