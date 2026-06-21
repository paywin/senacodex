import { Request, Response } from 'express';
import {
  getStudentProjects,
  getStudentProjectById,
  getStudentEvaluations,
  getStudentActivities,
  getStudentStats,
  getTeacherProjectsByClass,
  getTeacherStats,
  getTeacherRiskProjects,
  getCoordinatorStats,
  getCoordinatorTeacherStats,
  getCoordinatorClassStatus,
  getCoordinatorTeacherEvaluations,
} from '@/services';

/**
 * Controllers com controle de acesso baseado em role
 */

// ==================== DASHBOARD POR ROLE ====================

export async function getDashboardByRole(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const { role, id, email } = req.user;

    if (role === 'student') {
      const stats = await getStudentStats(id);
      const activities = await getStudentActivities(id);
      res.json({ stats, activities, role });
      return;
    }

    if (role === 'teacher') {
      const stats = await getTeacherStats(email);
      const riskProjects = await getTeacherRiskProjects(email);
      res.json({ stats, riskProjects, role });
      return;
    }

    if (role === 'coordinator') {
      const stats = await getCoordinatorStats();
      const teacherStats = await getCoordinatorTeacherStats();
      res.json({ stats, teacherStats, role });
      return;
    }

    res.status(400).json({ message: 'Role não reconhecido' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar dashboard' });
  }
}

// ==================== PROJETOS POR ROLE ====================

export async function getProjectsByRole(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const { role, id, email } = req.user;

    if (role === 'student') {
      const projects = await getStudentProjects(id);
      res.json(projects);
      return;
    }

    if (role === 'teacher') {
      const classCode = req.query.class as string;
      const projects = await getTeacherProjectsByClass(email, classCode);
      res.json(projects);
      return;
    }

    // Coordenador vê todos os projetos
    const allProjects = await getTeacherProjectsByClass('');
    res.json(allProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar projetos' });
  }
}

export async function getProjectDetailByRole(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const { role, id } = req.user;
    const { projectId } = req.params;

    if (role === 'student') {
      const project = await getStudentProjectById(projectId, id);
      if (!project) {
        res.status(404).json({ message: 'Projeto não encontrado' });
        return;
      }
      res.json(project);
      return;
    }

    // Teacher e coordinator podem ver todos os projetos
    res.json({ message: 'Teacher/Coordinator view - implementar' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar projeto' });
  }
}

// ==================== AVALIAÇÕES POR ROLE ====================

export async function getEvaluationsByRole(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const { role, id } = req.user;

    if (role === 'student') {
      const evaluations = await getStudentEvaluations(id);
      res.json(evaluations);
      return;
    }

    if (role === 'teacher') {
      // Teacher vê avaliações que fez
      res.json({ message: 'Teacher evaluations view - implementar' });
      return;
    }

    if (role === 'coordinator') {
      const teacherEmail = req.query.teacher as string;
      if (teacherEmail) {
        const evaluations = await getCoordinatorTeacherEvaluations(teacherEmail);
        res.json(evaluations);
        return;
      }
      res.status(400).json({ message: 'Parâmetro teacher é obrigatório' });
      return;
    }

    res.status(400).json({ message: 'Role não reconhecido' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar avaliações' });
  }
}

// ==================== RELATÓRIOS E ESTATÍSTICAS ====================

export async function getClassStatusByCoordinator(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'coordinator') {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    const { classCode } = req.params;
    const status = await getCoordinatorClassStatus(classCode);
    res.json(status);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar status da turma' });
  }
}

export async function getTeacherPerformanceByCoordinator(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || req.user.role !== 'coordinator') {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    const teacherStats = await getCoordinatorTeacherStats();
    res.json(teacherStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar desempenho dos professores' });
  }
}
