import { useEffect, useState } from 'react';
import api from '@/services/api';
import type { Stats } from '@/shared/types';
import './ProjectsPage.css';

export default function ReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await api.getStats();
        setStats(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar relatórios');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="projects-page">
      <div className="section-card">
        <h2>Relatórios</h2>
        <p>Acompanhe o desempenho dos projetos através de relatórios.</p>
      </div>
      {loading && <div className="section-card">Carregando relatórios...</div>}
      {error && <div className="section-card">{error}</div>}
      {!loading && !error && stats && (
        <div className="section-card">
          <div className="projects-list">
            <div className="project-card">
              <h3>Projetos Totais</h3>
              <p>{stats.totalProjects}</p>
            </div>
            <div className="project-card">
              <h3>Projetos em Risco</h3>
              <p>{stats.projectsAtRisk}</p>
            </div>
            <div className="project-card">
              <h3>Entregas Pendentes</h3>
              <p>{stats.pendingSubmissions}</p>
            </div>
            <div className="project-card">
              <h3>Avaliações Pendentes</h3>
              <p>{stats.pendingEvaluations}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
