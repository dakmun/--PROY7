import { useEffect, useState } from 'react';
import { Container,Divider, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Box, Modal, Button, IconButton, TableContainer, TablePagination } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useAuth from '../../contexts/useAuth';

export default function ManageOrdersSection() {
  const [users, setUsers] = useState([]); // Lista de usuarios
  const [orders, setOrders] = useState([]); // Lista de órdenes
  const [selectedOrder, setSelectedOrder] = useState(null); // Orden seleccionada
  const [open, setOpen] = useState(false); // Estado del modal
  const [error, setError] = useState(null); // Error en la solicitud
  const { token, user } = useAuth(); // Contexto de autenticación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError('No autorizado');
        return;
      }
      if (!user.isAdmin) {
        setError('No autorizado');
        return;
      }
      try {
        const response = await fetch('/api/orders', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Envía el token en el encabezado
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('No autorizado');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        setError(error.message);
      }
    };

    const fetchUsers = async () => {
      if (!token) {
        setError('No autorizado');
        return;
      }
      if (!user.isAdmin) {
        setError('No autorizado');
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

        if (!response.ok) {
          throw new Error('Error al obtener los usuarios');
        }

        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchOrders();
    fetchUsers();
  }, [token, user.isAdmin]);

  // Función para obtener el usuario asociado a la orden
  const getUserDetails = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user || { name: 'Usuario desconocido', email: 'Correo desconocido' };
  };

  // Abrir el modal para ver los detalles de la orden
  const handleViewOrder = (orderId) => {
    const selectedOrder = orders.find(order => order._id === orderId);
    setSelectedOrder(selectedOrder);
    setOpen(true); // Abrir el modal
  };

  // Cerrar el modal
  const handleClose = () => {
    setOpen(false); // Cerrar el modal
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
    <Container sx={{ 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      mt: 1,
      pt: 1,
      px: 0,
    }}>
      {error && <Typography variant="body2" color="error">{error}</Typography>}



      <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h3"
sx={{ mb: 2, textAlign: 'center' }} >
  Lista de Ordenes </Typography>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Order ID</TableCell>
                <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Email </TableCell>
                <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Fecha</TableCell>
                <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Total</TableCell>
                <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Detalles</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).reverse().map((order) => (
                <TableRow hover key={order._id}>
                  <TableCell>#{order._id.slice(0, 8)}...</TableCell>
                 
                  {(() => {
              const userDetails = getUserDetails(order.userId);
              return (
                <>
                <TableCell>{userDetails.email || 'N/A'}</TableCell>
                </>
              );
            })()}
                  
                 
                 
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
          rowsPerPageOptions={[100, 200, 300]}
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
              Detalle de la Orden
            </Typography>
            <Typography variant="body1">ID de la Orden: {selectedOrder._id}</Typography>

            {/* Mostrar nombre y correo del usuario de la orden */}
            {(() => {
              const userDetails = getUserDetails(selectedOrder.userId);
              return (
                <>
                  <Typography variant="body1">Nombre: {userDetails.name}</Typography>
                  <Typography variant="body1">E-mail: {userDetails.email}</Typography>
                </>
              );
            })()}

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
    </>
  );
}
