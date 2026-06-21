import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@store/index';
import Layout from '@components/layout/Layout';
import LoginPage from '@pages/LoginPage';
import DashboardPage from '@pages/DashboardPage';
import ProjectsPage from '@pages/ProjectsPage';
import SubmitVersionPage from '@pages/SubmitVersionPage';
import EvaluationsPage from '@pages/EvaluationsPage';
import ReportsPage from '@pages/ReportsPage';
import RiskPanel from '@pages/RiskPanel';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/projetos" element={<ProjectsPage />} />
                  <Route path="/submeter" element={<SubmitVersionPage />} />
                  <Route path="/avaliacoes" element={<EvaluationsPage />} />
                  <Route path="/relatorios" element={<ReportsPage />} />
                  <Route path="/risco" element={<RiskPanel />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
