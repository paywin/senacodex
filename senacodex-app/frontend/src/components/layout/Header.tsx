import { useAuthStore } from '@/store';
import './Header.css';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

function getInitials(name?: string): string {
  return name
    ? name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'U';
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick} type="button">
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
          <div className="avatar">{getInitials(user?.name)}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'Usuário'}</div>
            <div className="user-role">{user?.role || 'User'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
