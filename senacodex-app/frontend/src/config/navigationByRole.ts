/**
 * Configuração de itens de navegação por role
 * Cada role (student, teacher, coordinator) tem seu próprio menu
 */

export type UserRole = 'student' | 'teacher' | 'coordinator';

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles: UserRole[];
}

export const allNavigationItems: NavigationItem[] = [
  // ==== COMUM PARA TODOS ====
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
    path: '/dashboard',
    roles: ['student', 'teacher', 'coordinator'],
  },

  // ==== ALUNO (STUDENT) ====
  {
    id: 'meus-projetos',
    label: 'Meus Projetos',
    icon: 'fas fa-folder-open',
    path: '/projetos',
    roles: ['student'],
  },
  {
    id: 'submeter-versao',
    label: 'Submeter Versão',
    icon: 'fas fa-upload',
    path: '/submeter',
    roles: ['student'],
  },
  {
    id: 'minhas-avaliacoes',
    label: 'Minhas Avaliações',
    icon: 'fas fa-star',
    path: '/avaliacoes',
    roles: ['student'],
  },

  // ==== PROFESSOR (TEACHER) ====
  {
    id: 'gerenciar-projetos',
    label: 'Gerenciar Projetos',
    icon: 'fas fa-tasks',
    path: '/projetos-turma',
    roles: ['teacher'],
  },
  {
    id: 'avaliar-projetos',
    label: 'Avaliar Projetos',
    icon: 'fas fa-chalkboard-teacher',
    path: '/avaliacoes',
    roles: ['teacher'],
  },
  {
    id: 'alunos-performance',
    label: 'Desempenho dos Alunos',
    icon: 'fas fa-chart-bar',
    path: '/relatorios',
    roles: ['teacher'],
  },
  {
    id: 'projetos-risco',
    label: 'Projetos em Risco',
    icon: 'fas fa-exclamation-triangle',
    path: '/risco',
    roles: ['teacher'],
  },

  // ==== COORDENADOR (COORDINATOR) ====
  {
    id: 'monitoramento-turmas',
    label: 'Monitoramento de Turmas',
    icon: 'fas fa-graduation-cap',
    path: '/turmas',
    roles: ['coordinator'],
  },
  {
    id: 'performance-professores',
    label: 'Desempenho dos Professores',
    icon: 'fas fa-users-cog',
    path: '/professores',
    roles: ['coordinator'],
  },
  {
    id: 'relatorios-geral',
    label: 'Relatórios Gerais',
    icon: 'fas fa-chart-line',
    path: '/relatorios',
    roles: ['coordinator'],
  },
  {
    id: 'solicitacoes-exclusao',
    label: 'Solicitações de Exclusão',
    icon: 'fas fa-trash-alt',
    path: '/solicitacoes',
    roles: ['teacher', 'coordinator'],
  },
];

/**
 * Retorna itens de navegação filtrados por role
 */
export function getNavigationItemsByRole(role: UserRole): NavigationItem[] {
  return allNavigationItems.filter((item) => item.roles.includes(role));
}

/**
 * Títulos de páginas por rota
 */
export const pageTitlesByRole: Record<string, Record<UserRole, string>> = {
  '/': { student: 'Dashboard', teacher: 'Dashboard', coordinator: 'Dashboard' },
  '/dashboard': { student: 'Dashboard', teacher: 'Dashboard', coordinator: 'Dashboard' },
  '/projetos': { student: 'Meus Projetos', teacher: 'Gerenciar Projetos', coordinator: 'Projetos' },
  '/projetos-turma': { student: 'Projetos', teacher: 'Gerenciar Projetos', coordinator: 'Projetos' },
  '/submeter': { student: 'Submeter Versão', teacher: 'Submissões', coordinator: 'Submissões' },
  '/avaliacoes': { student: 'Minhas Avaliações', teacher: 'Avaliar Projetos', coordinator: 'Avaliações' },
  '/relatorios': { student: 'Relatórios', teacher: 'Desempenho dos Alunos', coordinator: 'Relatórios Gerais' },
  '/risco': { student: 'Painel de Risco', teacher: 'Projetos em Risco', coordinator: 'Análise de Riscos' },
  '/turmas': { student: 'Turmas', teacher: 'Turmas', coordinator: 'Monitoramento de Turmas' },
  '/professores': { student: 'Professores', teacher: 'Professores', coordinator: 'Desempenho dos Professores' },
  '/solicitacoes': { student: 'Solicitações', teacher: 'Solicitações de Exclusão', coordinator: 'Solicitações de Exclusão' },
};

/**
 * Retorna o título da página conforme role e rota
 */
export function getPageTitle(pathname: string, role: UserRole): string {
  return pageTitlesByRole[pathname]?.[role] || 'SENACODEX';
}
