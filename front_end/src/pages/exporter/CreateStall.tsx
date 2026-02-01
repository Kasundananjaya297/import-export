/** @format */
import React, { useState } from "react";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/index";

const CreateStall: React.FC = () => {
    const [formData, setFormData] = useState({
        stallName: "",
        description: "",
        logo: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { updateUser } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const currentUser = localStorage.getItem("currentUser");
            const token = currentUser ? JSON.parse(currentUser).token : null;

            const url = `${API_BASE_URL}${API_ENDPOINTS.STALL.CREATE}`;
            console.log("Creating stall at:", url);
            console.log("Form data:", formData);
            console.log("Token present:", !!token);

            const response = await axios.post(
                url,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Stall creation response:", response.data);

            if (response.data.success || response.data.status === "success") {
                enqueueSnackbar("Stall created successfully!", { variant: "success" });
                updateUser({ stall: response.data.data });
                navigate("/exporter/dashboard");
            } else {
                enqueueSnackbar(response.data.message || "Failed to create stall", { variant: "error" });
            }
        } catch (error: any) {
            console.error("Full stall creation error:", error);
            enqueueSnackbar(
                error.response?.data?.message || "Failed to create stall",
                { variant: "error" }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Create Your Stall
                </Typography>
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                    align="center"
                >
                    Listing your stall allows you to start selling products.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Stall Name"
                                name="stallName"
                                value={formData.stallName}
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
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Logo URL"
                                name="logo"
                                value={formData.logo}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={isSubmitting}
                                sx={{ mt: 2, borderRadius: 10 }}
                            >
                                {isSubmitting ? "Creating..." : "Create Stall"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateStall;
