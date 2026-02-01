/** @format */

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Container,
    Grid,
    TextField,
    InputAdornment,
    IconButton,
    Drawer,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Paper,
    Divider
} from "@mui/material";
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Close as CloseIcon,
    Waves as FishIcon,
    Inventory as QtyIcon,
    Refresh as ResetIcon
} from "@mui/icons-material";
import { productService, Product } from "../services/productService";

const FishPool: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Filters State
    const [filters, setFilters] = useState({
        origin: "all",
        species: "all",
        variety: "all",
        gender: "all",
        breedingStatus: "all",
        sizeUnit: "all"
    });

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const data = await productService.getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching fish pool data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleFilterChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        setFilters({
            origin: "all",
            species: "all",
            variety: "all",
            gender: "all",
            breedingStatus: "all",
            sizeUnit: "all"
        });
        setSearchTerm("");
    };

    // Derived Data
    const countries = useMemo(() => ["all", ...new Set(products.map(p => p.origin).filter(Boolean))], [products]);
    const speciesList = useMemo(() => ["all", ...new Set(products.map(p => p.species).filter(Boolean))], [products]);
    const varieties = useMemo(() => ["all", ...new Set(products.map(p => p.variety).filter(Boolean))], [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.species?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesOrigin = filters.origin === "all" || product.origin === filters.origin;
            const matchesSpecies = filters.species === "all" || product.species === filters.species;
            const matchesVariety = filters.variety === "all" || product.variety === filters.variety;
            const matchesGender = filters.gender === "all" || product.gender === filters.gender;
            const matchesBreeding = filters.breedingStatus === "all" || product.breedingStatus === filters.breedingStatus;
            const matchesSize = filters.sizeUnit === "all" || product.sizeUnit === filters.sizeUnit;

            return matchesSearch && matchesOrigin && matchesSpecies && matchesVariety && matchesGender && matchesBreeding && matchesSize;
        });
    }, [products, searchTerm, filters]);

    const totalQuantity = useMemo(() => {
        return filteredProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
    }, [filteredProducts]);

    const FilterFields = () => (
        <Stack spacing={3} sx={{ p: { xs: 3, md: 0 } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 1 }}>
                Narrow Your Search
            </Typography>

            <FormControl fullWidth size="small">
                <InputLabel>Country of Origin</InputLabel>
                <Select name="origin" value={filters.origin} label="Country of Origin" onChange={handleFilterChange}>
                    {countries.map(c => <MenuItem key={c} value={c}>{c === "all" ? "All Countries" : c}</MenuItem>)}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small">
                <InputLabel>Species</InputLabel>
                <Select name="species" value={filters.species} label="Species" onChange={handleFilterChange}>
                    {speciesList.map(s => <MenuItem key={s} value={s}>{s === "all" ? "All Species" : s}</MenuItem>)}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small">
                <InputLabel>Variety</InputLabel>
                <Select name="variety" value={filters.variety} label="Variety" onChange={handleFilterChange}>
                    {varieties.map(v => <MenuItem key={v} value={v}>{v === "all" ? "All Varieties" : v}</MenuItem>)}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small">
                <InputLabel>Gender</InputLabel>
                <Select name="gender" value={filters.gender} label="Gender" onChange={handleFilterChange}>
                    <MenuItem value="all">All Genders</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="mixed">Mixed</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth size="small">
                <InputLabel id="size-range-label">Size Range</InputLabel>
                <Select
                    labelId="size-range-label"
                    name="sizeUnit"
                    value={filters.sizeUnit}
                    label="Size Range"
                    onChange={handleFilterChange}
                >
                    <MenuItem value="all">Any Size</MenuItem>
                    <MenuItem value="S">Small (S)</MenuItem>
                    <MenuItem value="M">Medium (M)</MenuItem>
                    <MenuItem value="L">Large (L)</MenuItem>
                    <MenuItem value="XL">Extra Large (XL)</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth size="small">
                <InputLabel>Breeding Status</InputLabel>
                <Select name="breedingStatus" value={filters.breedingStatus} label="Breeding Status" onChange={handleFilterChange}>
                    <MenuItem value="all">Any Status</MenuItem>
                    <MenuItem value="not_paired">Not Paired</MenuItem>
                    <MenuItem value="paired_out">Paired Out</MenuItem>
                    <MenuItem value="confirmed_pair">Confirmed Pair</MenuItem>
                </Select>
            </FormControl>

            <Button
                variant="outlined"
                fullWidth
                startIcon={<ResetIcon />}
                onClick={resetFilters}
                sx={{ borderRadius: 2 }}
            >
                Reset Filters
            </Button>
        </Stack>
    );

    return (
        <Box sx={{ minHeight: '100vh', pt: { xs: 2, md: 4 }, pb: 8, bgcolor: '#f8fafc' }}>
            <Container maxWidth="xl">
                {/* Header Section */}
                <Box sx={{ mb: 4 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 900, color: 'slate.900', mb: 0.5, letterSpacing: -1 }}>
                                Fish <Box component="span" sx={{ color: 'primary.main' }}>Pool</Box>
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Explore live inventory across the global marketplace
                            </Typography>
                        </Box>

                        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ bgcolor: 'primary.light', p: 1, borderRadius: 2, color: 'primary.main' }}>
                                <QtyIcon />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>TOTAL FISH AVAILABLE</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>{totalQuantity.toLocaleString()}</Typography>
                            </Box>
                        </Paper>
                    </Stack>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                placeholder="Search by name or species..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 4, bgcolor: 'white' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<FilterIcon />}
                                onClick={() => setIsFilterOpen(true)}
                                sx={{
                                    height: '56px',
                                    borderRadius: 4,
                                    boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                                    background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)',
                                    }
                                }}
                            >
                                Filter Inventory
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <Grid container spacing={4}>
                    {/* Product Feed */}
                    <Grid item xs={12}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                {filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                                        {filteredProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="glass-card rounded-xl overflow-hidden group flex flex-row sm:flex-col h-auto border border-slate-200 hover:shadow-xl transition-all cursor-pointer"
                                                onClick={() => navigate(`/listing/${product.id}`)}
                                            >
                                                {/* Image Section */}
                                                <div className="w-32 sm:w-full h-full sm:aspect-square bg-slate-800 relative flex-shrink-0">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs text-white">No Image</div>
                                                    )}
                                                    <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] sm:text-xs text-white">
                                                        {product.origin}
                                                    </div>
                                                </div>

                                                {/* Info Section */}
                                                <div className="p-2 sm:p-4 flex flex-col justify-between flex-grow min-w-0">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div className="min-w-0">
                                                            <h3 className="font-bold text-xs sm:text-lg truncate text-slate-900">{product.species || product.name}</h3>
                                                            <p className="text-[10px] sm:text-sm text-cyan-500 truncate leading-tight font-medium">{product.variety}</p>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="font-bold text-xs sm:text-lg flex-shrink-0 text-slate-900">Rs.{parseFloat(product.price).toFixed(0)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Details */}
                                                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 mt-1 border-t border-slate-100 pt-1">
                                                        <span className="bg-slate-50 px-2 py-0.5 rounded">
                                                            <span className="text-cyan-600 font-bold">Qty:</span> {product.quantity} {product.unit}
                                                        </span>
                                                        <span className="bg-slate-50 px-2 py-0.5 rounded">
                                                            <span className="text-cyan-600 font-bold">Size:</span> {product.sizeValue}{product.sizeUnit}
                                                        </span>
                                                        {product.gender && (
                                                            <span className="bg-slate-50 px-2 py-0.5 rounded">
                                                                <span className="text-cyan-600 font-bold">Sex:</span> {product.gender}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <button
                                                        className="mt-2 sm:mt-4 bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-all py-1.5 sm:py-2 rounded-2xl text-[10px] sm:text-sm font-medium sm:opacity-0 group-hover:opacity-100 transition-opacity block w-full text-center"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 8, bgcolor: 'white', border: '1px dashed', borderColor: 'divider' }}>
                                        <FishIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>No fish found</Typography>
                                        <Typography variant="body1" color="text.secondary">Try adjusting your filters or search terms</Typography>
                                        <Button
                                            variant="text"
                                            onClick={resetFilters}
                                            sx={{ mt: 2 }}
                                        >
                                            Clear all filters
                                        </Button>
                                    </Paper>
                                )}
                            </>
                        )}
                    </Grid>
                </Grid>
            </Container>

            {/* Mobile Filter Drawer */}
            <Drawer
                anchor={isMobile ? "bottom" : "right"}
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: isMobile ? 30 : 0,
                        borderTopRightRadius: isMobile ? 30 : 0,
                        borderBottomLeftRadius: isMobile ? 0 : 30,
                        maxHeight: isMobile ? '80vh' : '100vh',
                        width: isMobile ? '100%' : '400px'
                    }
                }}
            >
                <Box sx={{ px: 3, pt: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Filters</Typography>
                    <IconButton onClick={() => setIsFilterOpen(false)}><CloseIcon /></IconButton>
                </Box>
                <Divider />
                <Box sx={{ overflowY: 'auto' }}>
                    <FilterFields />
                </Box>
                <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={() => setIsFilterOpen(false)}
                        sx={{ borderRadius: 3 }}
                    >
                        Show {filteredProducts.length} Results
                    </Button>
                </Box>
            </Drawer>
        </Box>
    );
};

export default FishPool;
