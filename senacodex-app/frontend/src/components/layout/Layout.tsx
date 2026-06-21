import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const paths: Record<string, string> = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/projetos': 'Meus Projetos',
      '/submeter': 'Submeter Versão',
      '/avaliacoes': 'Avaliações',
      '/relatorios': 'Relatórios',
      '/risco': 'Painel de Risco',
    };
    return paths[location.pathname] || 'SENACODEX';
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="layout-main">
        <Header
          title={getPageTitle()}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
}
