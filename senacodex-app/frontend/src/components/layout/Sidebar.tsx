import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/index';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', path: '/dashboard' },
  { id: 'projetos', label: 'Meus Projetos', icon: 'fas fa-folder-open', path: '/projetos' },
  { id: 'submeter', label: 'Submeter Versão', icon: 'fas fa-upload', path: '/submeter' },
  { id: 'avaliacoes', label: 'Avaliações', icon: 'fas fa-chalkboard-teacher', path: '/avaliacoes' },
  { id: 'relatorios', label: 'Relatórios', icon: 'fas fa-chart-line', path: '/relatorios' },
  { id: 'risco', label: 'Painel de Risco', icon: 'fas fa-exclamation-triangle', path: '/risco' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo-area">
          <h2>
            <span className="sena">SENA</span>
            <span className="codex">CODEX</span>
          </h2>
          <p>Gestão de PI</p>
        </div>

        <nav className="nav-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="nav-item"
              onClick={() => handleNavigation(item.path)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item">
            <i className="fas fa-cog"></i>
            <span>Configurações</span>
          </button>
          <button className="nav-item">
            <i className="fas fa-question-circle"></i>
            <span>Ajuda</span>
          </button>
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
