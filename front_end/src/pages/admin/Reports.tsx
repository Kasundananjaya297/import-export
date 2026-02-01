/** @format */

import {
    Box,
    Typography,
    Paper,
    Grid,
} from "@mui/material";
import {
    BarChart as BarChartIcon,
    PieChart as PieChartIcon,
    Timeline as TimelineIcon,
} from "@mui/icons-material";

const Reports = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
                Platform Reports
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, textAlign: "center", minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <BarChartIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">Sales Analytics</Typography>
                        <Typography variant="body2" color="text.disabled">Coming Soon: Detailed breakdown of sales by region and variety.</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, textAlign: "center", minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <PieChartIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">User Demographics</Typography>
                        <Typography variant="body2" color="text.disabled">Coming Soon: Insights into buyer and seller clusters.</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, textAlign: "center", minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <TimelineIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">Supply Chain Metrics</Typography>
                        <Typography variant="body2" color="text.disabled">Coming Soon: Real-time inventory turnover and stock health reports.</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Reports;
