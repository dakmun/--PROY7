import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import useAuth from '../../contexts/useAuth';
import { ThemeContext } from '../../themes/ThemeContext';

const UpdateUserData = () => {
  const { token, user, setUser } = useAuth(); // Añadir setUser para actualizar el contexto
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { isDarkMode } = useContext(ThemeContext);

  // Obtener los datos actuales del usuario y actualizarlos en el formulario
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setFormData({ name: data.name, email: data.email });
    };

    fetchUserData();
  }, [token, user._id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Realizar la solicitud para actualizar los datos
    const response = await fetch(`/api/users/${user._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const updatedUser = await response.json(); // Obtener los datos actualizados desde la respuesta

      // Actualizar el estado global del usuario en el contexto
      setUser((prevUser) => ({
        ...prevUser,
        name: updatedUser.name,
        email: updatedUser.email,
      }));

      setMessage('Datos actualizados correctamente');
    } else {
      setError('Error al actualizar los datos');
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
      variant="h6">Actualizar Datos</Typography>
        <TextField
          label="Nombre"
          name="name"
          type='text'
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Correo Electrónico"
          type='email'
          name="email"
          value={formData.email}
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

export default UpdateUserData;
