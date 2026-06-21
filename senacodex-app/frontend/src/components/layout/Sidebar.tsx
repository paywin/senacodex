import { useNavigate } from 'react-router-dom';
import { getNavigationItemsByRole } from '@/config/navigationByRole';
import { useAuthStore } from '@/store';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  // Obtém itens de navegação baseado no role do usuário
  const navigationItems = user?.role ? getNavigationItemsByRole(user.role) : [];

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
            <span className="sena">SENAC</span>
            <span className="codex">ODEX</span>
          </h2>
          <p>Gestão de PI</p>
        </div>

        {/* Badge com role do usuário */}
        {user && (
          <div className="user-role-badge">
            <span className={`role-badge role-${user.role}`}>
              {user.role === 'student' && '👨‍🎓 Aluno'}
              {user.role === 'teacher' && '👨‍🏫 Professor'}
              {user.role === 'coordinator' && '👩‍💼 Coordenador'}
            </span>
          </div>
        )}

        <nav className="nav-menu">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className="nav-item"
              onClick={() => handleNavigation(item.path)}
              type="button"
              title={item.label}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" type="button">
            <i className="fas fa-cog"></i>
            <span>Configurações</span>
          </button>
          <button className="nav-item" type="button">
            <i className="fas fa-question-circle"></i>
            <span>Ajuda</span>
          </button>
          <button className="nav-item logout-btn" onClick={handleLogout} type="button">
            <i className="fas fa-sign-out-alt"></i>
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
