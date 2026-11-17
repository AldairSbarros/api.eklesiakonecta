import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

export type JwtPayload = {
  userId: number;
  email: string;
  role: string;
  igrejaId?: number;
};

export const JWT_SECRET = process.env.JWT_SECRET || 'mudar_para_um_valor_forte_em_producao';
export const JWT_EXPIRES_IN = '24h';

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  if (!token) throw new AppError('Token não fornecido', 401);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded.userId || !decoded.email) {
      throw new AppError('Token inválido: payload insuficiente', 401);
    }
    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expirado', 401);
    }
    throw new AppError('Token inválido', 401);
  }
}
