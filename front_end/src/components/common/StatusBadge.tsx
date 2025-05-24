import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusBadgeProps extends Omit<ChipProps, 'color'> {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'paid' | 'refunded' | 'open' | 'under-review' | 'resolved' | 'closed' | 'success' | 'warning' | 'error' | 'active' | 'inactive' | 'out-of-stock';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, ...props }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return { color: '#FF9800', bgColor: '#FFF3E0' };
      case 'processing':
        return { color: '#2196F3', bgColor: '#E3F2FD' };
      case 'shipped':
        return { color: '#9C27B0', bgColor: '#F3E5F5' };
      case 'delivered':
        return { color: '#4CAF50', bgColor: '#E8F5E9' };
      case 'cancelled':
        return { color: '#F44336', bgColor: '#FFEBEE' };
      case 'paid':
        return { color: '#4CAF50', bgColor: '#E8F5E9' };
      case 'refunded':
        return { color: '#FF9800', bgColor: '#FFF3E0' };
      case 'open':
        return { color: '#F44336', bgColor: '#FFEBEE' };
      case 'under-review':
        return { color: '#2196F3', bgColor: '#E3F2FD' };
      case 'resolved':
        return { color: '#4CAF50', bgColor: '#E8F5E9' };
      case 'closed':
        return { color: '#9E9E9E', bgColor: '#F5F5F5' };
      case 'success':
        return { color: '#4CAF50', bgColor: '#E8F5E9' };
      case 'warning':
        return { color: '#FF9800', bgColor: '#FFF3E0' };
      case 'error':
        return { color: '#F44336', bgColor: '#FFEBEE' };
      case 'active':
        return { color: '#4CAF50', bgColor: '#E8F5E9' };
      case 'inactive':
        return { color: '#9E9E9E', bgColor: '#F5F5F5' };
      case 'out-of-stock':
        return { color: '#F44336', bgColor: '#FFEBEE' };
      default:
        return { color: '#9E9E9E', bgColor: '#F5F5F5' };
    }
  };

  const { color, bgColor } = getStatusConfig();

  return (
    <Chip
      label={status.replace('-', ' ')}
      size="small"
      sx={{
        color,
        bgcolor: bgColor,
        fontWeight: 500,
        textTransform: 'capitalize',
        ...props.sx
      }}
      {...props}
    />
  );
};

export default StatusBadge;