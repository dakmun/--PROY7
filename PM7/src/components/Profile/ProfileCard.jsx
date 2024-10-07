import React, { useState, useEffect, useContext } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import useAuth from '../../contexts/useAuth';
import { ThemeContext } from '../../themes/ThemeContext';

const ProfileCard = () => {
  const { token, user, setUser } = useAuth();
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${user._id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const updatedUser = await response.json();

          // Solo actualiza el estado si los datos han cambiado
          if (updatedUser.name !== user.name || updatedUser.email !== user.email) {
            setUser((prevUser) => ({
              ...prevUser,
              name: updatedUser.name,
              email: updatedUser.email,
            }));
          }
        } else {
          console.error('Error al obtener los datos del usuario');
        }
      } catch (error) {
        console.error('Error en la solicitud de datos del usuario:', error);
      }
    };

    if (user._id) {
      fetchUserData();
    }
  }, [token, user._id, user.name, user.email, setUser]);

  return (
    <Box 
    sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      p: 2,
      width: '100%',
      justifyContent: 'center',
    }}
    >
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
      p: 2,
      border:  isDarkMode ? '1px solid #1e2327' : '1px solid #e8eaee',
      borderRadius: '8px',
    }}
    >


      <Avatar sx={{ width: 56, height: 56 }}>{user.name ? user.name[0] : 'U'}</Avatar>
      <Box sx={{ ml: 2 }}>
        <Typography variant="h6">{user.name}</Typography>
        <Typography variant="body1">{user.email}</Typography>
      </Box>
    </Box>
    </Box>
  );
};

export default ProfileCard;
