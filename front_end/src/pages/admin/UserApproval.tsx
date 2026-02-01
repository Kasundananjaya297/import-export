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
    Person as PersonIcon,
    Email as EmailIcon,
    Business as BusinessIcon,
} from "@mui/icons-material";
import { adminService } from "../../services/adminService";
import { useSnackbar } from "notistack";

const UserApproval = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [actionType, setActionType] = useState<"approve" | "reject">("approve");
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getPendingUsers();
            setUsers(response.data || []);
        } catch (error: any) {
            console.error("Error fetching pending users:", error);
            enqueueSnackbar("Failed to load pending users", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleActionClick = (user: any, type: "approve" | "reject") => {
        setSelectedUser(user);
        setActionType(type);
        setActionDialogOpen(true);
    };

    const confirmAction = async () => {
        if (!selectedUser) return;
        try {
            if (actionType === "approve") {
                await adminService.approveUser(selectedUser.id);
                enqueueSnackbar("User approved successfully", { variant: "success" });
            } else {
                await adminService.rejectUser(selectedUser.id);
                enqueueSnackbar("User rejected successfully", { variant: "info" });
            }
            setUsers(users.filter((u) => u.id !== selectedUser.id));
        } catch (error: any) {
            enqueueSnackbar(error.message || `Failed to ${actionType} user`, { variant: "error" });
        } finally {
            setActionDialogOpen(false);
            setSelectedUser(null);
        }
    };

    const filteredUsers = users.filter((user) => {
        const searchString = searchTerm.toLowerCase();
        return (
            `${user.fname} ${user.lname}`.toLowerCase().includes(searchString) ||
            user.email.toLowerCase().includes(searchString) ||
            (user.role && user.role.toLowerCase().includes(searchString)) ||
            (user.company && user.company.toLowerCase().includes(searchString))
        );
    });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
                User Approvals
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search pending users by name, email, role or company..."
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
                                <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Company</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    <PersonIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                                        {user.fname} {user.lname}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography variant="caption" color="textSecondary">
                                                            {user.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role?.toUpperCase()}
                                                size="small"
                                                variant="outlined"
                                                color={user.role === 'admin' ? 'secondary' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <BusinessIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                                <Typography variant="body2">
                                                    {user.company || "N/A"}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{user.contact}</Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {user.city}, {user.country}
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
                                                        onClick={() => handleActionClick(user, "approve")}
                                                    >
                                                        <CheckIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Reject">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleActionClick(user, "reject")}
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        No pending user signups found.
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
                    Are you sure you want to <strong>{actionType}</strong> user "<strong>{selectedUser?.fname} {selectedUser?.lname}</strong>"?
                    {actionType === "approve"
                        ? " This will grant the user access to login to the system."
                        : " This user will not be able to login to the system."}
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

export default UserApproval;
