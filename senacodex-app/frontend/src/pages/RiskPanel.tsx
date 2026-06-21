import { useEffect, useState } from 'react';
import api from '@/services/api';
import type { Project } from '@/shared/types';
import './ProjectsPage.css';

export default function RiskPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRiskProjects() {
      try {
        setLoading(true);
        const response = await api.getRiskProjects();
        setProjects(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar painel de risco');
      } finally {
        setLoading(false);
      }
    }

    fetchRiskProjects();
  }, []);

  return (
    <div className="projects-page">
      <div className="section-card">
        <h2>Painel de Risco</h2>
        <p>Monitore projetos com risco alto ou médio.</p>
      </div>
      {loading && <div className="section-card">Carregando projetos em risco...</div>}
      {error && <div className="section-card">{error}</div>}
      {!loading && !error && (
        <div className="section-card">
          {projects.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th>Orientador</th>
                  <th>Status</th>
                  <th>Risco</th>
                  <th>Última atualização</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.name}</td>
                    <td>{project.advisor}</td>
                    <td>{project.status}</td>
                    <td className={project.risk === 'Alto' ? 'risk-high' : 'risk-medium'}>{project.risk}</td>
                    <td>{new Date(project.lastUpdate).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhum projeto em risco encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}
