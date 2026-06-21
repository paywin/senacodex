import { useAuthStore } from '@store/index';
import './Header.css';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <i className="fas fa-bars"></i>
        </button>
        <div className="page-title">
          <h1>{title}</h1>
        </div>
      </div>

      <div className="header-actions">
        <div className="notification-bell">
          <i className="far fa-bell"></i>
          <span className="notification-badge">3</span>
        </div>
        <div className="user-profile">
          <div className="avatar">
            {user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'Usuário'}</div>
            <div className="user-role">{user?.role || 'User'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
