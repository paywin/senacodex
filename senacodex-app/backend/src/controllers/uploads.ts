import { Request, Response } from 'express';
import { query, isUsingMemoryDatabase, memoryQuery } from '@/config/database';

export async function uploadFileHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params; // project id
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: 'Nenhum arquivo enviado.' });
      return;
    }

    const { version, notes } = req.body;
    const projectVersion = version || 'v1.0.0';
    const projectNotes = notes || '';

    const submissionDate = new Date().toLocaleDateString('pt-BR');
    const submissionTime = new Date().toLocaleTimeString('pt-BR');
    const fileUrl = `/uploads/${file.filename}`;
    const originalName = file.originalname;
    const fileSize = file.size;

    // Se estiver usando o banco em memória
    if (isUsingMemoryDatabase()) {
      const dbRow = {
        id: crypto.randomUUID(),
        project_id: id,
        version: projectVersion,
        submission_date: submissionDate,
        submission_time: submissionTime,
        grade: null,
        notes: projectNotes,
        file_url: fileUrl,
        original_name: originalName,
        file_size: fileSize,
        created_at: new Date()
      };
      
      // We don't have a specific project_versions array exported in memoryDatabase,
      // But we can just use memoryQuery if we had implemented it. For now, since
      // memoryDatabase is mocked manually, let's just create an activity to represent it
      await query(
        `INSERT INTO activities (id, user_id, icon, text, time, type) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          crypto.randomUUID(),
          (req as any).user?.id || 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', // default user demo if not found
          'fas fa-upload',
          `Submeteu a versão ${projectVersion} com anexo: ${originalName}`,
          'agora',
          'submission'
        ]
      );

      res.status(201).json({ 
        message: 'Upload realizado com sucesso (Memória)', 
        file: { url: fileUrl, originalName, size: fileSize } 
      });
      return;
    }

    // Se estiver usando PostgreSQL, insere na tabela project_versions (vamos atualizar a tabela)
    await query(
      `INSERT INTO project_versions (project_id, version, submission_date, submission_time, notes, file_url, original_name, file_size)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, projectVersion, submissionDate, submissionTime, projectNotes, fileUrl, originalName, fileSize]
    );

    // Registra a atividade
    await query(
      `INSERT INTO activities (user_id, icon, text, time, type)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        (req as any).user?.id || 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5',
        'fas fa-upload',
        `Submeteu a versão ${projectVersion} com anexo: ${originalName}`,
        'agora',
        'submission'
      ]
    );

    res.status(201).json({ 
      message: 'Upload realizado com sucesso', 
      file: { url: fileUrl, originalName, size: fileSize } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar o upload' });
  }
}

export async function getProjectVersionsHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (isUsingMemoryDatabase()) {
      res.json([]);
      return;
    }

    const versions = await query(
      `SELECT * FROM project_versions WHERE project_id = $1 ORDER BY created_at DESC`,
      [id]
    );

    res.json(versions.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar versões do projeto' });
  }
}
