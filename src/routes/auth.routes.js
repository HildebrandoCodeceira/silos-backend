import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/register', auth('admin'), register);
router.post('/login', login);

export default router;
