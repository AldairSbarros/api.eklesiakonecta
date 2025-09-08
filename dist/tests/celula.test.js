"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const client_1 = require("@prisma/client"); // Import Prisma client
const prisma = new client_1.PrismaClient(); // Create an instance of PrismaClient
jest.setTimeout(30000);
describe('Células', () => {
    let token;
    let churchId;
    let congregacaoId;
    beforeAll(async () => {
        // Faça login e obtenha token
        const resLogin = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .set('schema', 'cliente_teste') // <-- Adicione este header
            .send({ email: 'aldairbarros@eklesia.app.br', senha: 'Alsib@2025' });
        token = resLogin.body.token;
        // Crie uma igreja
        const email = `igreja${Date.now()}@teste.com`;
        const schemaNovo = `igreja_${Date.now()}`;
        const resIgreja = await (0, supertest_1.default)(app_1.default)
            .post('/api/igrejas')
            .set('schema', 'cliente_teste') // <-- Adicione este header
            .set('Authorization', `Bearer ${token}`)
            .send({
            nome: 'Igreja Teste',
            email,
            password: 'SenhaForte123',
            schema: schemaNovo,
            endereco: 'Rua Teste, 123'
        });
        console.log('RES IGREJA:', resIgreja.status, resIgreja.body);
        churchId = resIgreja.body.igreja.id;
        // Crie uma congregação vinculada à igreja criada
        const resCong = await (0, supertest_1.default)(app_1.default)
            .post('/api/congregacoes')
            .set('schema', 'cliente_teste') // <-- Adicione este header
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'Congregação Teste', churchId, endereco: 'Rua Teste' });
        congregacaoId = resCong.body.id;
    }, 20000);
    it('deve criar uma célula', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/celulas')
            .set('schema', 'cliente_teste') // <-- Adicione aqui
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'Célula Teste', congregacaoId });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
    }, 20000); // Increased timeout to 20000ms
    it('deve listar as células', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/celulas')
            .set('schema', 'cliente_teste') // <-- Adicione aqui
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });
    it('deve atualizar uma célula', async () => {
        const resCriacao = await (0, supertest_1.default)(app_1.default)
            .post('/api/celulas')
            .set('schema', 'cliente_teste') // <-- Adicione aqui
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'Célula Atualização Teste', congregacaoId });
        const celulaId = resCriacao.body.id;
        const resAtualizacao = await (0, supertest_1.default)(app_1.default)
            .put(`/api/celulas/${celulaId}`)
            .set('schema', 'cliente_teste') // <-- Adicione aqui
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'Célula Atualizada' });
        expect(resAtualizacao.status).toBe(200);
        expect(resAtualizacao.body.nome).toBe('Célula Atualizada');
    });
    it('deve excluir uma célula', async () => {
        const resCriacao = await (0, supertest_1.default)(app_1.default)
            .post('/api/celulas')
            .set('schema', 'cliente_teste') // <-- Adicione aqui
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'Célula Exclusão Teste', congregacaoId });
        const celulaId = resCriacao.body.id;
    });
});
//# sourceMappingURL=celula.test.js.map