import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageTitle } from '@/config/navigationByRole';
import { useAuthStore } from '@/store';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);

  // Obtém o título da página baseado no role do usuário
  const pageTitle = user?.role ? getPageTitle(pathname, user.role) : 'SENACODEX';

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="layout-main">
        <Header
          title={pageTitle}
          onMenuClick={() => setSidebarOpen((isOpen) => !isOpen)}
        />
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
}
