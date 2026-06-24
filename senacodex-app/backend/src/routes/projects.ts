import { Router } from 'express';
import { authMiddleware } from '@/middleware';
import * as projectController from '@/controllers/projects';

const router = Router();

router.use(authMiddleware);

router.get('/', projectController.getProjectsHandler);
router.get('/:id', projectController.getProjectHandler);
router.post('/', projectController.createProjectHandler);
router.post('/:id/evaluations', projectController.createEvaluationHandler);

export default router;
