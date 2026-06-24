export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'teacher' | 'coordinator';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject {
  id: string;
  name: string;
  description?: string;
  class: string;
  advisor: string;
  status: 'Em Andamento' | 'Em Revisão' | 'Concluído' | 'Ativado';
  progress: number;
  risk: 'Alto' | 'Médio' | 'Baixo';
  lastUpdate: string;
  students?: string[];
  teamMembers?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectVersion {
  id: string;
  projectId: string;
  version: string;
  submissionDate: string;
  submissionTime: string;
  grade?: number;
  notes?: string;
  createdAt: Date;
}

export interface IProjectFile {
  id: string;
  projectVersionId: string;
  originalName: string;
  storedName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  checksum?: string;
  createdBy: string;
  createdAt: Date;
}

export interface IAuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: Date;
}

export interface IEvaluation {
  id: string;
  projectId: string;
  projectName: string;
  methodology: number;
  results: number;
  originality: number;
  formatting: number;
  feedback: string;
  finalGrade?: number;
  evaluatedBy: string;
  createdAt: Date;
}

export interface IActivity {
  id: string;
  userId: string;
  icon: string;
  text: string;
  time: string;
  type: 'update' | 'feedback' | 'alert' | 'deadline';
  createdAt: Date;
}

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}
