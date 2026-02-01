/** @format */

import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Container,
} from "@mui/material";
import { useSnackbar } from "notistack";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/index";
import { useAuth } from "../../context/AuthContext";
import CloudinaryImageUpload from "../../components/common/CloudinaryImageUpload";

interface StallData {
    id: number;
    stallName: string;
    description: string;
    logo: string;
    status: string;
}

const StallManagement: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { currentUser, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [stallData, setStallData] = useState<StallData | null>(null);
    const token = localStorage.getItem("token") || currentUser?.token;

    useEffect(() => {
        fetchStallData();
    }, []);

    const fetchStallData = async () => {
        try {
            setLoading(true);
            const url = `${API_BASE_URL}${API_ENDPOINTS.STALL.GET_BY_USER}`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                setStallData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching stall data:", error);
            enqueueSnackbar("Failed to load stall data", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (stallData) {
            setStallData({ ...stallData, [name]: value });
        }
    };

    const handleLogoChange = (urls: string[]) => {
        if (stallData && urls.length > 0) {
            setStallData({ ...stallData, logo: urls[0] });
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stallData) return;

        try {
            setIsUpdating(true);
            const url = `${API_BASE_URL}${API_ENDPOINTS.STALL.UPDATE}`;
            const response = await axios.put(
                url,
                {
                    stallName: stallData.stallName,
                    description: stallData.description,
                    logo: stallData.logo,
                    status: stallData.status,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                enqueueSnackbar("Stall updated successfully", { variant: "success" });
                updateUser({ stall: response.data.data });
                setStallData(response.data.data);
            }
        } catch (error) {
            console.error("Error updating stall:", error);
            enqueueSnackbar("Failed to update stall", { variant: "error" });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!stallData) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h6" color="text.secondary">
                        No stall found. Please create a stall first.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => window.location.href = "/create-stall"}
                    >
                        Create Stall
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                    Stall Management
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                    Manage your stall details and branding
                </Typography>

                <Box component="form" onSubmit={handleUpdate}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Stall Name"
                                name="stallName"
                                value={stallData.stallName}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={stallData.description}
                                onChange={handleChange}
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Stall Logo
                            </Typography>
                            <CloudinaryImageUpload
                                onImagesChange={handleLogoChange}
                                maxImages={1}
                            />
                            {stallData.logo && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Current Logo:
                                    </Typography>
                                    <Box
                                        component="img"
                                        src={stallData.logo}
                                        alt="Stall Logo"
                                        sx={{
                                            width: 150,
                                            height: 150,
                                            objectFit: "contain",
                                            border: "1px solid #ddd",
                                            borderRadius: 1,
                                        }}
                                    />
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={isUpdating}
                                sx={{ px: 4 }}
                            >
                                {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Update Stall"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default StallManagement;
