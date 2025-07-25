"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cadastroInicial = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaDynamic_1 = require("../utils/prismaDynamic");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { exec } = require("child_process");
const cadastroInicial = async (req, res) => {
    try {
        const { nomeIgreja, nomePastor, emailPastor, senhaPastor, } = req.body;
        // Validação básica
        if (!nomeIgreja || !nomePastor || !emailPastor || !senhaPastor) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios",
            });
        }
        // Criar schema único baseado no nome da igreja
        const timestamp = Date.now();
        const nomeIgrejaSafe = nomeIgreja
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_")
            .substring(0, 20);
        const schemaName = `${nomeIgrejaSafe}_${timestamp}`;
        // 1. Salvar no schema público (controle global)
        const prismaPublic = (0, prismaDynamic_1.getPrisma)("public");
        // Cria o schema no banco, se não existir ainda
        await prismaPublic.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
        // Executa o db push/migrate para criar as tabelas no novo schema
        try {
            // Corrigido para usar a porta 5433 igual ao .env
            const dbUrl = `postgresql://aldai:2025@localhost:5433/eklesiakonecta?schema=${schemaName}`;
            const isWindows = process.platform === "win32";
            const cmd = isWindows
                ? `set DATABASE_URL=${dbUrl} && npx prisma db push --schema=prisma/schema.prisma`
                : `DATABASE_URL=\"${dbUrl}\" npx prisma db push --schema=prisma/schema.prisma`;
            await new Promise((resolve, reject) => {
                exec(cmd, { shell: true }, (error, stdout, stderr) => {
                    if (error) {
                        console.error("Erro ao criar tabelas do Prisma:", stderr || error);
                        reject(error);
                    }
                    else {
                        console.log("Prisma db push output:", stdout);
                        resolve(stdout);
                    }
                });
            });
        }
        catch (err) {
            return res.status(500).json({ error: "Erro ao criar tabelas do sistema. Tente novamente." });
        }
        // Verifica se o email já existe no schema público
        const emailExiste = await prismaPublic.church.findFirst({
            where: { email: emailPastor },
        });
        if (emailExiste) {
            await prismaPublic.$disconnect();
            return res.status(400).json({
                error: "Este email já está cadastrado",
            });
        }
        // Hash da senha
        const senhaHash = await bcrypt_1.default.hash(senhaPastor, 10);
        // Salvar igreja no controle global (schema public)
        await prismaPublic.church.create({
            data: {
                nome: nomeIgreja,
                email: emailPastor,
                password: senhaHash,
                schema: schemaName,
            },
        });
        await prismaPublic.$disconnect();
        // 2. Criar estrutura no schema específico da igreja
        const prismaIgreja = (0, prismaDynamic_1.getPrisma)(schemaName);
        // Criar pastor principal no schema da igreja
        const pastor = await prismaIgreja.pastor.create({
            data: {
                nome: nomePastor,
                email: emailPastor,
                telefone: null, // ou algum valor padrão
            },
        });
        // Criar usuário admin no schema da igreja
        const usuario = await prismaIgreja.usuario.create({
            data: {
                nome: nomePastor,
                email: emailPastor,
                senha: senhaHash,
                perfil: "ADMIN",
                ativo: true,
            },
        });
        // Criar dados iniciais da igreja
        const igreja = await prismaIgreja.church.create({
            data: {
                nome: nomeIgreja,
                email: emailPastor,
                password: senhaHash,
                pastorPrincipal: {
                    connect: { id: pastor.id },
                },
                schema: schemaName,
            },
        });
        await prismaIgreja.$disconnect();
        // Criar arquivo de flag indicando que sistema foi configurado
        const configFile = path_1.default.join(process.cwd(), "sistema_configurado.flag");
        const configData = {
            configurado: true,
            dataConfiguracao: new Date().toISOString(),
            primeiraIgreja: {
                nome: nomeIgreja,
                schema: schemaName,
                email: emailPastor,
            },
        };
        fs_1.default.writeFileSync(configFile, JSON.stringify(configData, null, 2));
        // Retornar dados para frontend salvar schema e token para login
        return res.status(201).json({
            success: true,
            message: "Cadastro inicial realizado com sucesso!",
            igreja: {
                nome: igreja.nome,
                schema: schemaName,
            },
            pastor: {
                nome: pastor.nome,
                email: pastor.email,
            },
        });
    }
    catch (error) {
        console.error("Erro ao criar igreja:", error);
        return res.status(500).json({
            error: "Erro ao realizar cadastro",
        });
    }
};
exports.cadastroInicial = cadastroInicial;
//# sourceMappingURL=cadastroInicial.controller.js.map