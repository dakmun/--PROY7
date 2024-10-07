
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Rating } from '@mui/material';
import axios from 'axios';

export default function Hero() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(true); // Estado para manejar el fade
  const [imageToShow, setImageToShow] = useState(''); // Imagen actual

  useEffect(() => {
    // Obtener productos de la API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        if (Array.isArray(response.data)) {
          setProducts(response.data);  
        } else {
          console.error('Unexpected API response:', response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 1) {
      const interval = setInterval(() => {
       setFade(false);

        setTimeout(() => {
          setRandomImage(products); // Cambiar a una imagen aleatoria
       
          setFade(true) // Inicia el fade-in después de cambiar la imagen
        }, 700); // 700ms de espera para completar el fade-out antes de cambiar
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [products]);

  const setRandomImage = (images) => {
    if (images.length === 0) {
      setImageToShow('');
      
      return;
    }
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * images.length);
    } while (images[randomIndex]?.mainImage === imageToShow);
    setImageToShow(images[randomIndex]?.mainImage || '');
  };

  if (loading) {
    return  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column-reverse', sm: 'row' },
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '80vh',
      padding: '0 5%',
      background: 'linear-gradient(90deg, #0D0D0D, #1A1A1A)',
      color: '#fff',
      position: 'relative',
      width: '100%',
      opacity: 1,

      
    }}
  />;
  }

  if (products.length === 0) {
    return <Typography>No hay productos disponibles.</Typography>;
  }

  const currentProduct = products.find(product => product.mainImage === imageToShow) || {};

  return (
    

    
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', sm: 'row' },
        justifyContent: { xs: 'center', sm: 'space-around' },
        alignItems: 'center',
        height: '83vh',
        padding: '0 5%',
        background: 'linear-gradient(90deg, #0D0D0D, #1A1A1A)',
        color: '#fff',
        position: 'relative',
        width: '100%',

    
        
      }}
    >
      <Box 
        sx={{
          '@media (max-width: 900px)': {
            maxWidth: '100%',
          },
          maxWidth: '40%',
          transition: 'opacity 0.7s ease-in-out',
          opacity: fade ? 1 : 0 
        }}
      >
      
        <Typography variant="h3" sx={{ mb: 0 }}>
          {currentProduct.name || 'Nombre no disponible'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '4px' }}>
        <Rating value={currentProduct.rating} readOnly precision={0.5} size='small' />
      
        </Box>
        <Typography variant="body1" sx={{ my: 2}}>
          {currentProduct.description ? currentProduct.description.substring(0, 80) : 'Descripción no disponible'}...
        </Typography>

       <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 , flexWrap: 'wrap' , justifyContent: 'start', alignItems: 'center' }}>
       <Box sx={{ display: 'flex', justifyContent:{   }, alignItems: 'center', gap: 1 }}>  
        <Typography variant="h6"  sx={{ marginBottom: 1 }}>
        ${currentProduct.price - (currentProduct.price * currentProduct.discount / 100)}        
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 , textDecoration: 'line-through'}}>
${currentProduct.price}
        </Typography>
        </Box>
         <Button
        href={`/products/${currentProduct._id}`}
        variant="contained" color="primary" sx={{ backgroundColor: '#ff5722' , mb: 2 , width: '45%' }}>
          Conoce Más
        </Button>
        </Box>
      </Box>
      <Box
        component="img"
        src={imageToShow || setRandomImage(products)}
        alt={currentProduct.name || 'Producto'}
        sx={{ 
          maxWidth: { xs: '250px', sm: '300px' , md: '400px' },
          aspectRatio: '1/1',       
          objectFit: 'contain', 
          opacity: fade ? 1 : 0,    
          transition: 'opacity 0.7s ease-in-out' 
        }} 
      />
    </Box>
  );
};

