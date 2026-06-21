import { useEffect, useState } from 'react';
import api from '@/services/api';
import type { IEvaluation } from '@/shared/types';
import './ProjectsPage.css';

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<IEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEvaluations() {
      try {
        setLoading(true);
        const response = await api.getEvaluations();
        setEvaluations(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar avaliações');
      } finally {
        setLoading(false);
      }
    }

    fetchEvaluations();
  }, []);

  return (
    <div className="projects-page">
      <div className="section-card">
        <h2>Avaliações</h2>
        <p>Consulte as avaliações dos seus projetos.</p>
      </div>
      {loading && <div className="section-card">Carregando avaliações...</div>}
      {error && <div className="section-card">{error}</div>}
      {!loading && !error && (
        <div className="section-card">
          {evaluations.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th>Avaliado por</th>
                  <th>Nota</th>
                  <th>Comentário</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((evaluation) => (
                  <tr key={evaluation.id}>
                    <td>{evaluation.projectName}</td>
                    <td>{evaluation.reviewer}</td>
                    <td>{evaluation.score ?? '-'}</td>
                    <td>{evaluation.comments || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhuma avaliação registrada ainda.</p>
          )}
        </div>
      )}
    </div>
  );
}
