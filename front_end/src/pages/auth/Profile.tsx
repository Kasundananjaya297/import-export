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
    Divider,
} from "@mui/material";
import { useSnackbar } from "notistack";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/index";
import { useAuth } from "../../context/AuthContext";

const Profile: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { currentUser, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [formData, setFormData] = useState({
        fname: currentUser?.fname || "",
        lname: currentUser?.lname || "",
        contact: currentUser?.contact || "",
        gender: currentUser?.gender || "",
        addressLine1: currentUser?.addressLine1 || "",
        addressLine2: currentUser?.addressLine2 || "",
        city: currentUser?.city || "",
        state: currentUser?.state || "",
        zipCode: currentUser?.zipCode || "",
        country: currentUser?.country || "",
        company: currentUser?.company || "",
    });

    const token = localStorage.getItem("token") || currentUser?.token;

    useEffect(() => {
        // If we need to fetch the most up-to-date data from the server
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const url = `${API_BASE_URL}${API_ENDPOINTS.USER.GET_CURRENT}`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                const user = response.data.data;
                setFormData({
                    fname: user.fname || "",
                    lname: user.lname || "",
                    contact: user.contact || "",
                    gender: user.gender || "",
                    addressLine1: user.addressLine1 || "",
                    addressLine2: user.addressLine2 || "",
                    city: user.city || "",
                    state: user.state || "",
                    zipCode: user.zipCode || "",
                    country: user.country || "",
                    company: user.company || "",
                });
                updateUser(user);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            // Fallback to local data if fetch fails
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsUpdating(true);
            const url = `${API_BASE_URL}${API_ENDPOINTS.USER.UPDATE_PROFILE}`;
            const response = await axios.put(
                url,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                enqueueSnackbar("Profile updated successfully", { variant: "success" });
                updateUser(response.data.data);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            enqueueSnackbar("Failed to update profile", { variant: "error" });
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

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                    User Profile
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                    Manage your personal information, contact details and address
                </Typography>

                <Box component="form" onSubmit={handleUpdate}>
                    <Typography variant="h6" gutterBottom color="primary">
                        Personal Information
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="fname"
                                value={formData.fname}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lname"
                                value={formData.lname}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Contact Number"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Company / Organization"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 4 }} />

                    <Typography variant="h6" gutterBottom color="primary">
                        Address Details
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address Line 1"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address Line 2"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="State / Province"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Zip / Postal Code"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={isUpdating}
                                sx={{ px: 4 }}
                            >
                                {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;
