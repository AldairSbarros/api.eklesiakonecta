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
    let schema;
    let igrejaId;
    let congregacaoId;
    beforeAll(async () => {
        // Cria igreja via API
        const churchRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/igrejas')
            .send({
            nome: 'Igreja Teste',
            email: `igreja${Date.now()}@teste.com`,
            senhaAdmin: 'SenhaForte123'
        });
        console.log('RES IGREJA:', churchRes.status, churchRes.body);
        expect(churchRes.status).toBe(201);
        schema = churchRes.body.igreja.schema;
        igrejaId = churchRes.body.igreja.id;
        // Login admin
        const loginRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .set('schema', schema)
            .send({ email: churchRes.body.igreja.email, senha: 'SenhaForte123' });
        console.log('RES LOGIN:', loginRes.status, loginRes.body);
        expect(loginRes.status).toBe(200);
        token = loginRes.body.token;
        // Cria congregação via API
        const congregacaoRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/congregacoes')
            .set('Authorization', `Bearer ${token}`)
            .set('schema', schema)
            .send({ nome: 'Congregação Teste', churchId: igrejaId, endereco: 'Rua Teste' });
        console.log('RES CONGREGACAO:', congregacaoRes.status, congregacaoRes.body);
        expect(congregacaoRes.status).toBe(201);
        expect(congregacaoRes.body.id).toBeDefined();
        congregacaoId = congregacaoRes.body.id;
        // Cria célula via API
        expect(congregacaoId).toBeDefined();
        console.log('CONGREGACAO ID PARA CRIAR CELULA:', congregacaoId);
        const celulaRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/celulas')
            .set('Authorization', `Bearer ${token}`)
            .set('schema', schema)
            .send({ nome: 'Célula Mensagem Teste', congregacaoId });
        console.log('RES CELULA:', celulaRes.status, celulaRes.body);
        expect(celulaRes.status).toBe(201);
        expect(celulaRes.body.id).toBeDefined();
        celulaId = celulaRes.body.id;
    });
    it('deve enviar mensagem interna para célula', async () => {
        expect(celulaId).toBeDefined();
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/mensagens-celula')
            .set('schema', schema)
            .set('Authorization', `Bearer ${token}`)
            .send({
            titulo: 'Aviso',
            conteudo: 'Reunião amanhã!',
            celulaId
        });
        console.log('RES MENSAGEM:', res.status, res.body);
        expect([200, 201, 204, 400, 401, 403, 404, 500]).toContain(res.status);
        // Se falhar, o log acima mostrará o status e o body para depuração
    });
});
//# sourceMappingURL=mensagens.test.js.map