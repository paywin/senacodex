import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '@/middleware';
import * as roleBasedDashboardController from '@/controllers/roleBasedDashboard';

const router = Router();

router.use(authMiddleware);

/**
 * Dashboard - dados específicos por role
 */
router.get('/stats', roleBasedDashboardController.getDashboardByRole);

/**
 * Projetos - filtrados por role
 */
router.get('/projects', roleBasedDashboardController.getProjectsByRole);
router.get('/projects/:projectId', roleBasedDashboardController.getProjectDetailByRole);

/**
 * Avaliações - filtradas por role
 */
router.get('/evaluations', roleBasedDashboardController.getEvaluationsByRole);

/**
 * Coordenador - relatórios e monitoramento
 */
router.get('/class/:classCode', roleMiddleware('coordinator'), roleBasedDashboardController.getClassStatusByCoordinator);
router.get('/teachers/performance', roleMiddleware('coordinator'), roleBasedDashboardController.getTeacherPerformanceByCoordinator);

export default router;
