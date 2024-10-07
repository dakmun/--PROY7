import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../contexts/useAuth'; 
import { jwtDecode } from 'jwt-decode'; 

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { handleLogin } = useAuth(); 
  const navigate = useNavigate(); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);


    try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (response.ok) {
          const { token } = await response.json();
          const decodedToken = jwtDecode(token);
  
          if (decodedToken.isAdmin) {
            // Si el usuario es admin, iniciamos sesión y redirigimos
            handleLogin(token);
            navigate('/admin');
          } else {
            // Si no es admin, mostrar el mensaje de error y no guardar el token
            setError('No tienes permisos de administrador');
            return; // Detener el flujo aquí
          }
        } else {
          setError('Error al iniciar sesión, por favor revisa tus credenciales.');
        }
      } catch (err) {
        // Para otros errores (problemas de servidor)
        setError('Error en el servidor, por favor intenta más tarde.');
      }
    
      
    }





  return (

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        maxWidth: '422px',
      }}
    >
      <Box
      component='form'
      >
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Admin Login
        </Typography>

      {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
        <TextField
          fullWidth
          label="Email address"
          variant="outlined"
          type="email"
          sx={{ marginBottom: 2, backgroundColor: 'transparent', borderRadius: 1 }}
          inputlabel={{ style: { color: '#9e9e9e' } }}
          input={{ style: { color: 'white' } }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          sx={{ marginBottom: 2, backgroundColor: 'transparent', borderRadius: 1 }}
          inputlabel={{ style: { color: '#9e9e9e' } }}
          input={{ style: { color: 'white' } }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ fontWeight: 'bold' }}
          onClick={handleSubmit}
          onKeyDownCapture={handleSubmit}
         type='submit'
        >
          Iniciar Sesión
        </Button>

        </Box> 
    </Box>

  );
};

export default AdminLogin;

