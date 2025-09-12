import { Request, Response } from 'express';
import * as usuarioService from '../services/usuario.service';
import bcrypt from 'bcryptjs';
import { registrarLog } from '../services/registrarLogs.service';

export async function listarUsuarios(schema: string) {
  const prisma = require('../utils/prismaDynamic').getPrisma(schema);
  return prisma.usuario.findMany();
}

// Listar usuários
export const list = async (req: Request, res: Response) => {
  try {
    const schema = req.headers['schema'] as string;
    if (!schema) return res.status(400).json({ error: 'Schema não informado no header.' });

    const usuarios = await listarUsuarios(schema);
    res.json(usuarios);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Criar usuário
export const create = async (req: Request, res: Response) => {
  try {
    const schema = req.headers['schema'] as string;
    if (!schema) return res.status(400).json({ error: 'Schema não informado no header.' });

    let { nome, email, senha, perfil, congregacaoId, token } = req.body;
    const mapa: Record<string, string> = {
      'admin': 'ADMIN',
      'ADMIN': 'ADMIN',
      'dirigente': 'Dirigente',
      'Dirigente': 'Dirigente',
      'tesoureiro': 'Tesoureiro',
      'Tesoureiro': 'Tesoureiro',
      'secretario': 'Secretario',
      'Secretario': 'Secretario',
      'pastor': 'Pastor',
      'Pastor': 'Pastor',
      'superuser': 'SUPERUSER',
      'SUPERUSER': 'SUPERUSER'
    };
    perfil = mapa[perfil] || perfil; // mantém se já veio correto

    // Verificação de token para perfis especiais
  if (perfil === 'SUPERUSER' && token !== process.env.TOKEN_SUPERUSER) {
      return res.status(403).json({ error: 'Token de autorização inválido para superuser.' });
    }
  // Para criar ADMIN, exige que o usuário autenticado seja ADMIN
  if (perfil === 'ADMIN' && req.user?.perfil !== 'ADMIN') {
      return res.status(403).json({ error: 'Apenas admin autenticado pode criar outro admin.' });
    }
    // Para criar Dirigente, exige que o usuário autenticado seja Dirigente
  if (perfil === 'Dirigente' && req.user?.perfil !== 'Dirigente') {
      return res.status(403).json({ error: 'Apenas dirigente autenticado pode criar outro dirigente.' });
    }
    // Para criar Tesoureiro, exige que o usuário autenticado seja Tesoureiro
  if (perfil === 'Tesoureiro' && req.user?.perfil !== 'Tesoureiro') {
      return res.status(403).json({ error: 'Apenas tesoureiro autenticado pode criar outro tesoureiro.' });
    }
    // Para criar Secretário, exige que o usuário autenticado seja Secretário
  if (perfil === 'Secretario' && req.user?.perfil !== 'Secretario') {
      return res.status(403).json({ error: 'Apenas secretário autenticado pode criar outro secretário.' });
    }
    // >>>>>>>>>>>> HASH DA SENHA <<<<<<<<<<<<
    const senhaHash = await bcrypt.hash(senha, 10);

    

    const usuario = await usuarioService.criarUsuario(schema, { nome, email, senha: senhaHash, perfil, congregacaoId });
    res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const adminOnly = async (req: Request, res: Response) => {
  res.json({ message: "Acesso permitido apenas para admin.", user: req.user });
};

export const dirigenteOuTesoureiro = async (req: Request, res: Response) => {
  res.json({ message: "Acesso permitido para dirigente ou tesoureiro.", user: req.user });
};

// Atualizar usuário
export const update = async (req: Request, res: Response) => {
  try {
    const schema = req.headers['schema'] as string;
    if (!schema) return res.status(400).json({ error: 'Schema não informado no header.' });

    const { id } = req.params;
    const { nome, email, perfil, congregacaoId, ativo } = req.body;
    const usuario = await usuarioService.atualizarUsuario(schema, Number(id), { nome, email, perfil, congregacaoId, ativo });

    await registrarLog(
      schema,
      {
        usuarioId: (req as any).user.id,
        acao: 'atualizacao_usuario',
        detalhes: `Atualizou usuário ${id}`,
        ip: req.ip
      }
    );

    res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil, ativo: usuario.ativo });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar usuário
export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const schema = req.headers['schema'] as string;
    if (!schema) return res.status(400).json({ error: 'Schema não informado no header.' });

    const { id } = req.params;

    await registrarLog(
      schema,
      {
        usuarioId: (req as any).user.id,
        acao: 'remocao_usuario',
        detalhes: `Removeu usuário ${id}`,
        ip: req.ip
      }
    );

    res.json({ message: 'Usuário removido com sucesso' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Obter usuário por ID
export const get = async (req: Request, res: Response) => {
  try {
    const schema = req.headers['schema'] as string;
    if (!schema) return res.status(400).json({ error: 'Schema não informado no header.' });

    const { id } = req.params;
    const usuario = await usuarioService.obterUsuario(schema, Number(id));
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado." });
    res.json(usuario);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Redefinir senha (admin) - você deve implementar no service se necessário
export const resetPassword = async (req: Request, res: Response) => {
  res.status(501).json({ error: 'Funcionalidade não implementada no service.' });
};

// Trocar a própria senha (direto no Prisma, pois depende do usuário logado)
export const changePassword = async (req: Request, res: Response) => {
  try {
    const schema = req.headers['schema'] as string;
    if (!schema) return res.status(400).json({ error: 'Schema não informado no header.' });

    const { senhaAtual, novaSenha } = req.body;
    const usuarioId = (req as any).user.id;

    const prisma = require('../utils/prismaDynamic').getPrisma(schema);
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado." });

    const valid = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!valid) return res.status(401).json({ error: "Senha atual inválida." });

    const hashed = await bcrypt.hash(novaSenha, 10);
    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { senha: hashed }
    });

    res.json({ message: "Senha alterada com sucesso." });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const listDizimosCongregacao = async (req: Request, res: Response) => {
  try {
    const schema = req.headers['schema'] as string;
    if (!schema) return res.status(400).json({ error: 'Schema não informado no header.' });

  const perfil = (req as any).user.perfil;
    let congregacaoId: number | undefined = undefined;

    // Só admin pode ver todos, os outros só a própria congregação
  if (perfil !== 'ADMIN') {
      congregacaoId = (req as any).user.congregacaoId;
      if (!congregacaoId) return res.status(400).json({ error: 'Congregação não encontrada para o usuário.' });
    }

    const dizimos = await usuarioService.listarDizimosPorCongregacao(schema, congregacaoId);
    res.json(dizimos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  // Sua lógica de login aqui
  res.json({ message: "Login realizado com sucesso" });
};

export const uploadComprovante = async (req: Request, res: Response) => {
  // Sua lógica de upload aqui
  res.json({ message: "Comprovante enviado com sucesso" });
};