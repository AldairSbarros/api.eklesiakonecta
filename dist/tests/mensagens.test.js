"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('Mensagens API', () => {
    jest.setTimeout(30000); // Increase timeout to 30 seconds
    let token;
    let celulaId;
    let schemaCliente;
    let churchId;
    let congregacaoId;
    beforeAll(async () => {
        // Login no schema global com usuário correto
        const loginRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .set('schema', 'public')
            .send({ email: 'aldairbarros@eklesia.app.br', senha: 'Alsib@2025' });
        console.log('LOGIN RESPONSE:', loginRes.status, loginRes.body);
        expect(loginRes.body.token).toBeDefined();
        token = loginRes.body.token;
        // Crie uma igreja no schema global
        const email = `igreja${Date.now()}@teste.com`;
        schemaCliente = `igreja_${Date.now()}`;
        const resIgreja = await (0, supertest_1.default)(app_1.default)
            .post('/api/igrejas')
            .set('schema', 'public')
            .set('Authorization', `Bearer ${token}`)
            .send({
            nome: 'Igreja Teste',
            email,
            password: 'SenhaForte123',
            schema: schemaCliente,
            endereco: 'Rua Teste, 123'
        });
        console.log('RES IGREJA:', resIgreja.status, resIgreja.body);
        expect(resIgreja.body.igreja).toBeDefined();
        churchId = resIgreja.body.igreja.id;
        // Crie uma congregação no novo schema
        const resCong = await (0, supertest_1.default)(app_1.default)
            .post('/api/congregacoes')
            .set('schema', schemaCliente)
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'Congregação Teste', churchId, endereco: 'Rua Teste' });
        expect(resCong.body.id).toBeDefined();
        congregacaoId = resCong.body.id;
        // Crie uma célula no novo schema
        const resCelula = await (0, supertest_1.default)(app_1.default)
            .post('/api/celulas')
            .set('schema', schemaCliente)
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'Célula Mensagem Teste', congregacaoId });
        expect(resCelula.body.id).toBeDefined();
        celulaId = resCelula.body.id;
    });
    it('deve enviar mensagem interna para célula', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/mensagens-celula')
            .set('schema', schemaCliente)
            .set('Authorization', `Bearer ${token}`)
            .send({ titulo: 'Aviso', conteudo: 'Reunião amanhã!' }); // Remova celulaId!
        console.log('STATUS RECEBIDO:', res.status);
        console.log('RES BODY:', res.body);
        expect(res.status === 200 || res.status === 201).toBe(true);
        expect(res.body).toHaveProperty('id');
    });
});
//# sourceMappingURL=mensagens.test.js.map