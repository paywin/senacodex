import { Router } from 'express';
import { authMiddleware } from '@/middleware';
import * as projectController from '@/controllers';

const router = Router();

router.use(authMiddleware);

router.get('/', projectController.getProjectsHandler);
router.get('/:id', projectController.getProjectHandler);
router.post('/', projectController.createProjectHandler);

export default router;
