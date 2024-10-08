import React, { useEffect, useState } from 'react';
import {Container, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Box, Modal, Button, IconButton, TableContainer, TablePagination, Divider } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useAuth from '../../contexts/useAuth';


const UserOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);  // Estado para la orden seleccionada
  const [open, setOpen] = useState(false);  // Estado para abrir y cerrar el modal
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const { token, user, setUser } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders/${user._id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('No autorizado');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      }
    };
    fetchOrders();
  }, [token, user._id]);

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

  const handleViewOrder = (orderId) => {
    const selectedOrder = orders.find(order => order._id === orderId);
    setSelectedOrder(selectedOrder);
    setOpen(true);  // Abrir el modal
  };

  const handleClose = () => {
    setOpen(false);  // Cerrar el modal
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container sx={{ 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',

      padding: '2rem',

      mt: 4 }}>
      {error && <Typography variant="body2" color="error">{error}</Typography>}

      <Typography variant="h6" gutterBottom>
        Mis Ordenes
      </Typography>

      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
       
               
            
              <TableRow>
                <TableCell   sx={{backgroundColor: '#333', color: 'white'}}>Order ID</TableCell>
                <TableCell   sx={{backgroundColor: '#333', color: 'white'}}>Payment ID</TableCell>
                <TableCell sx={{backgroundColor: '#333', color: 'white'}}>Fecha</TableCell>
                <TableCell  sx={{backgroundColor: '#333', color: 'white'}}>Total</TableCell>
                <TableCell  sx={{backgroundColor: '#333', color: 'white'}}>Detalles</TableCell>
              </TableRow>
            </TableHead>
       
            <TableBody>
       
              {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).reverse().map((order) => (
                <TableRow hover key={order._id}>
                  <TableCell>#{order._id.substring(0, 8)}...</TableCell>
                  <TableCell>{order.paymentId || 'N/A'}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>${order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleViewOrder(order._id)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[50, 100, 150]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Modal para mostrar el detalle de la orden */}
      {selectedOrder && (
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Detalle de la Orden  #{selectedOrder._id}
            </Typography>
            <Typography variant="body1">Payment ID: {selectedOrder.paymentId}</Typography>
            <Typography variant="body1">Nombre: {user.name}</Typography>
            <Typography variant="body1">E-mail: {user.email}</Typography>
            <Typography variant="body1">Fecha: {new Date(selectedOrder.createdAt).toLocaleDateString()}</Typography>
            <Typography variant="body1">Total: ${selectedOrder.totalPrice}</Typography>

            <Typography variant="h6" mt={2}>Productos</Typography>
            {selectedOrder.items.map((item, index) => (
              <Box key={index} display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1">{item.name}</Typography>
                <Typography variant="body1">
                  {item.quantity} x ${item.price}
                </Typography>
              </Box>
            ))}

            <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
              Cerrar
            </Button>
          </Box>
        </Modal>
      )}
    </Container>
  );
};

export default UserOrders;
