import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
// import errorImage from '../path/to/your/image.png'; // Asegúrate de ajustar la ruta correctamente

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#121212', // Fondo oscuro
        color: '#fff', // Texto blanco
        textAlign: 'center',
      }}
    >
      {/* <img src={errorImage} alt="404 Error" style={{ maxWidth: '400px', marginBottom: '20px' }} /> */}
      <Typography variant="h3" gutterBottom>
        Página no encontrada!
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: '20px' }}>
        Lo sentimos, no hemos podido encontrar la página que buscas. ¿Quizás has escrito mal la URL? Asegúrate de revisar.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/"
        sx={{
          backgroundColor: '#ff6b6b', // Botón rojo
          color: '#fff',
          padding: '10px 20px',
          '&:hover': {
            backgroundColor: '#ff4b4b',
          },
        }}
      >
        Go to home
      </Button>
    </Box>
  );
};

export default NotFound;
