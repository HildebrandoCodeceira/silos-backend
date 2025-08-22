import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { list, resolve } from '../controllers/alert.controller.js';

const router = Router();

router.get('/', auth(), list);
router.patch('/:id/resolve', auth(), resolve);

export default router;
