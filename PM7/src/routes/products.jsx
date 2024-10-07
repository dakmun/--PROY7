import React from 'react';
import ProductList from '../components/Products/ProductList';
import { Container, Typography } from '@mui/material';

const ProductsPageIndex = () => {
  return (
    <Container sx={{ py: 8, px: { xs: 0, sm: 4, md: 6 }
    , minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>    <Typography variant="h2" sx={{ mb: 4 }}>
        Nuestros Productos
      </Typography>
      <ProductList />
    </Container>
  );
};

export default ProductsPageIndex;

