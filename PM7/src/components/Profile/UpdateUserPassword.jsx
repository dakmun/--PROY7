import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import useAuth from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../themes/ThemeContext';

const UpdateUserPassword = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();  // Obtenemos el token y el user del contexto
  const { isDarkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan

    if (formData.newPassword !== formData.confirmPassword) {
      setError("'Nueva contraseña' y 'Confirmar contraseña' NO coinciden.");
      return;
    }

    // Verificar que la contraseña actual es correcta
    const verifyPasswordResponse = await fetch(`/api/users/${user._id}/verify-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,  // Enviamos el token para la autenticación
      },
      body: JSON.stringify({
        currentPassword: formData.currentPassword, 
        userId: user._id  // Usamos user._id del contexto
      }),
    });

    if (verifyPasswordResponse.ok) {
      // Si la contraseña actual es correcta, actualizamos la nueva contraseña
      const updatePasswordResponse = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  // Enviamos el token para la autenticación
        },
        body: JSON.stringify({ password: formData.newPassword }),
      });

      if (updatePasswordResponse.ok) {
        setMessage('Contraseña actualizada correctamente');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        

      } else {
        setError('Error al actualizar la contraseña');
      }
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      border:  isDarkMode ? '1px solid #1e2327' : '1px solid #e8eaee',
      borderRadius: '8px',
      padding: '2rem',
      justifyContent: 'center',
      minWidth: '300px',
      width: { xs: '100%', md: '40%' },
      mb: 2 }} >

<Box 
      component='form'
      onSubmit={handleSubmit}
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
         flexDirection: 'column' }}>
                <Typography
      sx={{ marginBottom: '2rem' }}
      variant="h6">Actualizar Contraseña</Typography>
        <TextField
          label="Contraseña Actual"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Nueva Contraseña"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Guardar Cambios
        </Button>
        </Box>
      


        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
       
    
  );
};

export default UpdateUserPassword;
