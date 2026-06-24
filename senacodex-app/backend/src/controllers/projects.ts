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

import { query } from '@/config/database';
import { logAudit } from '@/utils/audit';

export async function createEvaluationHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { methodology, results, originality, formatting, finalGrade, feedback } = req.body;
    const userId = req.user?.id || 'admin-id';
    const userName = req.user?.name || 'Professor';

    const projectRes = await query(`SELECT * FROM projects WHERE id = $1`, [id]);
    if (projectRes.rows.length === 0) {
      res.status(404).json({ message: 'Projeto não encontrado' });
      return;
    }

    await query(
      `INSERT INTO evaluations (project_id, project_name, methodology, results, originality, formatting, final_grade, feedback, evaluated_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [id, projectRes.rows[0].name, methodology, results, originality, formatting, finalGrade, feedback, userName]
    );

    // Update risk to Baixo assuming evaluation was given (simplified logic, you can expand this)
    let risk = 'Baixo';
    if (finalGrade < 6) risk = 'Alto';
    else if (finalGrade < 8) risk = 'Médio';

    await query(`UPDATE projects SET risk = $1 WHERE id = $2`, [risk, id]);

    await logAudit(userId, 'CREATE_EVALUATION', 'project', id, `Avaliou com nota ${finalGrade}`, req.ip);

    res.status(201).json({ message: 'Avaliação salva com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao salvar avaliação' });
  }
}
