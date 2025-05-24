import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType | React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = '#1976d2'
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, rgba(255,255,255,0) 60%)`,
      }}
    >
      <Box sx={{ position: 'absolute', top: 24, right: 24, opacity: 0.12 }}>
        {React.isValidElement(icon) ? (
          React.cloneElement(icon as React.ReactElement, {
            style: {
              width: 80,
              height: 80,
              color: color,
            }
          })
        ) : (
          React.createElement(icon as React.ElementType, {
            style: {
              width: 80,
              height: 80,
              color: color,
            }
          })
        )}
      </Box>

      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
        {title}
      </Typography>

      <Typography variant="h4" sx={{ mb: trend ? 1 : 0 }}>
        {value}
      </Typography>

      {trend && (
        <Typography
          variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: trend.isPositive ? 'success.main' : 'error.main',
          }}
        >
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </Typography>
      )}
    </Paper>
  );
};

export default StatCard;