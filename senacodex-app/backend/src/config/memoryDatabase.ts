type DbRow = Record<string, any>;

const memory = {
  users: [] as DbRow[],
  projects: [] as DbRow[],
  activities: [] as DbRow[],
};

export function seedMemoryDatabase(): void {
  if (memory.projects.length > 0) {
    return;
  }

  const now = new Date();
  memory.projects.push({
    id: crypto.randomUUID(),
    name: 'Projeto Integrador Demo',
    description: 'Projeto temporario criado no modo desenvolvimento sem PostgreSQL.',
    class: 'Turma A',
    advisor: 'Professor Demo',
    status: 'Em Andamento',
    progress: 35,
    risk: 'Baixo',
    students: JSON.stringify([]),
    team_members: JSON.stringify([]),
    last_update: now,
    created_at: now,
    updated_at: now,
  });

  memory.activities.push({
    id: crypto.randomUUID(),
    user_id: crypto.randomUUID(),
    icon: 'fas fa-info-circle',
    text: 'Backend iniciado em modo desenvolvimento sem PostgreSQL',
    time: 'agora',
    type: 'update',
    created_at: now,
  });
}

export async function memoryQuery(text: string, params: any[] = []): Promise<{ rows: DbRow[] }> {
  const sql = text.trim().replace(/\s+/g, ' ').toLowerCase();

  if (sql.startsWith('select * from users where email')) {
    return { rows: memory.users.filter((user) => user.email === params[0]) };
  }

  if (sql.startsWith('select * from users where id')) {
    return { rows: memory.users.filter((user) => user.id === params[0]) };
  }

  if (sql.startsWith('insert into users')) {
    const now = new Date();
    const user = {
      id: crypto.randomUUID(),
      name: params[0],
      email: params[1],
      password: params[2],
      role: params[3],
      created_at: now,
      updated_at: now,
    };
    memory.users.push(user);
    return { rows: [user] };
  }

  if (sql.startsWith('select * from projects where id')) {
    return { rows: memory.projects.filter((project) => project.id === params[0]) };
  }

  if (sql.startsWith('select * from projects where risk')) {
    return {
      rows: memory.projects
        .filter((project) => ['Alto', 'Medio', 'Médio'].includes(project.risk))
        .sort(sortNewestFirst),
    };
  }

  if (sql.startsWith('select * from projects order by created_at desc')) {
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
      status: params[4],
      progress: params[5],
      risk: params[6],
      students: params[7],
      team_members: params[8],
      last_update: now,
      created_at: now,
      updated_at: now,
    };
    memory.projects.push(project);
    return { rows: [project] };
  }

  if (sql.startsWith('select * from activities order by created_at desc')) {
    return { rows: [...memory.activities].sort(sortNewestFirst).slice(0, 10) };
  }

  return { rows: [] };
}

function sortNewestFirst(a: DbRow, b: DbRow): number {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}
