import  { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Rating,  
  Card,
  CardMedia,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { AddShoppingCart as AddShoppingCartIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom'; // Para obtener el id desde la URL
import useCart from '../../contexts/useCart';
import axios from 'axios';


export default function ProductDetails() {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(''); // Imagen principal seleccionada
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Hacer la solicitud GET para obtener los datos del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setSelectedImage(response.data.mainImage); // Inicializar la imagen principal
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <Typography>Cargando...</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, md: 4 }, p: { xs: 2, md: 4 } , mx: { xs: 2, md: 4 }, my: { xs: 2, md: 4 }, borderRadius: 2}}>  


      {/* Columna Izquierda: Imagen Principal */}
      <Box sx={{ flex: 1 , display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}> 

      <Box
        sx={{
 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
      
        }}
      >
        <Card
        sx={{
          padding: '1rem',

          boxShadow: 'none',
        }
        }
        >
  <CardMedia
          component="img"
          sx={{
            objectFit: 'contain',
            maxWidth: '400px',

            borderRadius: '1rem',
            aspectRatio: '1',
        
          }}
          src={selectedImage}
          alt={product.name}
          />
          </Card>
      </Box>


        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {/* Miniaturas de las imágenes */}
          {product.images.map((image, index) => (
            <IconButton
              key={index}
              onClick={() => setSelectedImage(image)}
              sx={{
                border: selectedImage === image ? '2px solid orange' : '2px solid transparent',
                borderRadius: 2,
              }}
            >
              <Box
                component="img"
                src={image}
                alt={`thumbnail-${index}`}
                sx={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 2 }}
              />
            </IconButton>
          ))}
        </Box>
      </Box>

      {/* Columna Derecha: Detalles del Producto */}
      <Box sx={{ flex: 1 , display: 'flex', flexDirection: 'column', gap: 2 , justifyContent: 'start', alignItems: 'start', padding: '1rem'}} >
        <Typography variant="h4" gutterBottom>
          {product.name}
        </Typography>
        <Rating value={product.rating} readOnly precision={0.5} sx={{ mb: 2 }} />
        <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
          ${product.price.toFixed(2)}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          {product.description}
        </Typography>

        {/* Selección de cantidad */}
        <FormControl sx={{ mb: 2 }}>
          <InputLabel>Cantidad</InputLabel>
          <Select
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            label="Cantidad"
            sx={{ width: '80px' }}
          >
            {[...Array(10).keys()].map((x) => (
              <MenuItem key={x + 1} value={x + 1}>
                {x + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Botones de acciones */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => addToCart({ ...product, quantity })}
            startIcon={<AddShoppingCartIcon />}
            sx={{ flexGrow: 1 }}
          >
           Agregar al carro
          </Button>
          <Button variant="contained" color="error" href='/cart' sx={{ flexGrow: 1 }}>
            Ver Carrito
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
