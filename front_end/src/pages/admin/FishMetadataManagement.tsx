/** @format */

import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { adminService } from "../../services/adminService";
import { useSnackbar } from "notistack";

interface Species {
    id: number;
    name: string;
    varieties?: Variety[];
}

interface Variety {
    id: number;
    name: string;
    speciesId: number;
    species?: Species;
}

const FishMetadataManagement = () => {
    const [tabValue, setTabValue] = useState(0);
    const [species, setSpecies] = useState<Species[]>([]);
    const [varieties, setVarieties] = useState<Variety[]>([]);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    // Dialog State
    const [open, setOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", speciesId: "" });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [speciesRes, varietiesRes] = await Promise.all([
                adminService.getSpecies(),
                adminService.getVarieties(),
            ]);
            setSpecies(speciesRes.data);
            setVarieties(varietiesRes.data);
        } catch (error: any) {
            enqueueSnackbar(error.message || "Failed to load metadata", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (item: any = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                speciesId: item.speciesId?.toString() || "",
            });
        } else {
            setEditingItem(null);
            setFormData({ name: "", speciesId: "" });
        }
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditingItem(null);
        setFormData({ name: "", speciesId: "" });
    };

    const handleSubmit = async () => {
        try {
            if (!formData.name) return;

            if (tabValue === 0) {
                // Species
                if (editingItem) {
                    await adminService.updateSpecies(editingItem.id, formData.name);
                    enqueueSnackbar("Species updated", { variant: "success" });
                } else {
                    await adminService.createSpecies(formData.name);
                    enqueueSnackbar("Species created", { variant: "success" });
                }
            } else {
                // Variety
                if (!formData.speciesId) return;
                if (editingItem) {
                    await adminService.updateVariety(editingItem.id, formData.name, parseInt(formData.speciesId));
                    enqueueSnackbar("Variety updated", { variant: "success" });
                } else {
                    await adminService.createVariety(formData.name, parseInt(formData.speciesId));
                    enqueueSnackbar("Variety created", { variant: "success" });
                }
            }
            handleCloseDialog();
            fetchData();
        } catch (error: any) {
            enqueueSnackbar(error.message || "Operation failed", { variant: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            if (tabValue === 0) {
                await adminService.deleteSpecies(id);
                enqueueSnackbar("Species deleted", { variant: "success" });
            } else {
                await adminService.deleteVariety(id);
                enqueueSnackbar("Variety deleted", { variant: "success" });
            }
            fetchData();
        } catch (error: any) {
            enqueueSnackbar(error.message || "Delete failed", { variant: "error" });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
                Fish Metadata Management
            </Typography>

            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} centered>
                    <Tab label="Species" />
                    <Tab label="Varieties" />
                </Tabs>
            </Paper>

            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add {tabValue === 0 ? "Species" : "Variety"}
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ bgcolor: "grey.50" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                                {tabValue === 1 && (
                                    <TableCell sx={{ fontWeight: "bold" }}>Species</TableCell>
                                )}
                                <TableCell sx={{ fontWeight: "bold" }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tabValue === 0 ? (
                                species.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell>{s.name}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleOpenDialog(s)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(s.id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                varieties.map((v) => (
                                    <TableRow key={v.id}>
                                        <TableCell>{v.name}</TableCell>
                                        <TableCell>{v.species?.name || "Unknown"}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleOpenDialog(v)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(v.id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    {editingItem ? "Edit" : "Add"} {tabValue === 0 ? "Species" : "Variety"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        {tabValue === 1 && (
                            <TextField
                                select
                                fullWidth
                                label="Species"
                                value={formData.speciesId}
                                onChange={(e) => setFormData({ ...formData, speciesId: e.target.value })}
                            >
                                {species.map((s) => (
                                    <MenuItem key={s.id} value={s.id.toString()}>
                                        {s.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={!formData.name || (tabValue === 1 && !formData.speciesId)}>
                        {editingItem ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FishMetadataManagement;
