import { prisma } from '../core/prisma';
import bcrypt from 'bcrypt';
import { AppError } from '../utils/AppError';

export type UsuarioRole = 'PASTOR' | 'DIRIGENTE' | 'TESOUREIRO' | 'SECRETARIO';
const roles: UsuarioRole[] = ['PASTOR','DIRIGENTE','TESOUREIRO','SECRETARIO'];

interface CreateUsuarioInput { nome: string; email: string; senha: string; igrejaId?: number; role?: UsuarioRole }
interface UpdateUsuarioInput { nome: string; igrejaId?: number | null; role?: UsuarioRole }

export const UsuarioService = {
  async create(data: CreateUsuarioInput) {
    const { nome, email, senha, igrejaId, role } = data;
    if (!nome || !email || !senha) throw new AppError('nome, email, senha são obrigatórios');
    if (igrejaId) {
      const ig = await prisma.igreja.findUnique({ where: { id: igrejaId } });
      if (!ig) throw new AppError('igrejaId inválido');
    }
    const existing = await prisma.usuario.findUnique({ where: { email } });
    if (existing) throw new AppError('Email já cadastrado', 409);
    if (role && !roles.includes(role)) throw new AppError('role inválido');
    const senhaHash = await bcrypt.hash(senha, 10);
    return prisma.usuario.create({ data: { nome, email, senhaHash, igrejaId, role } });
  },
  async list() { return prisma.usuario.findMany({ orderBy: { id: 'asc' } }); },
  async get(id: number) {
    const u = await prisma.usuario.findUnique({ where: { id } });
    if (!u) throw new AppError('Não encontrado', 404);
    return u;
  },
  async update(id: number, data: UpdateUsuarioInput) {
    const { nome, igrejaId, role } = data;
    if (!nome) throw new AppError('nome obrigatório');
  const update: { nome: string; igrejaId?: number | null; role?: UsuarioRole } = { nome };
    if (igrejaId !== undefined) {
      if (igrejaId === null) update.igrejaId = null; else {
        const ig = await prisma.igreja.findUnique({ where: { id: igrejaId } });
        if (!ig) throw new AppError('igrejaId inválido');
        update.igrejaId = igrejaId;
      }
    }
    if (role !== undefined) {
      if (!roles.includes(role)) throw new AppError('role inválido');
      update.role = role;
    }
    try { return await prisma.usuario.update({ where: { id }, data: update }); }
    catch { throw new AppError('Não encontrado', 404); }
  },
  async remove(id: number) {
    try { await prisma.usuario.delete({ where: { id } }); } catch { throw new AppError('Não encontrado', 404); }
  }
};
