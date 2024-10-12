import { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Box, IconButton, Button, TableContainer, TablePagination, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useAuth from '../../contexts/useAuth';


export default function ManageProductsSection() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [images, setImages] = useState(['']); // Empieza con un array con un campo vacío para la primera imagen
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [productId, setProductId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token || !user.isAdmin) {
        console.error('Token no encontrado o usuario no autorizado');
        return;
      }

      try {
        const response = await fetch('/api/products', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Error al obtener los productos');
        }
      } catch (error) {
        console.error('Error de red al obtener los productos');
      }
    };

    fetchProducts();
  }, [token, user.isAdmin]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setMainImage('');
    setRating('');
    setDiscount('');
    setImages(['']); // Reseteamos a un solo campo vacío
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('No se encontró el token. Por favor, inicie sesión nuevamente.');
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price,
          mainImage,
          rating,
          discount,
          images,
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        resetForm();
      } else {
        setError('Error al crear el producto');
      }
    } catch (error) {
      setError('Error de red al crear el producto');
    }
  };

  const handleEditProduct = (product) => {
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setMainImage(product.mainImage);
    setProductId(product._id);
    setRating(product.rating);
    setDiscount(product.discount);
    setImages(product.images || ['']); // Si no hay imágenes, asegúrate de tener al menos un campo vacío
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!token) {
      console.error('No se encontró el token en localStorage');
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price,
          mainImage,
          rating,
          discount,
          images,
        }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts((prevProducts) =>
          prevProducts.map((product) => (product._id === productId ? updatedProduct : product))
        );
        resetForm();
        setIsEditModalOpen(false);
      } else {
        setError('Error al actualizar el producto');
      }
    } catch (error) {
      setError('Error de red al actualizar el producto');
    }
  };

  const handleOpenDeleteModal = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!token) {
      setError('No se encontró el token. Por favor, inicie sesión nuevamente.');
      return;
    }

    try {
      const response = await fetch(`/api/products/${productToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProducts(products.filter((product) => product._id !== productToDelete));
        setIsDeleteModalOpen(false);
      } else {
        const errorData = await response.json();
        setError(`Error al eliminar el producto: ${errorData.message}`);
      }
    } catch (error) {
      setError(`Error de red al eliminar el producto: ${error.message}`);
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

  // Función para agregar un nuevo slot de imagen
  const handleAddImageSlot = () => {
    setImages([...images, '']); // Añade un nuevo slot vacío para una nueva imagen
  };

  // Función para actualizar una URL de imagen específica
  const handleImageChange = (index, event) => {
    const updatedImages = [...images];
    updatedImages[index] = event.target.value; // Actualiza la URL en el índice específico
    setImages(updatedImages);
  };

  // Función para eliminar un slot de imagen
  const handleRemoveImageSlot = (index) => {
    const updatedImages = images.filter((_, i) => i !== index); // Filtra la imagen por índice
    setImages(updatedImages);
  };

  return (
    <>
    <Divider sx={{ width: '100%', height: '1px', backgroundColor: '#c2c2c278', mb: 12 }} />
    <Container sx={{px:0, py:0, mt: 4, mb:0, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: '4rem', justifyContent: 'center' , alignItems: 'center', }}> 

  
      
    {error && <Alert severity="error">{error}</Alert>}

      {/* Formulario para crear un producto */}
      <Box component="form" onSubmit={handleCreateProduct} 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #c2c2c278',
        borderRadius: '8px',
        padding: '1rem',
        justifyContent: 'flex-start',
        maxWidth: 'max-content',
        mb: 2,
        flexWrap: 'wrap',
      }}
      >

<Typography variant="h3"
sx={{ mb: 2, textAlign: 'center' }} >
  Crear Productos </Typography>

        <TextField          
          label="Nombre del producto"
          placeholder="Nombre del producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mb: 2,  }}
    
          color='warning'
        />
        <TextField

          placeholder="Descripción"
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          sx={{ mb: 2, }} 
   
             color='warning'

        />

        <Box sx={{ display: 'flex', gap: 2, }}>
        <TextField
     
          label="Precio"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          sx={{ mb: 2,  }} 
      
             color='warning'
             size='small'
        />

        <TextField
             size='small'
          label="Descuento"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          sx={{ mb: 2, }} 
        />
</Box>

<TextField
             size='small'
          label="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          sx={{ mb: 2, }} 
        />

        <TextField
          
          label="URL de la imagen principal"
          value={mainImage}
          onChange={(e) => setMainImage(e.target.value)}
          sx={{ mb: 2,  }} 
        />



        {/* Campos dinámicos para las imágenes adicionales */}
        {images.map((image, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 ,}}  >
            <TextField
              
              label={`URL de imagen ${index + 1}`} // Muestra el número de la imagen
              value={image}
              onChange={(e) => handleImageChange(index, e)} // Cambia el valor de la imagen específica
              sx={{ mr: 2 }}
            />
            <IconButton onClick={() => handleRemoveImageSlot(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

<Button onClick={handleAddImageSlot} variant="outlined" sx={{ mb: 2 }}  >
          Añadir otra URL
        </Button>



   

        <Button type="submit" variant="contained" color="primary" sx={{   }}  >
          Crear Producto
        </Button>
      </Box>

      {/* Tabla de productos existentes */}
      <Box sx={{ width: '100%', overflow: 'hidden'  }}>
      <Typography variant="h3"
sx={{ mb: 2, textAlign: 'center' }} >
  Lista de Productos </Typography>
        <TableContainer sx={{ maxHeight: 530 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Imagen</TableCell>
                <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Nombre</TableCell>
                <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Precio</TableCell>
                <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Editar</TableCell>
                <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).reverse().map((product) => (
                <TableRow hover key={product._id}>
                  <TableCell>
                    <Box
                      component="img"
                      src={product.mainImage}
                      alt={product.name}
                      sx={{ width: 50, height: 50, objectFit: 'contain' }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton color="warning" onClick={() => handleEditProduct(product)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleOpenDeleteModal(product._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 40, 100]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Modal de edición de producto */}
      <Dialog open={isEditModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre del producto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Precio"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="URL de la imagen principal"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Slots dinámicos para las imágenes adicionales */}
          {images.map((image, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                fullWidth
                label={`URL de imagen ${index + 1}`}
                value={image}
                onChange={(e) => handleImageChange(index, e)} // Cambia el valor de la imagen específica
                sx={{ mr: 2 }}
              />
              <IconButton onClick={() => handleRemoveImageSlot(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button onClick={handleAddImageSlot} variant="outlined" sx={{ mb: 3 }}>
            Añadir otra imagen
          </Button>

          <TextField
            fullWidth
            label="Descuento"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleUpdateProduct} color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={isDeleteModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este producto?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteModalOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={confirmDeleteProduct} color="error" disabled={!productToDelete}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </>
  );
}
