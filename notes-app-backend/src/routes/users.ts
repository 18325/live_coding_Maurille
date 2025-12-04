// src/routes/users.ts
import { Router } from 'express';
import { login, getUsers } from '../controllers/userController';

const router = Router();

router.post('/login', login);
router.get('/', getUsers);

export default router;