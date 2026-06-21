import { Request, Response } from 'express';
import { getActivities, getEvaluationCount, getProjects, getRiskProjects, getEvaluations } from '@/services';

export async function getStats(_req: Request, res: Response): Promise<void> {
  try {
    const projects = await getProjects();
    const evaluationCount = await getEvaluationCount();

    res.json({
      totalProjects: projects.length,
      projectsAtRisk: projects.filter((project) => project.risk === 'Alto').length,
      pendingSubmissions: projects.filter((project) => project.status !== 'Concluído').length,
      pendingEvaluations: evaluationCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
}

export async function getActivitiesHandler(_req: Request, res: Response): Promise<void> {
  try {
    const activities = await getActivities();
    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar atividades' });
  }
}

export async function getRiskProjectsHandler(_req: Request, res: Response): Promise<void> {
  try {
    const projects = await getRiskProjects();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar projetos em risco' });
  }
}

export async function getEvaluationsHandler(_req: Request, res: Response): Promise<void> {
  try {
    const evaluations = await getEvaluations();
    res.json(evaluations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar avaliações' });
  }
}
