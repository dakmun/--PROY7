import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import useAuth from '../../contexts/useAuth';




export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const { user } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        setToken(token);
        setSuccess('Registro exitoso! Ahora puedes ');
        navigate(window.location.pathname);  
      } else {
        setError('Error al registrarse. Por favor, intente nuevamente.');
      }
    } catch (err) {
      setError('Error al registrarse. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (token && user) {
    return (
      <Alert severity="error">
      Sesión Activa, puedes cerrar sesión para crear una nueva cuenta.
      </Alert>
    );
  }

  if (token && !user) {
    return (
      <Alert severity="success">
        ¡Registro exitoso! Ahora puedes <Button color="primary" component={Link} to="/login">iniciar sesión</Button>.
      </Alert>
    );
  }


  return (


      <Box sx={{  p: 4, borderRadius: 2, maxWidth: '400px', width: '100%' }}>
        <Typography variant="h5" gutterBottom align="center">
         Registro
        </Typography>
        <Box component='form' onSubmit={handleSubmit}>
          <TextField
            type='text'
            label="Nombre"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            maxLength="50"
            minLength="3"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            type="email"
            maxLength='50'
            minLength='6'
            label="Correo Electrónico"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
           maxLength="50"
            minLength="6"
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}
          <Typography variant="body2" sx={{ marginTop: 2, color: '#9e9e9e' }}>
            <Link href="/login" underline="hover" sx={{ color: '#f95f35' }}>Iniciar Sesión</Link>
           </Typography> 
            </Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </Button>
          <Typography variant="body2" sx={{ marginTop: 2, color: '#9e9e9e' }}>
          Ya estas registrado?{' '}
          <Link href="/register" underline="hover" sx={{ color: '#f95f35' }}>
            Inicia Sesión
          </Link>
        </Typography>
        </Box>
      </Box>
   

  );
}
