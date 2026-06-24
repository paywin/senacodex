import { Request, Response } from 'express';
import { query, isUsingMemoryDatabase } from '@/config/database';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import crypto from 'crypto';
import { logAudit } from '@/utils/audit';

const DANGEROUS_EXTENSIONS = ['.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.dll', '.apk'];

function inspectZipForDangerousFiles(filePath: string): string[] {
  try {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();
    const dangerousFound: string[] = [];
    
    zipEntries.forEach((zipEntry) => {
      const ext = path.extname(zipEntry.entryName).toLowerCase();
      if (DANGEROUS_EXTENSIONS.includes(ext)) {
        dangerousFound.push(zipEntry.entryName);
      }
    });
    
    return dangerousFound;
  } catch (error) {
    console.error('Erro ao inspecionar ZIP:', error);
    return [];
  }
}

export async function uploadFileHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params; // project id
    const files = req.files as Express.Multer.File[];
    const userId = req.user?.id || 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5'; // default fallback

    if (!files || files.length === 0) {
      res.status(400).json({ message: 'Nenhum arquivo enviado.' });
      return;
    }

    const { version, notes } = req.body;
    const projectVersion = version || 'v1.0.0';
    const projectNotes = notes || '';
    const submissionDate = new Date().toLocaleDateString('pt-BR');
    const submissionTime = new Date().toLocaleTimeString('pt-BR');

    // Validações de segurança básicas
    let hasDangerous = false;
    const dangerousDetails: string[] = [];

    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (DANGEROUS_EXTENSIONS.includes(ext)) {
        fs.unlinkSync(file.path); // remove
        res.status(400).json({ message: 'Upload rejeitado: extensão perigosa detectada.' });
        return;
      }

      if (ext === '.zip' || ext === '.rar') {
        // Nota: adm-zip não suporta RAR. RAR inspection precisaria de node-unrar. 
        // Vamos focar no ZIP por limitação da biblioteca, mas em produção um scanner robusto seria usado.
        if (ext === '.zip') {
          const dangerousInZip = inspectZipForDangerousFiles(file.path);
          if (dangerousInZip.length > 0) {
            hasDangerous = true;
            dangerousDetails.push(`ZIP ${file.originalname} contém: ${dangerousInZip.join(', ')}`);
          }
        }
      }
    }

    if (isUsingMemoryDatabase()) {
      res.status(201).json({ message: 'Upload realizado (Modo Memória).' });
      return;
    }

    await query('BEGIN');

    // Inserir versão
    const versionResult = await query(
      `INSERT INTO project_versions (project_id, version, submission_date, submission_time, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [id, projectVersion, submissionDate, submissionTime, projectNotes]
    );
    const newVersionId = versionResult.rows[0].id;

    // Inserir arquivos
    for (const file of files) {
      const fileUrl = `/uploads/${file.filename}`;
      const checksum = crypto.createHash('md5').update(fs.readFileSync(file.path)).digest('hex');
      
      await query(
        `INSERT INTO project_files (project_version_id, original_name, stored_name, file_path, mime_type, file_size, checksum, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [newVersionId, file.originalname, file.filename, fileUrl, file.mimetype, file.size, checksum, userId]
      );
    }

    let alertText = '';
    if (hasDangerous) {
      alertText = ` (ALERTA DE SEGURANÇA: ${dangerousDetails.join('; ')})`;
    }

    // Registra a atividade
    await query(
      `INSERT INTO activities (user_id, icon, text, time, type)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        userId,
        'fas fa-upload',
        `Submeteu a versão ${projectVersion} com ${files.length} arquivo(s)${alertText}`,
        'agora',
        'submission'
      ]
    );

    await logAudit(userId, 'UPLOAD_FILES', 'project', id, `Submeteu versão ${projectVersion} com ${files.length} arquivos.${alertText}`, req.ip);

    await query('COMMIT');

    res.status(201).json({ 
      message: 'Upload realizado com sucesso', 
      warning: hasDangerous ? dangerousDetails : null
    });
  } catch (error) {
    await query('ROLLBACK');
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

    // Buscar versões
    const versionsRes = await query(
      `SELECT * FROM project_versions WHERE project_id = $1 ORDER BY created_at DESC`,
      [id]
    );
    const versions = versionsRes.rows;

    // Para cada versão, buscar os arquivos
    for (const v of versions) {
      const filesRes = await query(`SELECT * FROM project_files WHERE project_version_id = $1`, [v.id]);
      v.files = filesRes.rows;
    }

    res.json(versions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar versões do projeto' });
  }
}

export async function downloadFileHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id, fileId } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !role) {
      res.status(401).json({ message: 'Não autorizado' });
      return;
    }

    // Verifica permissões no projeto (Se coordenador, tudo liberado. Se teacher, verifica se é advisor. Se student, verifica se está em students)
    const projectRes = await query(`SELECT * FROM projects WHERE id = $1`, [id]);
    const project = projectRes.rows[0];

    if (!project) {
      res.status(404).json({ message: 'Projeto não encontrado' });
      return;
    }

    let hasAccess = false;
    if (role === 'coordinator') {
      hasAccess = true;
    } else if (role === 'teacher') {
      hasAccess = project.advisor === req.user?.email;
    } else if (role === 'student') {
      const studentsArr = JSON.parse(project.students || '[]');
      hasAccess = studentsArr.includes(userId);
    }

    if (!hasAccess) {
      await logAudit(userId, 'UNAUTHORIZED_DOWNLOAD_ATTEMPT', 'project_files', fileId, `Tentativa de download sem permissão no projeto ${id}`, req.ip);
      res.status(403).json({ message: 'Acesso negado para baixar arquivos deste projeto' });
      return;
    }

    const fileRes = await query(`SELECT * FROM project_files WHERE id = $1`, [fileId]);
    const fileRow = fileRes.rows[0];

    if (!fileRow) {
      res.status(404).json({ message: 'Arquivo não encontrado' });
      return;
    }

    const absolutePath = path.join(process.cwd(), 'uploads', fileRow.stored_name);
    
    if (!fs.existsSync(absolutePath)) {
      res.status(404).json({ message: 'Arquivo físico não encontrado no servidor' });
      return;
    }

    await logAudit(userId, 'DOWNLOAD_FILE', 'project_files', fileId, `Download do arquivo ${fileRow.original_name}`, req.ip);

    res.download(absolutePath, fileRow.original_name);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar download' });
  }
}

