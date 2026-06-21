import { Request, Response } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  getActivities,
  getRiskProjects,
} from '@/services';

export async function getStats(req: Request, res: Response): Promise<void> {
  try {
    const projects = await getProjects();

    const stats = {
      totalProjects: projects.length,
      projectsAtRisk: projects.filter((p: any) => p.risk === 'Alto').length,
      pendingSubmissions: projects.filter(
        (p: any) => p.status !== 'Concluído'
      ).length,
      pendingEvaluations: 45, // Mock value
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
}

export async function getActivitiesHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const activities = await getActivities();
    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar atividades' });
  }
}

export async function getRiskProjectsHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const projects = await getRiskProjects();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar projetos em risco' });
  }
}

export async function getProjectsHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar projetos' });
  }
}

export async function getProjectHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const project = await getProjectById(id);

    if (!project) {
      res.status(404).json({ message: 'Projeto não encontrado' });
      return;
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar projeto' });
  }
}

export async function createProjectHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const project = await createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar projeto' });
  }
}
