import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import useAuth from '../../contexts/useAuth'; // Obtener el contexto de autenticación
import axios from 'axios';


const OrderDetails = ({ order }) => {
  const { user, token } = useAuth(); // Obtener el user._id y el token desde el contexto
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', email: '' }); // Estado para guardar los detalles del usuario

  // Funciones para abrir y cerrar el diálogo
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Almacenamos la orden para accederla desde el localStorage si es necesario
  const [storedOrder, setStoredOrder] = useState(order);

  // Si no se pasó una orden como prop, intentar recuperarla desde el localStorage
  useEffect(() => {
    if (!order) {
      const lastOrder = localStorage.getItem('lastOrder');
      if (lastOrder) {
        setStoredOrder(JSON.parse(lastOrder));
      }
    }
  }, [order]);

  // Obtener los detalles del usuario mediante su ID
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/users/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Autenticación mediante token
          },
        });
        setUserDetails(response.data); // Guardar los datos del usuario (name, email)
      } catch (error) {
        console.error('Error al obtener los detalles del usuario:', error);
      }
    };

    if (user && user._id) {
      fetchUserDetails();
    }
  }, [user, token]);

  return (
    <>
      {/* Mostrar los detalles de la orden */}
      <Box sx={{ mt: 2, mb: 2 }}>    
      
      
        {/* Botón para abrir el diálogo con los detalles */}
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Ver detalles
        </Button>

        {/* Diálogo para mostrar los detalles de la orden */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm"
        
   
        >
          <DialogTitle>Detalles de la Orden #{storedOrder._id}</DialogTitle>
          <DialogContent>
            {/* Mostrar los detalles del usuario */}
            <Typography variant="h6" gutterBottom>Detalles del Usuario</Typography>
            <Typography>Nombre: {userDetails.name}</Typography>
            <Typography>Email: {userDetails.email}</Typography>

            {/* Mostrar los detalles de la orden */}
            <Typography variant="h6" mt={2}>Detalles de la Orden</Typography>
            <Typography>Payment ID: {storedOrder.paymentId}</Typography>
            <Typography>Fecha de Creación: {new Date(storedOrder.createdAt).toLocaleDateString()}</Typography>
            <Typography>Total: ${storedOrder.totalPrice}</Typography>

            <Typography variant="h6" mt={2}>Productos</Typography>
            {storedOrder.items.map((item, index) => (
              <Box key={index} display="flex" justifyContent="space-between" mb={1}>
                <Typography>{item.name}</Typography>
                <Typography>{item.quantity} x ${item.price}</Typography>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default OrderDetails;
