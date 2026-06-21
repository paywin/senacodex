import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/auth';
import type { JwtPayload } from '@/types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ message: 'Token inválido ou expirado' });
    return;
  }

  req.user = decoded;
  next();
}

/**
 * Middleware de autorização baseado em role
 * Verifica se o usuário tem uma das roles especificadas
 */
export function roleMiddleware(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        message: 'Acesso negado. Você não tem permissão para acessar este recurso.' 
      });
      return;
    }

    next();
  };
}

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
  });
}
