export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'coordinator';
  avatar?: string;
}

export interface Project {
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
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  icon: string;
  text: string;
  time: string;
  type: 'update' | 'feedback' | 'alert' | 'deadline';
}

export interface ProjectFile {
  id: string;
  projectVersionId: string;
  originalName: string;
  storedName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  checksum?: string;
  createdBy: string;
  createdAt: string;
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  version: string;
  submissionDate: string;
  submissionTime: string;
  grade?: number;
  notes?: string;
  createdAt: string;
  files?: ProjectFile[];
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
  createdAt: string;
}

export interface Stats {
  totalProjects: number;
  projectsAtRisk: number;
  pendingSubmissions: number;
  pendingEvaluations: number;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  user: User;
}
