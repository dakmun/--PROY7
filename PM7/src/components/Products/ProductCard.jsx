import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, IconButton, Rating, CardMedia, Typography, Box, Modal, Button } from '@mui/material';
import { AddShoppingCart as AddShoppingCartIcon } from '@mui/icons-material';
import { CartContext } from '../../contexts/CartContext';
import { ThemeContext } from '../../themes/ThemeContext';



const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { isDarkMode } = useContext(ThemeContext);

  const handleAddToCart = () => {
    addToCart(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border:  isDarkMode ? '1px solid #1e2327' : '1px solid #e8eaee',
        transition: '0.3s',
        borderRadius: 2,
     
    
        '&:hover': { boxShadow: 6 },
        position: 'relative', // Para posicionar el ícono de carrito
        overflow: 'hidden', // Para que el ícono se mantenga dentro
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Imagen del producto */}
      <Box
        sx={{
   
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
      
      
        }}
      >
      <Card  sx={{  boxShadow: 'none', aspectRatio: '1', } }  >
  
      
  <CardMedia
          component="img"
          sx={{
            objectFit: 'contain',
            height: { xs: '45vw', sm: '30vw', md: '20vw' },
            width: 'auto',
            padding: '1rem',
            borderRadius: '1rem',
            aspectRatio: '1',
        
          }}
          image={product.mainImage}
          alt={product.name}
          />
          </Card>
      </Box>

      <CardContent
        sx={{
          padding: 2,
          textAlign: 'center',
    
        }}
      >
        {/* Nombre del producto con enlace y subrayado al hacer hover */}
        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
          <Typography
            variant="h6"

            
            sx={{
         
              marginBottom: 1,
              color: isDarkMode ? '#fff' : '#000' ,  
              textDecoration: hovered ? 'underline' : 'none',
              textDecorationStyle: hovered ? 'double' : 'none',
              textDecorationColor: hovered ? '#1565c0' : 'transparent', 
              textDecorationThickness: hovered ? 'from-font' : 'from-font',


            }}
          >
            {product.name.substring(0, 10)}...
          </Typography>
        </Link>

        {/* Precio */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>  
        <Typography variant="h6"  sx={{ marginBottom: 1 }}>
        ${product.price - (product.price * product.discount / 100)}        
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 , textDecoration: 'line-through'}}>
${product.price}
        </Typography>
        </Box>

        {/* Rating (se puede ajustar según las necesidades) */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
        <Rating value={product.rating} readOnly precision={0.5} size="small" />
          <Typography variant="body2" color="text.secondary">
          {product.rating}
          </Typography>
        </Box>
      </CardContent>

      {/* Ícono de carrito que aparece al hacer hover */}
      {hovered && (
        <IconButton
          sx={{
            position: 'absolute',
            top: '40%',
            right: '5%',
            backgroundColor: 'orange',
            color: 'white',
            padding: '12px',
            transition: '0.3s',
            '&:hover': { backgroundColor: 'darkorange' },
          }}
          onClick={handleAddToCart}
        >
          <AddShoppingCartIcon />
        </IconButton>
      )}

      {/* Modal de confirmación de carrito */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
            width: '100%',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Producto añadido al carrito
          </Typography>
          <Typography variant="body1" gutterBottom>
            {product.name} ha sido añadido a tu carrito.
          </Typography>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="primary" component={Link} to="/cart">
              Ver carrito
            </Button>
            <Button variant="outlined" onClick={closeModal}>
              Continuar comprando
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductCard;
