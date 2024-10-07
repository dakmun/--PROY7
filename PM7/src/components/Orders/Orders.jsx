import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las órdenes');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Órdenes
      </Typography>
      {orders.length === 0 ? (
        <Typography variant="body1">No hay órdenes disponibles.</Typography>
      ) : (
        <List>
          {orders.map((order) => (
            <ListItem key={order._id}>
              <ListItemText
                primary={`Orden #${order._id} - Total: $${order.totalAmount}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Orders;
