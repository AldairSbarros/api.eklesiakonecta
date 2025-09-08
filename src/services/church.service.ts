import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import bcrypt from "bcrypt";
import { logAuditoria } from "../utils/logger";

// Prisma global (schema público)
const prismaGlobal = new PrismaClient();

// Cria um novo schema no PostgreSQL
async function criarSchema(nomeSchema: string) {
  await prismaGlobal.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${nomeSchema}"`);
}

// Roda as migrations do Prisma no novo schema
function rodarMigrationsNoSchema(schema: string) {
  const dbUrl = process.env.DATABASE_URL!.replace(/schema=([a-zA-Z0-9_]+)/, `schema=${schema}`);
  console.log(`[MIGRATION] Rodando migrations para schema: ${schema}`);
  try {
    const output = execSync(`npx prisma migrate deploy`, {
      env: { ...process.env, DATABASE_URL: dbUrl },
      stdio: 'pipe'
    });
    console.log(`[MIGRATION] Saída:
${output.toString()}`);
  } catch (err: any) {
    console.error(`[MIGRATION] Erro ao rodar migrations para schema ${schema}:`, err.message, err.stdout?.toString(), err.stderr?.toString());
    throw new Error(`Erro ao rodar migrations para schema ${schema}: ${err.message}`);
  }
}

// Cria o usuário admin no novo schema
async function criarAdminNoSchema({ nome, email, senha, schema }: { nome: string, email: string, senha: string, schema: string }) {
  const { PrismaClient: PrismaTenant } = require("@prisma/client");
  const dbUrl = process.env.DATABASE_URL!.replace(/schema=([a-zA-Z0-9_]+)/, `schema=${schema}`);
  const prismaTenant = new PrismaTenant({
    datasources: {
      db: { url: dbUrl }
    }
  });
  await prismaTenant.usuario.create({
    data: {
      nome,
      email,
      senha,
      perfil: "ADMIN",
      ativo: true
    }
  });
  await prismaTenant.$disconnect();
}

// Função utilitária para validar campos obrigatórios
function validarCamposObrigatorios(data: { nome?: string; email?: string }) {
  const erros: string[] = [];
  if (!data.nome || data.nome.trim() === "") erros.push("Nome é obrigatório.");
  if (!data.email || data.email.trim() === "")
    erros.push("E-mail é obrigatório.");
  return erros;
}

// Criação de igreja multi-tenant por schema
export const createChurch = async (data: any) => {
  const erros = validarCamposObrigatorios(data);
  if (erros.length > 0) {
    throw new Error(erros.join(" "));
  }
  const senhaAdmin = data.senhaAdmin || data.password;
  if (!senhaAdmin || senhaAdmin.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }
  const senhaParaSalvar = await bcrypt.hash(senhaAdmin, 10);
  // Usa o schema fornecido (para testes/multi-tenant controlado) ou gera um novo
  const nomeSchema = data.schema && typeof data.schema === 'string' ? data.schema : `igreja_${Date.now()}`;

  try {
    await criarSchema(nomeSchema);
    rodarMigrationsNoSchema(nomeSchema);
    await criarAdminNoSchema({
      nome: data.nome,
      email: data.email,
      senha: senhaParaSalvar,
      schema: nomeSchema
    });
  } catch (error: any) {
    throw new Error("Erro ao criar schema ou rodar migrations: " + error.message);
  }

  let novaIgreja;
  try {
    // Cria no schema global
    novaIgreja = await prismaGlobal.church.create({
      data: {
        nome: data.nome,
        email: data.email,
        password: senhaParaSalvar,
        schema: nomeSchema,
        status: data.status || "ativa",
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("E-mail já cadastrado.");
    }
    throw new Error("Erro ao cadastrar igreja: " + error.message);
  }

  // Cria também no schema dinâmico para garantir integridade das FKs
  try {
    const prismaTenant = getPrismaTenant(nomeSchema);
    await prismaTenant.church.create({
      data: {
        id: novaIgreja.id, // mesmo id do global
        nome: novaIgreja.nome,
        email: novaIgreja.email,
        password: novaIgreja.password,
        schema: novaIgreja.schema,
        status: novaIgreja.status,
        createdAt: novaIgreja.createdAt,
        // outros campos opcionais podem ser copiados se necessário
      },
    });
    await prismaTenant.$disconnect();
  } catch (error: any) {
    // Se falhar aqui, remove do global para não deixar lixo
    await prismaGlobal.church.delete({ where: { id: novaIgreja.id } });
    throw new Error("Erro ao criar igreja no schema dinâmico: " + error.message);
  }

  logAuditoria("Cadastro de igreja", { nome: data.nome, email: data.email });
  return novaIgreja;
};

// Exemplo de função para obter PrismaClient do schema correto
export function getPrismaTenant(schema: string) {
  const { PrismaClient: PrismaTenant } = require("@prisma/client");
  const dbUrl = process.env.DATABASE_URL!.replace(/schema=([a-zA-Z0-9_]+)/, `schema=${schema}`);
  return new PrismaTenant({
    datasources: {
      db: { url: dbUrl }
    }
  });
}

// As funções listChurches, getChurch, updateChurch, deleteChurch continuam usando prismaGlobal
export const listChurches = async () => {
  try {
    return await prismaGlobal.church.findMany();
  } catch (error: any) {
    throw new Error("Erro ao listar igrejas: " + error.message);
  }
};

export const getChurch = async (id: number) => {
  try {
    const igreja = await prismaGlobal.church.findUnique({ where: { id } });
    if (!igreja) {
      throw new Error("Igreja não encontrada.");
    }
    return igreja;
  } catch (error: any) {
    throw new Error("Erro ao buscar igreja: " + error.message);
  }
};

export const updateChurch = async (id: number, data: any) => {
  const erros = validarCamposObrigatorios(data);
  if (erros.length > 0) {
    throw new Error(erros.join(" "));
  }
  let dadosParaAtualizar = { ...data };
  if (data.password) {
    if (data.password.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres.");
    }
    dadosParaAtualizar.password = await bcrypt.hash(data.password, 10);
  }

  try {
    const igreja = await prismaGlobal.church.update({
      where: { id },
      data: dadosParaAtualizar,
    });
    logAuditoria("Atualização de igreja", {
      id,
      camposAtualizados: Object.keys(dadosParaAtualizar),
    });
    return igreja;
  } catch (error: any) {
    if (error.code === "P2025") {
      throw new Error("Igreja não encontrada para atualização.");
    }
    if (error.code === "P2002") {
      throw new Error("E-mail já cadastrado.");
    }
    throw new Error("Erro ao atualizar igreja: " + error.message);
  }
};

export const deleteChurch = async (id: number) => {
  try {
    await prismaGlobal.church.delete({
      where: { id },
    });
    logAuditoria("Remoção de igreja", { id });
    return;
  } catch (error: any) {
    if (error.code === "P2025") {
      throw new Error("Igreja não encontrada para remoção.");
    }
    throw new Error("Erro ao remover igreja: " + error.message);
  }
};