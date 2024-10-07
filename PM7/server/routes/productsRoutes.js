// routes/productsRoutes.js
import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts); // Obtener todos los productos
router.get('/:id', getProductById); // Obtener un producto específico
router.post('/', auth, createProduct); // Crear un nuevo producto (solo admin)
router.put('/:id', auth, updateProduct); // Actualizar un producto específico (solo admin)
router.delete('/:id', auth, deleteProduct); // Eliminar un producto específico (solo admin)
export default router;

