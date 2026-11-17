import bcrypt from 'bcrypt';
import { AppError } from '../utils/AppError';
import { signToken } from './jwt.service';
import { getPrisma } from '../core/prismaCache';

interface LoginInput {
  email: string;
  senha: string;
}

export interface LoginResult {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    role: string;
    igrejaId?: number;
  };
}

export const AuthService = {
  async login({ email, senha }: LoginInput, schema?: string): Promise<LoginResult> {
    if (!email || !senha) throw new AppError('email e senha são obrigatórios', 400);
    
    // Usar o prisma do schema informado, senão usar o global (public)
    const prismaClient = schema ? getPrisma(schema) : getPrisma('public');
    
    const usuario = await prismaClient.usuario.findUnique({ where: { email } });
    if (!usuario) throw new AppError('Credenciais inválidas', 401);
    
    const ok = await bcrypt.compare(senha, usuario.senhaHash);
    if (!ok) throw new AppError('Credenciais inválidas', 401);
    
    const token = signToken({
      userId: usuario.id,
      email: usuario.email,
      role: usuario.role,
      igrejaId: usuario.igrejaId ?? undefined
    });
    
    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        igrejaId: usuario.igrejaId
      }
    };
  }
};
