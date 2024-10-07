import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Box,
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  IconButton,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,



} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../contexts/useCart'; // Contexto del carrito
import { useAuth } from '../../contexts/useAuth'; // Contexto de autenticación
import Login from '../Login/Login'; // Componente de inicio de sesión
import { useNavigate } from 'react-router-dom';


const Cart = () => {
  const { cart, removeFromCart, getTotalPrice, setCart, cartLength } = useCart();
  const { user, token } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();
  


  useEffect(() => {
    if (user || token) {
      setShowLoginDialog(false);
    }
  }, [user, token]);

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
  };

  const applyDiscount = () => {
    if (couponCode === 'DISCOUNT05') {
      setAppliedDiscount(0.05);
    } else {
      setAppliedDiscount(0.05);
    }
  };


    const handleCheckout = () => {
      if (!user || !token) {
        setShowAuthDialog(true);
      } else {
        navigate('/mercadopago');
      }
    };
  const handleLoginDialogClose = () => setShowLoginDialog(false);

  const totalPrice = getTotalPrice();
  const discountAmount = totalPrice * appliedDiscount;
  const finalTotal = (totalPrice - discountAmount ).toFixed(2);

  console.log(cart);

  if (!cart.length) {
    return (
      <Container sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Carro
        </Typography>
        <Typography variant="body1" gutterBottom>
          Tu carrito está vacío.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ShoppingCartIcon />}
          href="/products"
        >Continuar Comprando</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Cart ({cartLength()})
      </Typography>
      <Grid container spacing={3}>
        {/* Sección de productos */}
        <Grid item xs={12} md={8}>
          <TableContainer component={Box} 
          sx={{

            border: '1px solid #c2c2c278',
            borderRadius: '8px',
             overflowX: 'auto' }} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography fontWeight="bold">Productos</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight="bold">Unidades</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Subtotal</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="bold">Eliminar</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <img
                          src={item.mainImage}
                          alt={item.name}
                          width="60px"
                          style={{ borderRadius: '8px' }}
                        />
                        <Box>
                          <Typography variant="body1">{item.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Color: {item.color}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        select
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = e.target.value;
                          const updatedCart = cart.map((cartItem) =>
                            cartItem._id === item._id
                              ? { ...cartItem, quantity: newQuantity }
                              : cartItem
                          );
                          setCart(updatedCart);
                        }}
                        size="small"
                        variant="outlined"
                        sx={{ width: '60px' }}
                      >
                        {[...Array(10).keys()].map((i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight="bold">
                        ${parseInt((item.price * item.quantity).toFixed(2))}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleRemoveItem(item._id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={2}>
            <Button component={Link} to="/products" variant="text" color="primary">
              &lt; Seguir Comprando
            </Button>
          </Box>
        </Grid>
        {/* Resumen de la compra */}
        <Grid item xs={12} md={4}>
          <Box sx={{
             p: 3,
             border: '1px solid #c2c2c278',
            borderRadius: '8px',
             }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Resumen
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">${parseInt(totalPrice)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1">Descuento ({appliedDiscount * 100}%)</Typography>
              <Typography variant="body1">-${parseInt(discountAmount.toFixed(2))}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <TextField
                label="DISCOUNT05"
                variant="outlined"
                size="small"
                placeholder="DISCOUNT05"
                fullWidth
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button variant="contained" onClick={applyDiscount} sx={{ height: '40px' }}>
                Aplicar
              </Button>
            </Box>
            <Box mt={3}>
              <Typography variant="h5" fontWeight="bold" mb={2}>
                Total: ${parseInt(finalTotal)}
              </Typography>
              <Button 
              onClick={handleCheckout}
              fullWidth variant="contained" color="primary" size="large">
                Checkout
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Diálogo de autenticación */}
      <Dialog open={showAuthDialog} onClose={() => setShowAuthDialog(false)}>
        <DialogTitle>Autenticación requerida</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Debes iniciar sesión para continuar con la compra.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAuthDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={() => {            
            setShowLoginDialog(true)
            setShowAuthDialog(false)
          }} color="primary">
            Iniciar sesión
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de login */}
      <Dialog open={showLoginDialog} 
      onClose={() => {
       handleLoginDialogClose();
       setShowAuthDialog(false);}}>

        <DialogTitle>Iniciar sesión</DialogTitle>
        <DialogContent>
          <Login /> {/* Aquí se renderiza el componente de Login */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginDialogClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;
