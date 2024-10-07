import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { useCart } from '../../contexts/useCart'; // Importar el contexto del carrito

const CartDetails = () => {
  const { cart } = useCart(); // Obtener los ítems del carrito desde el contexto

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 0.05; // Ejemplo de descuento
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  return (
    <Box sx={{ width: '100%', maxWidth: 400, border: '1px solid #ccc', padding: 2, borderRadius: 2, mx: 'auto' }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>  
        Detalles del Carrito
      </Typography>
      {/* Tabla de productos */}
      <TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none', mb: 2 }}>
        <Table size="small" aria-label="cart details table" sx={{ minWidth: 300 }}>
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">Producto</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight="bold">Unidades</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">Subtotal</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="center">x{item.quantity}</TableCell>
                <TableCell align="right">${parseInt(item.price * item.quantity).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Resumen */}
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Resumen
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography>Subtotal</Typography>
          <Typography>${parseInt(subtotal.toFixed(2))}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography>Descuento (5%)</Typography>
          <Typography>-${parseInt(discountAmount.toFixed(2))}</Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold">
          Total: ${parseInt(total.toFixed(2))}
        </Typography>
      </Box>
    </Box>
  );
};

export default CartDetails;
