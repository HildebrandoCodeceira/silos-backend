import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { list, getOne, create, update, remove } from '../controllers/silo.controller.js';

const router = Router();

router.get('/', auth(), list);
router.get('/:id', auth(), getOne);
router.post('/', auth('admin'), create);
router.patch('/:id', auth('admin'), update);
router.delete('/:id', auth('admin'), remove);

export default router;
