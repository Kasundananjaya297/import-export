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
} from "@mui/material";
import {
    Search as SearchIcon,
    Store as StoreIcon,
    Visibility as VisibilityIcon,
    Email as EmailIcon,
    ToggleOn as ToggleOnIcon,
    ToggleOff as ToggleOffIcon,
} from "@mui/icons-material";
import { adminService } from "../../services/adminService";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const StallManagement = () => {
    const [stalls, setStalls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        fetchStalls();
    }, []);

    const fetchStalls = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllStalls();
            if (response.success) {
                setStalls(response.data);
            }
        } catch (error: any) {
            console.error("Error fetching stalls:", error);
            enqueueSnackbar(error.message || "Failed to load stalls", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (stall: any) => {
        try {
            const newStatus = stall.status === "inactive" ? "active" : "inactive";
            const response = await adminService.updateStall(stall.id, { status: newStatus });
            if (response.success) {
                setStalls(stalls.map(s => s.id === stall.id ? { ...s, status: newStatus } : s));
                enqueueSnackbar(`Stall ${newStatus === "active" ? "activated" : "deactivated"} successfully`, { variant: "success" });
            }
        } catch (error: any) {
            enqueueSnackbar(error.message || "Failed to update stall status", { variant: "error" });
        }
    };

    const filteredStalls = stalls.filter((stall) => {
        const searchString = searchTerm.toLowerCase();
        return (
            stall.stallName.toLowerCase().includes(searchString) ||
            (stall.description && stall.description.toLowerCase().includes(searchString)) ||
            (stall.user && (
                stall.user.fname.toLowerCase().includes(searchString) ||
                stall.user.lname.toLowerCase().includes(searchString) ||
                stall.user.email.toLowerCase().includes(searchString)
            ))
        );
    });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
                Stall Management
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by stall name, description or owner..."
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
                                <TableCell sx={{ fontWeight: "bold" }}>Stall</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Owner</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Products</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredStalls.length > 0 ? (
                                filteredStalls.map((stall) => (
                                    <TableRow key={stall.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Avatar
                                                    src={stall.logo}
                                                    variant="rounded"
                                                    sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
                                                >
                                                    <StoreIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                                        {stall.stallName}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary" noWrap sx={{ maxWidth: 200, display: "block" }}>
                                                        {stall.description || "No description"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {stall.user ? (
                                                <Box>
                                                    <Typography variant="body2">
                                                        {stall.user.fname} {stall.user.lname}
                                                    </Typography>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <EmailIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                                                        <Typography variant="caption" color="textSecondary">
                                                            {stall.user.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.disabled">Unknown</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={stall.productsCount || 0}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontWeight: "bold" }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={stall.status?.toUpperCase() || "ACTIVE"}
                                                size="small"
                                                color={stall.status === "inactive" ? "default" : "success"}
                                                sx={{ fontWeight: "bold", fontSize: "0.65rem" }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(stall.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                                <Tooltip title={stall.status === "inactive" ? "Activate Stall" : "Deactivate Stall"}>
                                                    <IconButton
                                                        size="small"
                                                        color={stall.status === "inactive" ? "default" : "success"}
                                                        onClick={() => handleToggleStatus(stall)}
                                                    >
                                                        {stall.status === "inactive" ? <ToggleOffIcon /> : <ToggleOnIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="View Stall Page">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => navigate(`/stall/${stall.id}`)}
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
                                        No stalls found matching your search.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default StallManagement;
