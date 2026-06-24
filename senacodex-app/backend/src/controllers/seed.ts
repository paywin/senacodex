import { Request, Response } from 'express';
import { createUser } from '@/services';

export async function seedTestUsers(_req: Request, res: Response): Promise<void> {
  try {
    // Apenas em desenvolvimento
    if (process.env.NODE_ENV === 'production') {
      res.status(403).json({ message: 'Seed não disponível em produção' });
      return;
    }

    const testUsers = [
      {
        name: 'João Silva',
        email: 'aluno@senac.com.br',
        password: 'Aluno@123',
        role: 'student',
      },
      {
        name: 'Maria Santos',
        email: 'professor@senac.com.br',
        password: 'Professor@123',
        role: 'teacher',
      },
      {
        name: 'Carlos Oliveira',
        email: 'coordenador@senac.com.br',
        password: 'Coordenador@123',
        role: 'coordinator',
      },
      {
        name: 'Admin Demo',
        email: 'admin@example.com',
        password: 'Admin123',
        role: 'coordinator',
      },
      {
        name: 'User Demo',
        email: 'user@example.com',
        password: 'User123',
        role: 'student',
      },
    ];

    const createdUsers = [];

    for (const testUser of testUsers) {
      try {
        const user = await createUser(
          testUser.name,
          testUser.email,
          testUser.password,
          testUser.role as 'student' | 'teacher' | 'coordinator',
        );
        createdUsers.push({
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } catch (err: any) {
        // Usuário já existe, ignorar
        if (err.message.includes('duplicate') || err.message.includes('já existe')) {
          createdUsers.push({
            name: testUser.name,
            email: testUser.email,
            role: testUser.role,
            message: 'Usuário já existia',
          });
        } else {
          throw err;
        }
      }
    }

    res.json({
      message: 'Usuários de teste criados/verificados com sucesso',
      users: createdUsers,
    });
  } catch (error) {
    console.error('Erro ao fazer seed:', error);
    res.status(500).json({ message: 'Erro ao fazer seed dos usuários de teste' });
  }
}
