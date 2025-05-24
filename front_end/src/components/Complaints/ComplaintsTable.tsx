import { useState, useMemo } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { Complaint, ComplaintStatus, ComplaintPriority } from '../../types/complaints';
import complaintsData from '../../data/complaints.json';

const priorityColors: Record<ComplaintPriority, string> = {
  Low: 'default',
  Medium: 'info',
  High: 'warning',
  Critical: 'error',
};

const statusColors: Record<ComplaintStatus, string> = {
  Open: 'warning',
  'In Progress': 'info',
  Resolved: 'success',
};

export const ComplaintsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [sortField, setSortField] = useState<keyof Complaint>('submittedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const theme = useTheme();

  const filteredComplaints = useMemo(() => {
    return complaintsData.complaints.filter((complaint) => {
      const matchesSearch = 
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const sortedComplaints = useMemo(() => {
    return [...filteredComplaints].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredComplaints, sortField, sortDirection]);

  const handleSort = (field: keyof Complaint) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        <TextField
          label="Search complaints"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | 'all')}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell 
                onClick={() => handleSort('title')}
                sx={{ cursor: 'pointer' }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2">Title</Typography>
                  {sortField === 'title' && (
                    <IconButton size="small">
                      {sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
                    </IconButton>
                  )}
                </Stack>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell 
                onClick={() => handleSort('submittedDate')}
                sx={{ cursor: 'pointer' }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2">Submitted Date</Typography>
                  {sortField === 'submittedDate' && (
                    <IconButton size="small">
                      {sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
                    </IconButton>
                  )}
                </Stack>
              </TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Submitted By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedComplaints.map((complaint) => (
              <TableRow key={complaint.id} hover>
                <TableCell>
                  <Typography variant="subtitle2">{complaint.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {complaint.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={complaint.status}
                    color={statusColors[complaint.status as ComplaintStatus]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={complaint.priority}
                    color={priorityColors[complaint.priority as ComplaintPriority]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(complaint.submittedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{complaint.department}</TableCell>
                <TableCell>{complaint.submittedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}; 