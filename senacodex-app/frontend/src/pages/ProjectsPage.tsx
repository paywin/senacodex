import { useEffect, useState } from 'react';
import api from '@/services/api';
import type { Project } from '@/shared/types';
import { Link } from 'react-router-dom';
import './ProjectsPage.css';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await api.getProjects();
        setProjects(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar projetos');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="projects-page">
      <div className="section-card">
        <h2>Meus Projetos</h2>
        <p>Gerencie e acompanhe todos os seus projetos integradores.</p>
      </div>

      {loading && <div className="section-card">Carregando projetos...</div>}
      {error && <div className="section-card">{error}</div>}

      {!loading && !error && (
        <div className="section-card projects-list">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="project-card">
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.description || 'Sem descrição disponível'}</p>
                </div>
                <div className="project-meta">
                  <span className="badge">{project.status}</span>
                  <span className={project.risk === 'Alto' ? 'risk-high' : project.risk === 'Médio' ? 'risk-medium' : ''}>
                    {project.risk}
                  </span>
                </div>
                <div className="project-progress-bar">
                  <div className="project-progress-fill" style={{ width: `${project.progress}%` }} />
                </div>
                <div className="project-footer">
                  <span>{project.class}</span>
                  <span>{project.advisor}</span>
                  <span>{new Date(project.lastUpdate).toLocaleDateString('pt-BR')}</span>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <Link to={`/projetos/${project.id}`} className="btn" style={{ textDecoration: 'none', display: 'inline-block', backgroundColor: '#0056b3', color: 'white', padding: '8px 16px', borderRadius: '4px' }}>
                    Ver Detalhes / Arquivos
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum projeto encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}
