import { FormEvent, useState } from 'react';
import api from '@/services/api';
import './ProjectsPage.css';

export default function SubmitVersionPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [className, setClassName] = useState('T1');
  const [advisor, setAdvisor] = useState('');
  const [risk, setRisk] = useState('Baixo');
  const [status, setStatus] = useState('Em Andamento');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api.createProject({
        name,
        description,
        class: className,
        advisor,
        status,
        risk,
        students: [],
        teamMembers: [],
      });

      setMessage('Projeto submetido com sucesso.');
      setName('');
      setDescription('');
      setAdvisor('');
      setClassName('T1');
      setRisk('Baixo');
      setStatus('Em Andamento');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao submeter projeto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="projects-page">
      <div className="section-card">
        <h2>Submeter Versão</h2>
        <p>Cadastre um novo projeto ou versão para acompanhamento.</p>
      </div>
      <div className="section-card">
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <form className="submit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="projectName">Nome do projeto</label>
            <input
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="projectDescription">Descrição</label>
            <textarea
              id="projectDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="form-group">
            <label htmlFor="className">Turma</label>
            <input
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="advisor">Orientador</label>
            <input
              id="advisor"
              value={advisor}
              onChange={(e) => setAdvisor(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Em Revisão">Em Revisão</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="risk">Risco</label>
            <select id="risk" value={risk} onChange={(e) => setRisk(e.target.value)}>
              <option value="Baixo">Baixo</option>
              <option value="Médio">Médio</option>
              <option value="Alto">Alto</option>
            </select>
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Projeto'}
          </button>
        </form>
      </div>
    </div>
  );
}
