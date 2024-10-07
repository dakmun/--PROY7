import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { 
    registerUser, loginUser,
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUserById,
    verifyPassword
 } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/', auth, getUsers); // Obtener todos los usuarios
router.get('/:id', auth, getUserById); // Obtener un usuario por ID

router.put('/:id', auth, updateUserById);

router.post('/:id/verify-password', auth, verifyPassword);
router.post('/', auth, createUser); // Crear un nuevo usuario

router.delete('/:id', auth, deleteUser); // Eliminar un usuario específico

export default router;

