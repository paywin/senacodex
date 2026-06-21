import { Request, Response } from 'express';
import { createProject, getProjectById, getProjects } from '@/services';

export async function getProjectsHandler(_req: Request, res: Response): Promise<void> {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar projetos' });
  }
}

export async function getProjectHandler(req: Request, res: Response): Promise<void> {
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

export async function createProjectHandler(req: Request, res: Response): Promise<void> {
  try {
    const project = await createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar projeto' });
  }
}
