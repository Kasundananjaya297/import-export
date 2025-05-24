import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import StatusBadge from '../../components/common/StatusBadge';

interface Order {
  id: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    // TODO: Fetch orders from API
    // This is a placeholder implementation
    setOrders([]);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>
      
      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No orders found
          </Typography>
          <Typography color="text.secondary">
            Your order history will appear here once you make a purchase.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Paper sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6">
                      Order #{order.id}
                    </Typography>
                    <Typography variant="body1">
                      {order.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {order.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Order Date: {new Date(order.orderDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <StatusBadge status={order.status} />
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      ${order.totalAmount.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyOrders;