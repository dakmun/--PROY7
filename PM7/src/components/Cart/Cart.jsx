import React, { useState, useEffect } from 'react';

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
  Divider,
  Link



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
  
<>

<Typography variant="h4" fontWeight="bold" gutterBottom sx={{ textAlign: 'center', pt: 8 }}>
        Cart ({cartLength()})
      </Typography>

<Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, alignItems: {xs:'center' ,sm:'baseline'}, justifyContent: 'space-evenly', width: '100%', mx: '0',mt: '0', py: '0', px: '0'  }}>


<>
<Box sx={{maxWidth:'666px', display: 'flex',  flexDirection: 'column', alignItems: 'baseline', justifyContent: 'space-between', width: '100%', mx: '0',mt: '0', py: '0', px: '16px'  }}>

<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', justifyContent: 'space-between', width: '100%', mx: '0',mt: '0', py: '0', px: '0' , border: '1px solid #c2c2c278', borderRadius: '8px' }}>
    
    <Box sx={{ display: 'flex',  flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'space-between' }}>  
      
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' , py: 2, px: 1, width: '100%', justifyContent: 'space-between' }}>  
    <Typography  sx={{width: '100px', ml: '0'}} fontWeight="bold">Productos</Typography>
    <Typography sx={{ mr: '8px'}} fontWeight="bold">Unidades</Typography>
    <Typography sx={{ mr: '16px'}} fontWeight="bold">Subtotal</Typography>
    <Typography sx={{width: '24px'}} fontWeight="bold">{''}</Typography>

    </Box>
  
    </Box>
    {cart.map((item) => (

<>
<Box key={item._id} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 , width: '100%', justifyContent: 'space-between' , padding: '16px', borderTop: '1px solid #c2c2c278' }}>  
      <Box sx={{ display: 'flex', pl: '16px', pr: 0, flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', gap: 2 }}>
    <img src={item.mainImage} alt={item.name} width="64px" style={{ borderRadius: '8px', aspectRatio: '1', objectFit: 'contain' }} />

  
  
    </Box>
    <TextField
    sx={{left: '8px'}}
    
    select value={item.quantity} onChange={(e) => { const newQuantity = e.target.value; const updatedCart = cart.map((cartItem) => cartItem._id === item._id ? { ...cartItem, quantity: newQuantity } : cartItem ); setCart(updatedCart); }} size="small" variant="outlined" >
    {[...Array(10).keys()].map((i) => (<MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>))}
    </TextField>
    <Typography 
    sx={{position: 'relative', left: '10px', right: '0',  textAlign: 'right'}}
    variant="body1" fontWeight="bold">${parseInt((item.price * item.quantity).toFixed(2))}</Typography>
    <IconButton onClick={() => handleRemoveItem(item._id)} sx={{paddingLeft: 0}}>
                    <DeleteIcon color="error" />
                  </IconButton>   
</Box>
<Typography key={item._id}  variant="body1"  sx={{minWidth: '140px', textAlign:'center' ,padding: '8px', pt: 0}}>{item.name}</Typography>
</>
))}
</Box>



</Box>
</>
<>
    <Box maxWidth='false' sx={{ py: 6,  width: 'calc(100% - 32px)',   maxWidth: {xs:'100%', sm: '333px'}}}>
     {/* Resumen de la compra */}
     <Grid item xs={12} md={4}>
          <Box sx={{
             p: '10px',
         
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
              <Button size='small' color='primary' variant="contained" onClick={applyDiscount}>
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

      {/* Diálogo de autenticación */}
      <Dialog className='dialog' open={showAuthDialog} onClose={() => setShowAuthDialog(false)} style={ {backgroundImage: "unset" , boxShadow: "unset"}} sx={{backgroundImage: "unset" , boxShadow: "unset"}}>  
        <style>{`
          .css-czofqz-MuiPaper-root-MuiDialog-paper {
            box-shadow: unset !important;
            background-image: unset !important;
          }
        `}</style>
        <DialogTitle>Autenticación requerida</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Debes iniciar sesión para continuar con la compra.
          </Alert>
          <Typography variant="body2" sx={{ marginTop: 2, color: '#9e9e9e' }}>
          No te has registrado?{' '}
          <Link href="/register" underline="hover" sx={{ color: '#f95f35' }}>
            Registrarse
          </Link>
        </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAuthDialog(false)}
          variant='contained'
          color='error'>
            Cancelar
          </Button>
          <Button onClick={() => {            
            setShowLoginDialog(true)
            setShowAuthDialog(false)
          }} color="primary"
          variant='contained'>  
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
    </Box>
    </>
    </Box>
    </>
  );
};

export default Cart;
