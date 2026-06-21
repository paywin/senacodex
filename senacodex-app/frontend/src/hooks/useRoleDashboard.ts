import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { api } from '@/services/api';

export interface StudentStats {
  totalProjects: number;
  projectsInProgress: number;
  projectsUnderReview: number;
  projectsCompleted: number;
  evaluationsReceived: number;
  averageGrade: string | number;
}

export interface TeacherStats {
  totalProjects: number;
  projectsAtRisk: number;
  projectsInProgress: number;
  evaluationsPending: number;
  evaluationsCompleted: number;
}

export interface CoordinatorStats {
  totalProjects: number;
  totalClasses: number;
  classStats: Record<string, number>;
  statusStats: {
    excellent: number;
    good: number;
    medium: number;
    low: number;
  };
  evaluationsCompleted: number;
}

export function useRoleDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<StudentStats | TeacherStats | CoordinatorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.get('/role-dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data.stats);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dashboard');
        console.error('Erro ao buscar dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, token]);

  return { stats, loading, error, role: user?.role };
}
