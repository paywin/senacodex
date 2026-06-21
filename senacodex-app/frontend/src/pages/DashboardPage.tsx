import { useEffect, useState } from 'react';
import ActivityList from '@/components/ui/ActivityList';
import StatCard from '@/components/ui/StatCard';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import type { Activity, Project, Stats } from '@/shared/types';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsRes, activitiesRes, projectsRes] = await Promise.all([
          api.getStats(),
          api.getActivities(),
          api.getProjects(),
        ]);

        setStats(statsRes.data);
        setActivities(activitiesRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="dashboard loading">Carregando...</div>;
  }

  // Dashboard para Aluno
  if (user?.role === 'student') {
    return (
      <div className="dashboard dashboard-student">
        <div className="welcome-section">
          <h1>Bem-vindo, {user?.name}! 👨‍🎓</h1>
          <p>Acompanhe o progresso de seus projetos integradores</p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Meus Projetos"
            value={projects.length}
            icon="fas fa-folder-open"
            color="primary"
          />
          <StatCard
            title="Entregas Pendentes"
            value={stats?.pendingSubmissions || 0}
            icon="fas fa-upload"
            color="warning"
          />
          <StatCard
            title="Em Avaliação"
            value={stats?.pendingEvaluations || 0}
            icon="fas fa-hourglass-half"
            color="info"
          />
          <StatCard
            title="Em Risco"
            value={stats?.projectsAtRisk || 0}
            icon="fas fa-exclamation-triangle"
            color="danger"
          />
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2 className="section-title">
              <i className="fas fa-list-ul"></i> Seus Projetos Recentes
            </h2>
            <div className="projects-list">
              {projects.length > 0 ? (
                projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="project-card-mini">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <span className={`status status-${project.status.toLowerCase()}`}>{project.status}</span>
                  </div>
                ))
              ) : (
                <p>Nenhum projeto disponível</p>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title">
              <i className="fas fa-bell"></i> Atividades Recentes
            </h2>
            <ActivityList activities={activities} />
          </div>
        </div>
      </div>
    );
  }

  // Dashboard para Professor
  if (user?.role === 'teacher') {
    return (
      <div className="dashboard dashboard-teacher">
        <div className="welcome-section">
          <h1>Bem-vindo, Professor(a) {user?.name}! 👨‍🏫</h1>
          <p>Gerencie avaliações e acompanhe projetos da turma</p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total de Projetos"
            value={stats?.totalProjects || 0}
            icon="fas fa-folder-open"
            color="primary"
          />
          <StatCard
            title="Projetos em Risco"
            value={stats?.projectsAtRisk || 0}
            icon="fas fa-exclamation-triangle"
            color="danger"
          />
          <StatCard
            title="Aguardando Avaliação"
            value={stats?.pendingSubmissions || 0}
            icon="fas fa-check-circle"
            color="warning"
          />
          <StatCard
            title="Avaliações Concluídas"
            value={20}
            icon="fas fa-star"
            color="success"
          />
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2 className="section-title">
              <i className="fas fa-tasks"></i> Projetos Aguardando Avaliação
            </h2>
            <div className="projects-list">
              {projects.filter((p) => p.status === 'Em Revisão').length > 0 ? (
                projects
                  .filter((p) => p.status === 'Em Revisão')
                  .map((project) => (
                    <div key={project.id} className="project-card-mini">
                      <h3>{project.name}</h3>
                      <p>Turma: {project.class}</p>
                      <span className="status status-review">Aguardando Avaliação</span>
                    </div>
                  ))
              ) : (
                <p>Nenhum projeto aguardando avaliação</p>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title">
              <i className="fas fa-chart-bar"></i> Resumo de Projetos
            </h2>
            <div className="projects-summary">
              <p><strong>Em Andamento:</strong> {projects.filter((p) => p.status === 'Em Andamento').length}</p>
              <p><strong>Em Revisão:</strong> {projects.filter((p) => p.status === 'Em Revisão').length}</p>
              <p><strong>Concluídos:</strong> {projects.filter((p) => p.status === 'Concluído').length}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard para Coordenador
  if (user?.role === 'coordinator') {
    return (
      <div className="dashboard dashboard-coordinator">
        <div className="welcome-section">
          <h1>Painel Administrativo - Coordenador {user?.name}! 👨‍💼</h1>
          <p>Visão geral e controle de toda a plataforma</p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total de Projetos"
            value={stats?.totalProjects || 0}
            icon="fas fa-folder-open"
            color="primary"
          />
          <StatCard
            title="Projetos em Risco"
            value={stats?.projectsAtRisk || 0}
            icon="fas fa-exclamation-triangle"
            color="danger"
          />
          <StatCard
            title="Entregas Pendentes"
            value={stats?.pendingSubmissions || 0}
            icon="fas fa-clock"
            color="warning"
          />
          <StatCard
            title="Avaliações Pendentes"
            value={stats?.pendingEvaluations || 0}
            icon="fas fa-tasks"
            color="info"
          />
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2 className="section-title">
              <i className="fas fa-exclamation-circle"></i> Alertas - Projetos em Risco
            </h2>
            <div className="projects-list">
              {projects.filter((p) => p.risk === 'Alto' || p.risk === 'Médio').length > 0 ? (
                projects
                  .filter((p) => p.risk === 'Alto' || p.risk === 'Médio')
                  .map((project) => (
                    <div key={project.id} className="project-card-mini alert">
                      <h3>{project.name}</h3>
                      <p>Turma: {project.class} | Risco: <strong>{project.risk}</strong></p>
                      <span className={`status status-${project.risk.toLowerCase()}`}>{project.risk}</span>
                    </div>
                  ))
              ) : (
                <p>Nenhum projeto em risco crítico</p>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title">
              <i className="fas fa-chart-line"></i> Estatísticas Gerais
            </h2>
            <div className="projects-summary">
              <p><strong>Total de Projetos:</strong> {stats?.totalProjects || 0}</p>
              <p><strong>Em Andamento:</strong> {projects.filter((p) => p.status === 'Em Andamento').length}</p>
              <p><strong>Em Revisão:</strong> {projects.filter((p) => p.status === 'Em Revisão').length}</p>
              <p><strong>Concluídos:</strong> {projects.filter((p) => p.status === 'Concluído').length}</p>
              <p><strong>Taxa de Conclusão:</strong> {stats?.totalProjects ? Math.round((projects.filter((p) => p.status === 'Concluído').length / stats.totalProjects) * 100) : 0}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return <div className="dashboard">Dashboard não disponível</div>;
}

