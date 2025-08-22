import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { list, create } from '../controllers/reading.controller.js';

const router = Router();

router.get('/', auth(), list);
router.post('/', create); // endpoint para dispositivos IoT

export default router;
