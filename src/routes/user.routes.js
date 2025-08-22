import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { me, list, create, update, remove } from '../controllers/user.controller.js';

const router = Router();

router.get('/me', auth(), me);
router.get('/', auth('admin'), list);
router.post('/', auth('admin'), create);
router.patch('/:id', auth('admin'), update);
router.delete('/:id', auth('admin'), remove);

export default router;
