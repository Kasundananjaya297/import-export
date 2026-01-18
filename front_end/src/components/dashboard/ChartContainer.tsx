import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: number | string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ 
  title, 
  subtitle, 
  children, 
  height = 300 
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box mb={subtitle ? 1 : 2}>
        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ height, minHeight: height, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </Box>
    </Paper>
  );
};

export default ChartContainer;