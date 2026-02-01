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
    Rating,
    TextField,
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    Store as StoreIcon,
    Info as InfoIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    WhatsApp as WhatsAppIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { productService, Product, Stall } from "../services/productService";
import { reviewService } from "../services/reviewService";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/products/ProductCard";
import StarIcon from '@mui/icons-material/Star';

const StallDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [stall, setStall] = useState<Stall | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [stats, setStats] = useState<{ averageRating: number; totalReviews: number }>({ averageRating: 0, totalReviews: 0 });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newRating, setNewRating] = useState<number | null>(5);
    const [newComment, setNewComment] = useState("");
    const [userReview, setUserReview] = useState<any | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchStallData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const [stallData, productsData, reviewData] = await Promise.all([
                    productService.getStallById(id),
                    productService.getProductsByStallId(id),
                    reviewService.getReviewsByStallId(Number(id)),
                ]);
                setStall(stallData);
                setProducts(productsData);
                const fetchedReviews = reviewData.data.reviews || [];
                setReviews(fetchedReviews);
                setStats(reviewData.data.stats || { averageRating: 0, totalReviews: 0 });

                // Find current user's review
                if (currentUser) {
                    const review = fetchedReviews.find((r: any) => r.userId === currentUser.id);
                    if (review) {
                        setUserReview(review);
                        setNewRating(review.rating);
                        setNewComment(review.comment);
                    } else {
                        setUserReview(null);
                        setNewRating(5);
                        setNewComment("");
                    }
                }
            } catch (err) {
                console.error("Error fetching stall data:", err);
                enqueueSnackbar("Failed to load stall details", { variant: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchStallData();
    }, [id, enqueueSnackbar]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !newRating || !newComment.trim()) return;

        try {
            setSubmitting(true);
            if (isEditMode && userReview) {
                await reviewService.updateReview(userReview.id, {
                    rating: newRating,
                    comment: newComment,
                });
                enqueueSnackbar("Review updated successfully!", { variant: "success" });
                setIsEditMode(false);
            } else {
                await reviewService.createReview({
                    stallId: Number(id),
                    rating: newRating,
                    comment: newComment,
                });
                enqueueSnackbar("Review submitted successfully!", { variant: "success" });
            }

            // Refresh reviews
            const reviewData = await reviewService.getReviewsByStallId(Number(id));
            const fetchedReviews = reviewData.data.reviews || [];
            setReviews(fetchedReviews);
            setStats(reviewData.data.stats || { averageRating: 0, totalReviews: 0 });

            // Re-find user review
            if (currentUser) {
                const review = fetchedReviews.find((r: any) => r.userId === currentUser.id);
                setUserReview(review || null);
            }
        } catch (error: any) {
            enqueueSnackbar(error.message || "Failed to submit review", { variant: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId?: number) => {
        const idToDelete = reviewId || userReview?.id;
        if (!idToDelete) return;

        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            setSubmitting(true);
            await reviewService.deleteReview(idToDelete);
            enqueueSnackbar("Review deleted successfully!", { variant: "success" });

            // If deleting own review, clear states
            if (userReview && idToDelete === userReview.id) {
                setUserReview(null);
                setNewRating(5);
                setNewComment("");
                setIsEditMode(false);
            }

            // Refresh reviews
            const reviewData = await reviewService.getReviewsByStallId(Number(id));
            setReviews(reviewData.data.reviews || []);
            setStats(reviewData.data.stats || { averageRating: 0, totalReviews: 0 });
        } catch (error: any) {
            enqueueSnackbar(error.message || "Failed to delete review", { variant: "error" });
        } finally {
            setSubmitting(false);
        }
    };

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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Rating
                                    value={stats.averageRating}
                                    precision={0.5}
                                    readOnly
                                    emptyIcon={<StarIcon style={{ opacity: 0.55, color: 'white' }} fontSize="inherit" />}
                                />
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {stats.averageRating} ({stats.totalReviews} reviews)
                                </Typography>
                            </Box>
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
                    {/* Products & Reviews Section */}
                    <Grid item xs={12} md={9}>
                        <Box className="glass-panel" sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, bgcolor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    Available Products ({products.length})
                                </Typography>
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

                        {/* Reviews Section */}
                        <Box className="glass-panel" sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, bgcolor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>
                                Ratings & Reviews
                            </Typography>

                            {/* Review Form */}
                            {currentUser && (currentUser.role === 'buyer' || currentUser.role === 'importer') ? (
                                userReview && !isEditMode ? (
                                    <Box sx={{ mb: 6, p: 3, bgcolor: 'primary.50', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>You've already reviewed this stall</Typography>
                                            <Typography variant="caption" color="text.secondary">Thank you for your feedback!</Typography>
                                        </Box>
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<EditIcon />}
                                                onClick={() => setIsEditMode(true)}
                                            >
                                                Edit Review
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteReview()}
                                            >
                                                Delete
                                            </Button>
                                        </Stack>
                                    </Box>
                                ) : (
                                    <Box component="form" onSubmit={handleReviewSubmit} sx={{ mb: 6, p: 3, bgcolor: isEditMode ? 'amber.50' : 'grey.50', borderRadius: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                {isEditMode ? 'Edit Your Review' : 'Write a Review'}
                                            </Typography>
                                            {isEditMode && (
                                                <IconButton size="small" onClick={() => {
                                                    setIsEditMode(false);
                                                    setNewRating(userReview.rating);
                                                    setNewComment(userReview.comment);
                                                }}>
                                                    <CloseIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Your Rating</Typography>
                                            <Rating
                                                value={newRating}
                                                onChange={(_, value) => setNewRating(value)}
                                                size="large"
                                            />
                                        </Box>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            placeholder="Share your experience with this stall..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            sx={{ bgcolor: 'white', mb: 2 }}
                                        />
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={submitting || !newRating || !newComment.trim()}
                                            startIcon={submitting && <CircularProgress size={20} color="inherit" />}
                                        >
                                            {isEditMode ? 'Update Review' : 'Submit Review'}
                                        </Button>
                                    </Box>
                                )
                            ) : !currentUser ? (
                                <Box sx={{ mb: 6, p: 3, bgcolor: 'blue.50', borderRadius: 2, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                        Please <Button size="small" onClick={() => navigate('/login')}>Login</Button> to leave a review.
                                    </Typography>
                                </Box>
                            ) : null}

                            {/* Reviews List */}
                            <Stack spacing={3}>
                                {reviews.length > 0 ? (
                                    reviews.map((review: any) => (
                                        <Box key={review.id}>
                                            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                                                    {review.user?.fname?.[0] || 'U'}
                                                </Avatar>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                                {review.user?.fname} {review.user?.lname}
                                                            </Typography>
                                                            {currentUser && review.userId === currentUser.id && (
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        px: 1,
                                                                        py: 0.2,
                                                                        bgcolor: 'primary.main',
                                                                        color: 'white',
                                                                        borderRadius: 1,
                                                                        fontSize: '0.65rem',
                                                                        fontWeight: 700
                                                                    }}
                                                                >
                                                                    YOU
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Box>
                                                            <Rating value={review.rating} size="small" readOnly sx={{ mb: 1 }} />
                                                            <Typography variant="body2" color="text.secondary">
                                                                {review.comment}
                                                            </Typography>
                                                        </Box>
                                                        {currentUser && (review.userId === currentUser.id || currentUser.role === 'admin') && (
                                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                {review.userId === currentUser.id && (
                                                                    <IconButton size="small" color="primary" onClick={() => setIsEditMode(true)}>
                                                                        <EditIcon sx={{ fontSize: '1.2rem' }} />
                                                                    </IconButton>
                                                                )}
                                                                <IconButton size="small" color="error" onClick={() => handleDeleteReview(review.id)}>
                                                                    <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                                                                </IconButton>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Divider sx={{ mt: 2 }} />
                                        </Box>
                                    ))
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">No reviews yet. Be the first to review!</Typography>
                                    </Box>
                                )}
                            </Stack>
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

                            {/* Rating Summary Card */}
                            <Card sx={{ borderRadius: 4, bgcolor: 'rgba(240,249,255,0.8)', border: '1px solid rgba(0,183,235,0.1)', boxShadow: 'none' }}>
                                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800, mb: 0.5 }}>
                                        {stats.averageRating}
                                    </Typography>
                                    <Rating value={stats.averageRating} precision={0.5} readOnly sx={{ mb: 1 }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Stall Reputation</Typography>
                                    <Typography variant="caption" color="text.secondary">Based on {stats.totalReviews} buyer reviews</Typography>
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
