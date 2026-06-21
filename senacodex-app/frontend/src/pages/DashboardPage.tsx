import { useEffect, useState } from 'react';
import ActivityList from '@/components/ui/ActivityList';
import StatCard from '@/components/ui/StatCard';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import type { Activity, Project, Stats } from '@/shared/types';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [riskProjects, setRiskProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherStats, setTeacherStats] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        if (user?.role && token) {
          const roleRes = await api.get('/role-dashboard/stats', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStats(roleRes.data.stats);
          if (roleRes.data.riskProjects) setRiskProjects(roleRes.data.riskProjects);
          if (roleRes.data.teacherStats) setTeacherStats(roleRes.data.teacherStats);
        } else {
          const [statsRes, activitiesRes, projectsRes] = await Promise.all([
            api.getStats(),
            api.getActivities(),
            api.getProjects(),
          ]);

          setStats(statsRes.data);
          setActivities(activitiesRes.data);
          setProjects(projectsRes.data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, token]);

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
            value={stats?.totalProjects || 0}
            icon="fas fa-folder-open"
            color="primary"
          />
          <StatCard
            title="Em Andamento"
            value={stats?.projectsInProgress || 0}
            icon="fas fa-hourglass-start"
            color="info"
          />
          <StatCard
            title="Em Avaliação"
            value={stats?.projectsUnderReview || 0}
            icon="fas fa-hourglass-half"
            color="warning"
          />
          <StatCard
            title="Avaliações Recebidas"
            value={stats?.evaluationsReceived || 0}
            icon="fas fa-star"
            color="success"
          />
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2 className="section-title">
              <i className="fas fa-info-circle"></i> Resumo de Desempenho
            </h2>
            <div className="performance-summary">
              <p><strong>Nota Média:</strong> {stats?.averageGrade || 'N/A'}</p>
              <p><strong>Projetos Completos:</strong> {stats?.projectsCompleted || 0}</p>
            </div>
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
          <h1>Bem-vindo, Prof. {user?.name}! 👨‍🏫</h1>
          <p>Gerencie projetos e acompanhe o desempenho dos alunos</p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total de Projetos"
            value={stats?.totalProjects || 0}
            icon="fas fa-tasks"
            color="primary"
          />
          <StatCard
            title="Em Progresso"
            value={stats?.projectsInProgress || 0}
            icon="fas fa-spinner"
            color="info"
          />
          <StatCard
            title="Projetos em Risco"
            value={stats?.projectsAtRisk || 0}
            icon="fas fa-exclamation-triangle"
            color="danger"
          />
          <StatCard
            title="Avaliações Pendentes"
            value={stats?.evaluationsPending || 0}
            icon="fas fa-clipboard-check"
            color="warning"
          />
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2 className="section-title">
              <i className="fas fa-fire"></i> Projetos em Risco
            </h2>
            <div className="projects-list">
              {riskProjects && riskProjects.length > 0 ? (
                riskProjects.slice(0, 5).map((project) => (
                  <div key={project.id} className="project-card-mini">
                    <div className="project-header">
                      <h3>{project.name}</h3>
                      <span className={`risk risk-${project.risk?.toLowerCase()}`}>{project.risk}</span>
                    </div>
                    <p className="project-progress">Progresso: {project.progress}%</p>
                  </div>
                ))
              ) : (
                <p>Nenhum projeto em risco!</p>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title">
              <i className="fas fa-chart-bar"></i> Estatísticas
            </h2>
            <div className="stats-detail">
              <p><strong>Total Avaliados:</strong> {stats?.evaluationsCompleted || 0}</p>
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
          <h1>Bem-vindo, Coordenador(a) {user?.name}! 👩‍💼</h1>
          <p>Monitore turmas, professores e projetos em geral</p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total de Projetos"
            value={stats?.totalProjects || 0}
            icon="fas fa-project-diagram"
            color="primary"
          />
          <StatCard
            title="Turmas"
            value={stats?.totalClasses || 0}
            icon="fas fa-graduation-cap"
            color="info"
          />
          <StatCard
            title="Projetos Excelentes"
            value={stats?.statusStats?.excellent || 0}
            icon="fas fa-star"
            color="success"
          />
          <StatCard
            title="Projetos em Risco"
            value={stats?.statusStats?.low || 0}
            icon="fas fa-exclamation-triangle"
            color="danger"
          />
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2 className="section-title">
              <i className="fas fa-chart-pie"></i> Distribuição por Status
            </h2>
            <div className="status-breakdown">
              <div className="status-item">
                <span className="status-label">Excelente (≥80%)</span>
                <span className="status-value">{stats?.statusStats?.excellent || 0}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Bom (60-79%)</span>
                <span className="status-value">{stats?.statusStats?.good || 0}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Médio (40-59%)</span>
                <span className="status-value">{stats?.statusStats?.medium || 0}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Baixo (&lt;40%)</span>
                <span className="status-value">{stats?.statusStats?.low || 0}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title">
              <i className="fas fa-users-cog"></i> Desempenho dos Professores
            </h2>
            <div className="teachers-list">
              {teacherStats && teacherStats.length > 0 ? (
                teacherStats.slice(0, 5).map((teacher: any, index: number) => (
                  <div key={index} className="teacher-card">
                    <p><strong>{teacher.advisor}</strong></p>
                    <p>Projetos: {teacher.total_projects}</p>
                    <p>Em Risco: {teacher.projects_at_risk}</p>
                  </div>
                ))
              ) : (
                <p>Sem dados de professores</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Role não reconhecido</p>
    </div>
  );
}
