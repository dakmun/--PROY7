import React, { useState } from 'react';
import { TextField, Link, Button, Box, Typography, Alert } from '@mui/material';
import useAuth from '../../contexts/useAuth'; 



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { handleLogin, user } = useAuth(); // Obtener la función de login del contexto


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
        const { token } = await response.json(); // Solo necesitamos el token
        handleLogin(token); // Almacenar el token en el contexto  
            
      } 

      else {
        setError('Error al iniciar sesión, por favor revisa tus credenciales.');
      }
    } catch (error) {
      setError('Error en el servidor, por favor intenta más tarde.');
    }
  };

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
       Login
        </Typography>

      {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          type="email"
          sx={{ marginBottom: 2, backgroundColor: 'transparent', borderRadius: 1 }}
          color= 'primary'    
          inputlabel={{ style: { color: '#9e9e9e' } }}
          input={{ style: { color: 'white' } }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Contraseña"
          variant="outlined"
          type="password"
          color='primary'
          sx={{ marginBottom: 2, backgroundColor: 'transparent', borderRadius: 1 }}
          inputlabel={{ style: { color: '#9e9e9e' } }}
          input={{ style: { color: 'white' } }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
  
          onClick={handleSubmit}
          onKeyDownCapture={handleSubmit}
         type='submit'
        >
          Iniciar Sesión
        </Button>

        <Typography variant="body2" sx={{ marginTop: 2, color: '#9e9e9e' }}>
          No te has registrado?{' '}
          <Link href="/register" underline="hover" sx={{ color: '#f95f35' }}>
            Registrarse
          </Link>
        </Typography>
        </Box> 
    </Box>

  );
};

export default Login;

