import {
  Typography,
  Box,
  useTheme
} from '@mui/material';
import { ComplaintsTable } from '../components/Complaints/ComplaintsTable';

export const ComplaintsPage = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Complaints Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all system complaints. Use the search and filters below to find specific complaints.
        </Typography>
      </Box>

      <ComplaintsTable />
    </Box>
  );
}; 