import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Container, CircularProgress, Typography, Grid2 } from '@mui/material';




const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message || 'Error de red al obtener los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container>
        <Typography>No se encontraron productos.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 , px: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>  
      <Grid2 container spacing={{ xs: 1, sm: 4, md: 6 }} sx={{ display: 'flex', justifyContent: 'center' }}>  
        {products.map((product) => (
          <Grid2 item="true" xs={24} sm={6} md={4} key={product._id}>
            <ProductCard product={product} />
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

export default ProductList;
