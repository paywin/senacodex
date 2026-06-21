import { useEffect, useState } from 'react';
import api from '@services/api';
import { Stats, Activity, Project } from '@types/index';
import StatCard from '@components/ui/StatCard';
import ActivityList from '@components/ui/ActivityList';
import './DashboardPage.css';

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="dashboard loading">Carregando...</div>;
  }

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard
          title="Total de Projetos"
          value={stats?.totalProjects || 0}
          icon="fas fa-folder-open"
          color="primary"
          trend={{ value: 12, direction: 'up' }}
        />
        <StatCard
          title="Em Risco"
          value={stats?.projectsAtRisk || 0}
          icon="fas fa-exclamation-triangle"
          color="danger"
          trend={{ value: 28, direction: 'up' }}
        />
        <StatCard
          title="Entregas Pendentes"
          value={stats?.pendingSubmissions || 0}
          icon="fas fa-clock"
          color="warning"
          trend={{ value: 15, direction: 'up' }}
        />
        <StatCard
          title="Avaliações Pendentes"
          value={stats?.pendingEvaluations || 0}
          icon="fas fa-star"
          color="info"
          trend={{ value: 5, direction: 'down' }}
        />
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2 className="section-title">
            <i className="fas fa-list-ul"></i> Atividades Recentes
          </h2>
          <ActivityList activities={activities} />
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Distribuição de Projetos</h2>
          <div className="projects-summary">
            {projects.length > 0 ? (
              <>
                <p>Em Andamento: {projects.filter(p => p.status === 'Em Andamento').length}</p>
                <p>Em Revisão: {projects.filter(p => p.status === 'Em Revisão').length}</p>
                <p>Concluídos: {projects.filter(p => p.status === 'Concluído').length}</p>
              </>
            ) : (
              <p>Nenhum projeto disponível</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
