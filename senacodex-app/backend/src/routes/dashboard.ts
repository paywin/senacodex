import { Router } from 'express';
import { authMiddleware } from '@/middleware';
import * as dashboardController from '@/controllers';

const router = Router();

router.use(authMiddleware);

router.get('/stats', dashboardController.getStats);
router.get('/activities', dashboardController.getActivitiesHandler);
router.get('/risk-projects', dashboardController.getRiskProjectsHandler);

export default router;
