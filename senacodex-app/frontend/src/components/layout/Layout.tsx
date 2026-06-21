import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { pageTitles } from '@/config/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="layout-main">
        <Header
          title={pageTitles[pathname] || 'SENACODEX'}
          onMenuClick={() => setSidebarOpen((isOpen) => !isOpen)}
        />
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
}
