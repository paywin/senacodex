import { Router } from 'express';
import * as seedController from '@/controllers/seed';

const router = Router();

// Rota para popular o banco com usuários de teste (apenas desenvolvimento)
router.post('/seed', seedController.seedTestUsers);

export default router;
