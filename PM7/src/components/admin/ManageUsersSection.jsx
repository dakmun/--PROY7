import React, { useState, useEffect } from 'react';
import { Container, Divider,Table, TableBody, TableCell, TableHead, TableRow, Box, IconButton, Dialog, Button, TableContainer, TablePagination, Typography, TextField, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useAuth from '../../contexts/useAuth';
import mongoose from 'mongoose';

export default function ManageUsersSection() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();

  // Función para obtener usuarios
  const fetchUsers = async () => {
    if (!token || !user.isAdmin) {
      console.error('Token no encontrado o usuario no autorizado');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Error al obtener los usuarios');
      }
    } catch (error) {
      console.error('Error de red al obtener los usuarios');
    }
  };

  // Cargar lista de usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, [token, user.isAdmin]);

  // Resetear formulario
  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setIsAdmin(false);
  };

  // Crear usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('No se encontró el token. Por favor, inicie sesión nuevamente.');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          password,
          isAdmin,
        }),
      });

      if (response.ok) {
        await fetchUsers();  // Refrescar la lista de usuarios después de crear
        resetForm();
      } else {
        setError('Error al crear el usuario');
      }
    } catch (error) {
      setError('Error de red al crear el usuario');
    }
  };

  // Editar usuario
  const handleEditUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setIsAdmin(user.isAdmin);
    setUserId(user._id);
    setIsEditModalOpen(true);
  };

  // Actualizar usuario
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!token) {
      console.error('No se encontró el token en localStorage');
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          isAdmin,
        }),
      });

      if (response.ok) {
        await fetchUsers();  // Refrescar la lista de usuarios después de actualizar
        setIsEditModalOpen(false); // Cerrar el modal después de actualizar
        resetForm();
      } else {
        setError('Error al actualizar el usuario');
      }
    } catch (error) {
      setError('Error de red al actualizar el usuario');
    }
  };

  // Eliminar usuario
  const handleOpenDeleteModal = (userId) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!token) {
      setError('No se encontró el token. Por favor, inicie sesión nuevamente.');
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userToDelete)) {
      setError('ID de usuario inválido');
      return;
    }

    try {
      const response = await fetch(`/api/users/${userToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchUsers();  // Refrescar la lista de usuarios después de eliminar
        setIsDeleteModalOpen(false);
      } else {
        const errorData = await response.json();
        setError(`Error al eliminar el usuario: ${errorData.message}`);
      }
    } catch (error) {
      setError(`Error de red al eliminar el usuario: ${error.message}`);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
    <Divider sx={{ width: '100%', height: '1px', backgroundColor: '#c2c2c278', my: 12 }} />
    <Container sx={{px:0, py:0, my: 4, mx:0, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: '4rem', justifyContent: 'center' , alignItems: 'center', textAlign: 'center' }}> 

      {error && <Alert severity="error">{error}</Alert>}

      {/* Formulario para crear un usuario */}
      <Box component="form" onSubmit={handleCreateUser} sx={{ mb: 4 , maxWidth: '400px', width: '100%' }}>
      <Typography variant="h3"
sx={{ mb: 2, textAlign: 'center' }} >
  Crear Usuario </Typography>
        <TextField
          fullWidth
          label="Nombre del usuario"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Crear Usuario
        </Button>
      </Box>

      {/* Tabla de usuarios existentes */}
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h3"
sx={{ mb: 2, textAlign: 'center' }} >
  Lista de Usuarios </Typography>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Nombre</TableCell>
                <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Correo Electrónico</TableCell>
                <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Editar</TableCell>
                <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).reverse().map((user) => (
    <TableRow hover key={user._id}>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        {!user.isAdmin && ( // Verificamos si no es admin
          <IconButton color="warning" onClick={() => handleEditUser(user)}>
            <EditIcon />
          </IconButton>
        )}
      </TableCell>
      <TableCell>
        {!user.isAdmin && ( // Verificamos si no es admin
          <IconButton color="error" onClick={() => handleOpenDeleteModal(user._id)}>
            <DeleteIcon />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 40, 100]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Modal de edición de usuario */}
      <Dialog open={isEditModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre del usuario"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">Cancelar</Button>
          <Button onClick={handleUpdateUser} color="primary">Guardar Cambios</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={isDeleteModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este usuario?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteModalOpen(false)} color="secondary">Cancelar</Button>
          <Button onClick={confirmDeleteUser} color="error" disabled={!userToDelete}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Container>
    </>
  );
}
