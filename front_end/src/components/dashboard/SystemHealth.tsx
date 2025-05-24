import React from 'react';
import { Paper, Typography, Box, LinearProgress, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface HealthMetric {
  label: string;
  value: string;
  percentage: number;
}

interface SystemHealthProps {
  metrics: {
    uptime: string;
    responseTime: string;
    errorRate: string;
    serverLoad: string;
    memoryUsage: string;
    diskSpace: string;
  };
}

const HealthIndicator: React.FC<HealthMetric> = ({ label, value, percentage }) => {
  const theme = useTheme();
  
  const getColor = (percent: number) => {
    if (percent < 60) return theme.palette.success.main;
    if (percent < 80) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {value}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 6,
          borderRadius: 1,
          bgcolor: theme.palette.grey[200],
          '& .MuiLinearProgress-bar': {
            borderRadius: 1,
            backgroundColor: getColor(percentage),
          },
        }}
      />
    </Box>
  );
};

const SystemHealth: React.FC<SystemHealthProps> = ({ metrics }) => {
  const parsePercentage = (value: string) => {
    return parseFloat(value.replace('%', ''));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        System Health
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <HealthIndicator
            label="Server Load"
            value={metrics.serverLoad}
            percentage={parsePercentage(metrics.serverLoad)}
          />
          <HealthIndicator
            label="Memory Usage"
            value={metrics.memoryUsage}
            percentage={parsePercentage(metrics.memoryUsage)}
          />
          <HealthIndicator
            label="Disk Space"
            value={metrics.diskSpace}
            percentage={parsePercentage(metrics.diskSpace)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h3" color="success.main" gutterBottom>
              {metrics.uptime}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              System Uptime
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              {metrics.responseTime}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Response Time
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SystemHealth; 