export const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', path: '/dashboard' },
  { id: 'projetos', label: 'Meus Projetos', icon: 'fas fa-folder-open', path: '/projetos' },
  { id: 'submeter', label: 'Submeter Versão', icon: 'fas fa-upload', path: '/submeter' },
  { id: 'avaliacoes', label: 'Avaliações', icon: 'fas fa-chalkboard-teacher', path: '/avaliacoes' },
  { id: 'relatorios', label: 'Relatórios', icon: 'fas fa-chart-line', path: '/relatorios' },
  { id: 'risco', label: 'Painel de Risco', icon: 'fas fa-exclamation-triangle', path: '/risco' },
];

export const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  ...Object.fromEntries(navigationItems.map((item) => [item.path, item.label])),
};
