import bcryptjs from 'bcryptjs';

type DbRow = Record<string, any>;

const memory = {
  users: [] as DbRow[],
  projects: [] as DbRow[],
  activities: [] as DbRow[],
  evaluations: [] as DbRow[],
};

export function seedMemoryDatabase(): void {
  const now = new Date();

  // Seed Users
  if (memory.users.length === 0) {
    const testUsers = [
      { id: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', name: 'João Silva', email: 'aluno@senac.com.br', password: 'Aluno@123', role: 'student' },
      { id: 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', name: 'Maria Santos', email: 'professor@senac.com.br', password: 'Professor@123', role: 'teacher' },
      { id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'Carlos Oliveira', email: 'coordenador@senac.com.br', password: 'Coordenador@123', role: 'coordinator' },
      { id: 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', name: 'Admin Demo', email: 'admin@example.com', password: 'Admin123', role: 'coordinator' },
      { id: 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', name: 'User Demo', email: 'user@example.com', password: 'User123', role: 'student' },
    ];

    for (const user of testUsers) {
      memory.users.push({
        id: user.id,
        name: user.name,
        email: user.email,
        password: bcryptjs.hashSync(user.password, 10),
        role: user.role,
        created_at: now,
        updated_at: now,
      });
    }
  }

  // Seed Projects
  if (memory.projects.length === 0) {
    memory.projects.push(
      {
        id: 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1',
        name: 'Sistema de Gestão de Inventário',
        description: 'Desenvolvimento de um sistema web para gerenciamento de estoque',
        class: '2024.1',
        advisor: 'professor@senac.com.br',
        status: 'Em Andamento',
        progress: 65,
        risk: 'Baixo',
        students: JSON.stringify(['e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1']),
        team_members: JSON.stringify(['João Silva', 'User Demo']),
        last_update: now,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2',
        name: 'App Mobile de Educação',
        description: 'Aplicativo para facilitar o aprendizado remoto',
        class: '2024.1',
        advisor: 'professor@senac.com.br',
        status: 'Em Andamento',
        progress: 45,
        risk: 'Médio',
        students: JSON.stringify(['a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1']),
        team_members: JSON.stringify(['João Silva']),
        last_update: now,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3',
        name: 'Smart Campus',
        description: 'Sistema inteligente para campus universitário',
        class: '2024.2',
        advisor: 'professor@senac.com.br',
        status: 'Em Andamento',
        progress: 20,
        risk: 'Alto',
        students: JSON.stringify(['e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5']),
        team_members: JSON.stringify(['User Demo']),
        last_update: now,
        created_at: now,
        updated_at: now,
      }
    );
  }

  // Seed Evaluations
  if (memory.evaluations.length === 0) {
    memory.evaluations.push(
      {
        id: 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1',
        project_id: 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1',
        project_name: 'Sistema de Gestão de Inventário',
        methodology: 8.5,
        results: 9.0,
        originality: 8.0,
        formatting: 9.5,
        feedback: 'Muito bom desenvolvimento e documentação.',
        final_grade: 8.8,
        evaluated_by: 'professor@senac.com.br',
        created_at: now,
      },
      {
        id: 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2',
        project_id: 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2',
        project_name: 'App Mobile de Educação',
        methodology: 7.0,
        results: 7.5,
        originality: 7.0,
        formatting: 8.0,
        feedback: 'Bom projeto, mas precisa de ajustes na metodologia.',
        final_grade: 7.4,
        evaluated_by: 'professor@senac.com.br',
        created_at: now,
      }
    );
  }

  // Seed Activities
  if (memory.activities.length === 0) {
    memory.activities.push(
      {
        id: crypto.randomUUID(),
        user_id: 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5',
        icon: 'fas fa-folder-plus',
        text: 'Criou o projeto Sistema de Gestão de Inventário',
        time: 'há 2 dias',
        type: 'create',
        created_at: now,
      },
      {
        id: crypto.randomUUID(),
        user_id: 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5',
        icon: 'fas fa-upload',
        text: 'Submeteu a versão v1.0.0',
        time: 'há 1 dia',
        type: 'submission',
        created_at: now,
      },
      {
        id: crypto.randomUUID(),
        user_id: crypto.randomUUID(),
        icon: 'fas fa-info-circle',
        text: 'Backend iniciado em modo desenvolvimento sem PostgreSQL',
        time: 'agora',
        type: 'update',
        created_at: now,
      }
    );
  }
}

export async function memoryQuery(text: string, params: any[] = []): Promise<{ rows: DbRow[] }> {
  const sql = text.trim().replace(/\s+/g, ' ').toLowerCase();

  // Users
  if (sql.startsWith('select * from users where email = $1')) {
    return { rows: memory.users.filter((user) => user.email === params[0]) };
  }
  if (sql.startsWith('select * from users where id = $1')) {
    return { rows: memory.users.filter((user) => user.id === params[0]) };
  }
  if (sql.startsWith('insert into users')) {
    const now = new Date();
    const user = {
      id: crypto.randomUUID(),
      name: params[0],
      email: params[1],
      password: params[2],
      role: params[3] || 'student',
      created_at: now,
      updated_at: now,
    };
    memory.users.push(user);
    return { rows: [user] };
  }

  // Projects
  if (sql.startsWith('select * from projects where students like $1')) {
    const studentId = params[0].replace(/%/g, '');
    return {
      rows: memory.projects
        .filter((project) => project.students && project.students.includes(studentId))
        .sort(sortNewestFirst),
    };
  }
  if (sql.startsWith('select * from projects where id = $1 and students like $2')) {
    const studentId = params[1].replace(/%/g, '');
    return {
      rows: memory.projects.filter(
        (project) => project.id === params[0] && project.students && project.students.includes(studentId)
      ),
    };
  }
  if (sql.startsWith('select * from projects where id = $1')) {
    return { rows: memory.projects.filter((project) => project.id === params[0]) };
  }
  if (sql.startsWith('select * from projects where advisor = $1 and class = $2')) {
    return {
      rows: memory.projects
        .filter((project) => project.advisor === params[0] && project.class === params[1])
        .sort(sortNewestFirst),
    };
  }
  if (sql.startsWith('select * from projects where advisor = $1 and risk in')) {
    return {
      rows: memory.projects
        .filter((project) => project.advisor === params[0] && ['Alto', 'Médio'].includes(project.risk))
        .sort(sortNewestFirst),
    };
  }
  if (sql.startsWith('select * from projects where advisor = $1')) {
    return {
      rows: memory.projects.filter((project) => project.advisor === params[0]).sort(sortNewestFirst),
    };
  }
  if (sql.startsWith('select * from projects where class = $1')) {
    return {
      rows: memory.projects
        .filter((project) => project.class === params[0])
        .sort((a, b) => b.progress - a.progress),
    };
  }
  if (sql.startsWith('select * from projects')) {
    return { rows: [...memory.projects].sort(sortNewestFirst) };
  }
  if (sql.startsWith('insert into projects')) {
    const now = new Date();
    const project = {
      id: crypto.randomUUID(),
      name: params[0],
      description: params[1],
      class: params[2],
      advisor: params[3],
      status: params[4] || 'Em Andamento',
      progress: params[5] || 0,
      risk: params[6] || 'Baixo',
      students: params[7] || JSON.stringify([]),
      team_members: params[8] || JSON.stringify([]),
      last_update: now,
      created_at: now,
      updated_at: now,
    };
    memory.projects.push(project);
    return { rows: [project] };
  }

  // Evaluations
  if (sql.startsWith('select e.* from evaluations e inner join projects p on e.project_id = p.id where p.students like $1')) {
    const studentId = params[0].replace(/%/g, '');
    const matchedProjects = memory.projects.filter((p) => p.students && p.students.includes(studentId));
    const projectIds = new Set(matchedProjects.map((p) => p.id));
    return {
      rows: memory.evaluations.filter((e) => projectIds.has(e.project_id)).sort(sortNewestFirst),
    };
  }
  if (sql.startsWith('select e.* from evaluations e inner join projects p on e.project_id = p.id where p.advisor = $1')) {
    const matchedProjects = memory.projects.filter((p) => p.advisor === params[0]);
    const projectIds = new Set(matchedProjects.map((p) => p.id));
    return {
      rows: memory.evaluations.filter((e) => projectIds.has(e.project_id)).sort(sortNewestFirst),
    };
  }
  if (sql.startsWith('select count(*) as count from evaluations')) {
    return { rows: [{ count: memory.evaluations.length }] };
  }
  if (sql.startsWith('select * from evaluations')) {
    return { rows: [...memory.evaluations].sort(sortNewestFirst) };
  }

  // Activities
  if (sql.startsWith('select * from activities where user_id = $1')) {
    return {
      rows: memory.activities.filter((a) => a.user_id === params[0]).sort(sortNewestFirst).slice(0, 20),
    };
  }
  if (sql.startsWith('select * from activities')) {
    return { rows: [...memory.activities].sort(sortNewestFirst).slice(0, 10) };
  }

  // Group By queries
  if (sql.startsWith('select advisor, count(*) as total_projects')) {
    const statsMap = new Map();
    memory.projects.forEach((p) => {
      if (!statsMap.has(p.advisor)) {
        statsMap.set(p.advisor, {
          advisor: p.advisor,
          total_projects: 0,
          projects_at_risk: 0,
          in_progress: 0,
        });
      }
      const s = statsMap.get(p.advisor);
      s.total_projects++;
      if (p.risk === 'Alto') s.projects_at_risk++;
      if (p.status === 'Em Andamento') s.in_progress++;
    });
    return {
      rows: Array.from(statsMap.values()).sort((a: any, b: any) => b.total_projects - a.total_projects),
    };
  }

  return { rows: [] };
}

function sortNewestFirst(a: DbRow, b: DbRow): number {
  return new Date(b.created_at || b.submission_date || 0).getTime() - new Date(a.created_at || a.submission_date || 0).getTime();
}
