"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
describe('Discipulado', () => {
    let token;
    let igrejaId;
    let congregacaoId;
    let membroId;
    let schemaUnico;
    let celulaId;
    beforeAll(async () => {
        schemaUnico = `igreja_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
        await prisma.church.deleteMany({ where: { schema: schemaUnico } });
        await new Promise(resolve => setTimeout(resolve, 100));
        const igreja = await prisma.church.create({
            data: {
                nome: 'Igreja Teste',
                email: `igreja${Date.now()}@teste.com`,
                schema: schemaUnico,
                password: 'TestPassword123!',
            },
        });
        igrejaId = igreja.id;
        const congregacao = await prisma.congregacao.create({
            data: {
                nome: 'Congregação Teste',
                churchId: igrejaId,
                endereco: 'Rua Teste, 123'
            }
        });
        congregacaoId = congregacao.id;
        const celula = await prisma.celula.create({
            data: {
                nome: 'Célula Teste',
                congregacaoId: congregacaoId
            }
        });
        celulaId = celula.id;
        const usuarioEmail = `aldairbarros${Date.now()}@eklesia.app.br`;
        await prisma.usuario.create({
            data: {
                nome: 'Usuário Teste',
                email: usuarioEmail,
                senha: 'Alsib@2025',
                perfil: 'ADMIN',
                congregacaoId: congregacaoId
            }
        });
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({ email: usuarioEmail, senha: 'Alsib@2025' });
        token = res.body.token;
        if (!congregacaoId) {
            throw new Error('congregacaoId não foi atribuído antes de criar o discipulador');
        }
        const discipulador = await prisma.member.create({
            data: {
                nome: 'Discipulador Teste',
                congregacaoId: congregacaoId
            }
        });
        membroId = discipulador.id;
        await prisma.member.create({
            data: {
                nome: 'Discipulando Teste',
                congregacaoId: congregacaoId,
                discipuladorId: membroId,
                celulaId: celulaId
            }
        });
    });
    it('deve listar discipulandos de um discipulador', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get(`/api/discipulado/discipulandos/${membroId}`)
            .set('Authorization', `Bearer ${token}`)
            .set('schema', schemaUnico);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    it('deve criar um discipulando', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/discipulado/discipulando')
            .set('Authorization', `Bearer ${token}`)
            .set('schema', schemaUnico)
            .send({
            nome: 'Novo Discipulando',
            congregacaoId: congregacaoId,
            discipuladorId: membroId,
            celulaId: celulaId
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.nome).toBe('Novo Discipulando');
    });
});
//# sourceMappingURL=discipulado.test.js.map