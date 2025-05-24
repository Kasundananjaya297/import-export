import React from 'react';
import { Box, Typography, Avatar, Chip } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityItemProps {
  avatarUrl?: string;
  icon?: React.ReactNode;
  primaryText: string;
  secondaryText?: string;
  timestamp: string;
  status?: 'success' | 'error' | 'warning' | 'info';
  statusText?: string;
}

const RecentActivityItem: React.FC<RecentActivityItemProps> = ({
  avatarUrl,
  icon,
  primaryText,
  secondaryText,
  timestamp,
  status,
  statusText
}) => {
  const statusColors = {
    success: {
      bgColor: 'success.light',
      textColor: 'success.dark'
    },
    error: {
      bgColor: 'error.light',
      textColor: 'error.dark'
    },
    warning: {
      bgColor: 'warning.light',
      textColor: 'warning.dark'
    },
    info: {
      bgColor: 'info.light',
      textColor: 'info.dark'
    }
  };

  const getStatusColor = () => {
    return status ? statusColors[status] : statusColors.info;
  };

  return (
    <Box sx={{ display: 'flex', mb: 2, p: 1, '&:hover': { bgcolor: 'background.default', borderRadius: 1 } }}>
      {avatarUrl && (
        <Avatar
          src={avatarUrl}
          alt="User"
          sx={{ width: 40, height: 40, mr: 2 }}
        />
      )}
      {icon && !avatarUrl && (
        <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.light', color: 'primary.dark' }}>
          {icon}
        </Avatar>
      )}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {primaryText}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </Typography>
        </Box>
        {secondaryText && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {secondaryText}
          </Typography>
        )}
        {status && statusText && (
          <Chip
            label={statusText}
            size="small"
            sx={{
              mt: 1,
              bgcolor: getStatusColor().bgColor,
              color: getStatusColor().textColor,
              fontWeight: 'medium',
              fontSize: '0.75rem'
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default RecentActivityItem;