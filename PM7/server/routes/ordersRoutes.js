import express from 'express';
import { 
  createUserOrder, 
  getAllOrders, 
  getOrderById, 
  getUserOrdersByUserId,
  // updateOrderById,  
  deleteOrderById ,
} from '../controllers/orderController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Crear un nuevo pedido (solo usuarios autenticados)
router.post('/', auth, createUserOrder);

router.get('/:userID', auth, getUserOrdersByUserId);
router.get('/', auth, getAllOrders);
router.get('/:id', auth, getOrderById);

// // Actualizar un pedido específico (solo administradores)
// router.put('/:id', auth, updateOrderById);

// Eliminar un pedido específico (solo administradores)
router.delete('/:id', auth, deleteOrderById);



export default router;
