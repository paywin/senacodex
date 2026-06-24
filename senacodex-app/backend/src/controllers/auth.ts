import { Request, Response } from 'express';
import { generateToken } from '@/utils/auth';
import {
  getUserByEmail,
  createUser,
  verifyUserPassword,
  getUserById,
} from '@/services';

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email e senha são obrigatórios' });
      return;
    }

    const user = await getUserByEmail(email);

    if (!user) {
      res.status(401).json({ message: 'Email ou senha inválidos' });
      return;
    }

    const passwordValid = await verifyUserPassword(user, password);

    if (!passwordValid) {
      res.status(401).json({ message: 'Email ou senha inválidos' });
      return;
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      accessToken: token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
      return;
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      res.status(400).json({ message: 'Email já cadastrado' });
      return;
    }

    const user = await createUser(name, email, password, role || 'student');
    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      accessToken: token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.json({ message: 'Logout realizado com sucesso' });
}

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: 'Não autenticado' });
      return;
    }

    const user = await getUserById(req.user.id);

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar perfil' });
  }
}
