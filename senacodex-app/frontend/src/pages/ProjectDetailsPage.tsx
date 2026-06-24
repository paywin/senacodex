import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import type { Project, ProjectVersion } from '@/shared/types';
import './ProjectsPage.css'; // Reuse styles or create new ones

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [versionName, setVersionName] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadWarning, setUploadWarning] = useState<string[]>([]);

  // Evaluation State
  const [evalMethodology, setEvalMethodology] = useState<number>(0);
  const [evalResults, setEvalResults] = useState<number>(0);
  const [evalOriginality, setEvalOriginality] = useState<number>(0);
  const [evalFormatting, setEvalFormatting] = useState<number>(0);
  const [evalFeedback, setEvalFeedback] = useState('');

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';
  const isCoordinator = user?.role === 'coordinator';
  // Use it so TS is happy (or we could just use it to show a badge)

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projRes, versionsRes] = await Promise.all([
        api.getProject(id!),
        api.getProjectVersions(id!)
      ]);
      setProject(projRes.data);
      setVersions(versionsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || selectedFiles.length === 0) return;

    try {
      setUploading(true);
      setUploadWarning([]);
      const formData = new FormData();
      formData.append('version', versionName || `v${versions.length + 1}.0.0`);
      formData.append('notes', notes);
      
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await api.uploadProjectVersion(id, formData);
      
      if (response.data.warning && response.data.warning.length > 0) {
        setUploadWarning(response.data.warning);
        alert('Upload concluído, mas com avisos de segurança. Verifique a tela.');
      } else {
        alert('Upload realizado com sucesso!');
      }

      setVersionName('');
      setNotes('');
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao realizar upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      await api.downloadFile(id!, fileId, filename);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao baixar arquivo.');
    }
  };

  const handleEvaluationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      const finalGrade = (evalMethodology + evalResults + evalOriginality + evalFormatting) / 4;
      await api.evaluateProject(id, {
        methodology: evalMethodology,
        results: evalResults,
        originality: evalOriginality,
        formatting: evalFormatting,
        finalGrade,
        feedback: evalFeedback
      });
      alert('Avaliação salva com sucesso!');
      loadData(); // To refresh risk and details
    } catch (err) {
      alert('Erro ao salvar avaliação.');
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!project) return <div>Projeto não encontrado.</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{project.name} {isCoordinator && <span style={{ fontSize: '0.5em', background: '#e0e0e0', padding: '2px 6px', borderRadius: '4px' }}>Visão Coordenador</span>}</h1>
        <p className="subtitle">{project.description}</p>
        <div style={{ marginTop: '10px' }}>
          <span style={{ marginRight: '15px' }}><strong>Status:</strong> {project.status}</span>
          <span><strong>Risco:</strong> <span style={{ color: project.risk === 'Alto' ? 'red' : project.risk === 'Médio' ? 'orange' : 'green' }}>{project.risk}</span></span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
        
        {/* Lado Esquerdo - Upload e Avaliação dependendo do papel */}
        <div style={{ flex: 1 }}>
          {isStudent && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <h2>Enviar Nova Versão / Arquivos</h2>
              {uploadWarning.length > 0 && (
                <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', marginBottom: '15px', borderRadius: '4px' }}>
                  <strong>Aviso de Segurança:</strong>
                  <ul style={{ margin: '5px 0 0 20px' }}>
                    {uploadWarning.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
              <form onSubmit={handleUploadSubmit} className="form-container">
                <div className="form-group">
                  <label>Nome da Versão (Opcional)</label>
                  <input 
                    type="text" 
                    value={versionName} 
                    onChange={e => setVersionName(e.target.value)} 
                    placeholder={`ex: v${versions.length + 1}.0.0`}
                  />
                </div>
                <div className="form-group">
                  <label>Observações</label>
                  <textarea 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Selecione Arquivos ou Pasta</label>
                  {/* Utilizando webkitdirectory para suportar pastas inteiras, além do multiple normal */}
                  <input 
                    type="file" 
                    multiple 
                    ref={fileInputRef}
                    onChange={handleFileChange} 
                    // @ts-ignore
                    webkitdirectory="true"
                    directory="true"
                    style={{ padding: '10px', border: '1px dashed #ccc', width: '100%' }}
                  />
                  {selectedFiles.length > 0 && (
                    <small>{selectedFiles.length} arquivo(s) selecionado(s)</small>
                  )}
                </div>
                <button type="submit" className="btn btn-primary" disabled={uploading || selectedFiles.length === 0}>
                  {uploading ? 'Enviando...' : 'Fazer Upload'}
                </button>
              </form>
            </div>
          )}

          {isTeacher && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <h2>Avaliar Projeto</h2>
              <form onSubmit={handleEvaluationSubmit} className="form-container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Metodologia (0-10)</label>
                    <input type="number" min="0" max="10" step="0.1" value={evalMethodology} onChange={e => setEvalMethodology(Number(e.target.value))} required />
                  </div>
                  <div className="form-group">
                    <label>Resultados (0-10)</label>
                    <input type="number" min="0" max="10" step="0.1" value={evalResults} onChange={e => setEvalResults(Number(e.target.value))} required />
                  </div>
                  <div className="form-group">
                    <label>Originalidade (0-10)</label>
                    <input type="number" min="0" max="10" step="0.1" value={evalOriginality} onChange={e => setEvalOriginality(Number(e.target.value))} required />
                  </div>
                  <div className="form-group">
                    <label>Formatação (0-10)</label>
                    <input type="number" min="0" max="10" step="0.1" value={evalFormatting} onChange={e => setEvalFormatting(Number(e.target.value))} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Nota Final Prevista: {((evalMethodology + evalResults + evalOriginality + evalFormatting) / 4).toFixed(1)}</label>
                </div>
                <div className="form-group">
                  <label>Feedback Comentado</label>
                  <textarea value={evalFeedback} onChange={e => setEvalFeedback(e.target.value)} rows={4} required />
                </div>
                <button type="submit" className="btn btn-primary">Salvar Avaliação</button>
              </form>
            </div>
          )}
        </div>

        {/* Lado Direito - Histórico de Versões */}
        <div style={{ flex: 1 }}>
          <div className="card">
            <h2>Histórico de Versões e Arquivos</h2>
            {versions.length === 0 ? (
              <p>Nenhuma versão submetida ainda.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {versions.map(v => (
                  <div key={v.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h3 style={{ margin: 0 }}>{v.version}</h3>
                      <span style={{ fontSize: '0.85em', color: '#666' }}>{v.submissionDate} às {v.submissionTime}</span>
                    </div>
                    {v.notes && <p style={{ fontSize: '0.9em', color: '#444' }}><em>"{v.notes}"</em></p>}
                    
                    <div style={{ marginTop: '10px' }}>
                      <strong>Arquivos anexados:</strong>
                      <ul style={{ listStyleType: 'none', padding: 0, margin: '5px 0 0 0' }}>
                        {v.files?.map(f => (
                          <li key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #f5f5f5' }}>
                            <span title={f.originalName} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>
                              <i className="fas fa-file" style={{ marginRight: '8px', color: '#666' }}></i>
                              {f.originalName}
                            </span>
                            <button onClick={() => handleDownload(f.id, f.originalName)} className="btn" style={{ padding: '4px 8px', fontSize: '0.8em' }}>
                              <i className="fas fa-download"></i> Baixar
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
