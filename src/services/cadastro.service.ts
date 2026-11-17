import { PrismaClient } from '@prisma/client';
import { prisma } from '../core/prisma';
import bcrypt from 'bcrypt';
import { exec } from 'child_process';
import path from 'path';
import { AppError } from '../utils/AppError';

interface CadastroInicialInput {
  nomeIgreja: string;
  nomePastor: string;
  emailPastor: string;
  senhaPastor: string;
}

export const CadastroService = {
  async cadastroInicial({
    nomeIgreja,
    nomePastor,
    emailPastor,
    senhaPastor,
  }: CadastroInicialInput) {
    if (!nomeIgreja || !nomePastor || !emailPastor || !senhaPastor) {
      throw new AppError('Todos os campos são obrigatórios', 400);
    }

    // 1. Verificar se igreja já existe no schema public
    const igrejaExists = await (prisma as any).igreja.findUnique({
      where: { nome: nomeIgreja },
    });
    if (igrejaExists) throw new AppError('Igreja com este nome já existe', 409);

    // 2. Criar igreja no schema public
    const igreja = await (prisma as any).igreja.create({
      data: { nome: nomeIgreja },
    });

    // 3. Gerar nome do schema baseado no nome da igreja + id
    const schemaName = `${nomeIgreja
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')}_${igreja.id}`;

    // 4. Criar schema no banco e aplicar migrações
    const schemaPrismaPath = path.resolve(
      process.cwd(),
      'prisma',
      'schema.prisma'
    );
    const dbUrl = process.env.DATABASE_URL!;
    const tenantUrl = `${dbUrl}&schema=${schemaName}`;

    await new Promise<void>((resolve, reject) => {
      const cmd = `DATABASE_URL="${tenantUrl}" npx prisma db push --schema "${schemaPrismaPath}" --skip-generate`;
      exec(cmd, { shell: '/bin/bash' }, (err, _stdout, stderr) => {
        if (err) {
          // Não desfazer igreja se falhar? Melhor logar e continuar.
          console.error('[cadastro] Falha ao aplicar schema:', stderr?.toString());
        }
        resolve();
      });
    });

    // 5. Criar usuário PASTOR no schema do tenant
    const prismaTenant = new PrismaClient({
      datasources: {
        db: { url: tenantUrl },
      },
    });

    const senhaHash = await bcrypt.hash(senhaPastor, 10);

    const usuario = await prismaTenant.usuario.create({
      data: {
        nome: nomePastor,
        email: emailPastor,
        senhaHash,
        role: 'PASTOR',
      },
    });

    await prismaTenant.$disconnect();

    return {
      igrejaId: igreja.id,
      schema: schemaName,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    };
  },
};
