import { Router } from 'express';
import { authMiddleware } from '@/middleware';
import * as authController from '@/controllers/auth';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/profile', authMiddleware, authController.getProfile);

export default router;
