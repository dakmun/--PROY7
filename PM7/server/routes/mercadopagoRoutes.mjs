import express from 'express';

import { processPayment } from '../controllers/mercadopagoController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/process_payment', auth, processPayment);

export default router;
