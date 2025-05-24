import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  SelectChangeEvent
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { logs } from '../../data/logs';

const SystemLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Get unique modules
  const modules = Array.from(new Set(logs.map(log => log.module)));
  
  // Get unique statuses
  const statuses = Array.from(new Set(logs.map(log => log.status)));

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleModuleChange = (event: SelectChangeEvent) => {
    setModuleFilter(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  // Apply filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesModule = moduleFilter === '' || log.module === moduleFilter;
    const matchesStatus = statusFilter === '' || log.status === statusFilter;
    
    return matchesSearch && matchesModule && matchesStatus;
  });

  // Sort by timestamp (newest first)
  const sortedLogs = [...filteredLogs].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Pagination
  const paginatedLogs = sortedLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          System Logs
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Monitor system activities and track important events
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search logs..."
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Module</InputLabel>
              <Select
                value={moduleFilter}
                onChange={handleModuleChange}
                label="Module"
              >
                <MenuItem value="">All Modules</MenuItem>
                {modules.map(module => (
                  <MenuItem key={module} value={module}>{module}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusChange}
                label="Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                {statuses.map(status => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 'bold', bgcolor: 'background.default' } }}>
              <TableCell>Timestamp</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLogs.map((log) => (
              <TableRow key={log.id} hover>
                <TableCell>
                  {format(new Date(log.timestamp), 'dd MMM yyyy, HH:mm:ss')}
                </TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>
                  {log.userName !== 'unknown' ? (
                    <>
                      {log.userName}
                      <Typography variant="caption" display="block" color="text.secondary">
                        {log.userRole.charAt(0).toUpperCase() + log.userRole.slice(1)}
                      </Typography>
                    </>
                  ) : (
                    'Unknown User'
                  )}
                </TableCell>
                <TableCell>{log.details}</TableCell>
                <TableCell>
                  <Chip 
                    label={log.module} 
                    size="small"
                    sx={{ 
                      bgcolor: 'primary.light',
                      color: 'primary.dark'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={log.status.charAt(0).toUpperCase() + log.status.slice(1)} 
                    size="small"
                    color={getStatusColor(log.status) as any}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{log.ipAddress}</TableCell>
              </TableRow>
            ))}
            {paginatedLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    No logs found matching the criteria
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredLogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default SystemLogs;