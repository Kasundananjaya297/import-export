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
    Chip,
    TextField,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import {
    Search as SearchIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Business as BusinessIcon,
} from "@mui/icons-material";
import { adminService } from "../../services/adminService";
import { useSnackbar } from "notistack";

const Users = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllUsers();
            if (response.success) {
                setUsers(response.data);
            }
        } catch (error: any) {
            console.error("Error fetching users:", error);
            enqueueSnackbar(error.message || "Failed to load users", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) => {
        const searchString = searchTerm.toLowerCase();
        return (
            user.fname.toLowerCase().includes(searchString) ||
            user.lname.toLowerCase().includes(searchString) ||
            user.email.toLowerCase().includes(searchString) ||
            user.role.toLowerCase().includes(searchString) ||
            (user.company && user.company.toLowerCase().includes(searchString))
        );
    });

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin":
                return "error";
            case "exporter":
            case "seller":
                return "primary";
            case "importer":
            case "buyer":
                return "success";
            default:
                return "default";
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
                User Management
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name, email, role or company..."
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
                                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Contact Information</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Company</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2">
                                                {user.fname} {user.lname}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                ID: #{user.id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role.toUpperCase()}
                                                size="small"
                                                color={getRoleColor(user.role) as any}
                                                sx={{ fontWeight: "bold", fontSize: "0.65rem" }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                                                <EmailIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                                                <Typography variant="body2">{user.email}</Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <PhoneIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                                                <Typography variant="body2">{user.contact}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {user.city}, {user.country}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {user.company ? (
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                    <BusinessIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                                                    <Typography variant="body2">{user.company}</Typography>
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.disabled">
                                                    N/A
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                        No users found matching your search.
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

export default Users;
