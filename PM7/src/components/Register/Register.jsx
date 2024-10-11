

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, Link, IconButton, InputAdornment } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useAuth from '../../contexts/useAuth';

export default function Register() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState(generateRandomNumber()); // Número de 3 dígitos aleatorio
  const [email, setEmail] = useState(''); // Correo electrónico generado automáticamente
  const [password, setPassword] = useState(''); // Contraseña generada automáticamente
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const { user } = useAuth();

  // Generar un número aleatorio de 3 dígitos
  function generateRandomNumber() {
    return Math.floor(100 + Math.random() * 900).toString();
  }

  // Generar una nueva contraseña basada en los primeros 3 caracteres del nombre y el número aleatorio de 3 dígitos
  const generatePassword = (name, number) => {
    const prefix = name.trim().substring(0, 3).toLowerCase();
    return `${prefix}${number}`;
  };

  // Actualizar el correo electrónico automáticamente basado en el nombre y el número
  const updateEmailAndPassword = (updatedName, randomNumber) => {
    const emailPrefix = updatedName.trim().toLowerCase().replace(/\s+/g, ''); // Elimina los espacios y convierte a minúsculas
    setEmail(`${emailPrefix}${randomNumber}@example.com`);
    setPassword(generatePassword(updatedName, randomNumber));
  };

  // Se ejecuta al cambiar el nombre
  const handleNameChange = (e) => {
    const updatedName = e.target.value;
    setName(updatedName);
    updateEmailAndPassword(updatedName, number); // Actualizar el correo y la contraseña
  };

  // Regenerar el número y la contraseña cuando se haga clic en el ícono de refrescar
  const handleRegenerate = () => {
    const newNumber = generateRandomNumber();
    setNumber(newNumber);
    updateEmailAndPassword(name, newNumber); // Actualizar el correo y la contraseña con el nuevo número
  };

  // Cambiar la visibilidad de la contraseña
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

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
        setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
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

  // Generar el correo y la contraseña automáticamente cuando se cargue el componente
  useState(() => {
    updateEmailAndPassword(name, number);
  }, []);

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
        {success}
        <Box sx={{ display: 'column', placeItems: 'center', marginTop: 2 }}>
          <Typography>Email: {email}</Typography>
          <Typography>Contraseña: {password}</Typography></Box>
        <Typography variant="body2" sx={{ marginTop: 2, color: '#9e9e9e' }}>
          <Link href={window.location.pathname} underline="hover" sx={{ color: '#f95f35' }}>
            Iniciar Sesión
          </Link>
        </Typography>
        </Alert>
    );

  }

  return (
    <Box sx={{ p: 4, borderRadius: 2, maxWidth: '400px', width: '100%' }}>
      <Typography variant="h5" gutterBottom align="center">
        Registro
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {/* Campo de Nombre */}
        <TextField
          type="text"
          label="Nombre"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={handleNameChange}
          required
        />

        {/* Campo de Correo Electrónico (solo lectura) */}
        <TextField
          type="text"
          label="Correo Electrónico"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          InputProps={{
            readOnly: true, // No editable
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleRegenerate}>
                  <RefreshIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Contraseña generada automáticamente */}
        <TextField
          label="Contraseña generada"
          variant="outlined"
          fullWidth
          margin="normal"
          value={showPassword ? password : '******'} // Mostrar '******' si no está visible
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && <Alert severity="error">{error}</Alert>}
        {success && (
      <Alert severity="success">
      {success}
      <Box sx={{ display: 'column', justifyContent: 'center', marginTop: 2 }}>
        <Typography>Email: {email}</Typography>
        <Typography>Contraseña: {password}</Typography></Box>
      <Typography variant="body2" sx={{ marginTop: 2, color: '#9e9e9e' }}>
        <Link href="/login" underline="hover" sx={{ color: '#f95f35' }}>
          Iniciar Sesión
        </Link>
      </Typography>
      </Alert>
        )}

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
          ¿Ya estás registrado?{' '}
          <Link href="/login" underline="hover" sx={{ color: '#f95f35' }}>
            Inicia Sesión
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
