"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
let SCHEMA;
let token;
describe('List User Controller', () => {
    beforeAll(async () => {
        // Cria uma igreja e obtém o schema dinâmico
        const emailIgreja = `igreja_listuser_${Date.now()}@eklesia.app.br`;
        const churchRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/igrejas')
            .send({
            nome: 'Igreja Teste ListUser',
            email: emailIgreja,
            senhaAdmin: 'Alsib@2025',
            endereco: 'Rua dos Usuários, 123',
        });
        expect(churchRes.status).toBe(201);
        SCHEMA = churchRes.body.igreja?.schema;
        // Faz login como admin da igreja criada
        const loginRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .set('schema', SCHEMA)
            .send({ email: emailIgreja, senha: 'Alsib@2025' });
        expect(loginRes.status).toBe(200);
        token = loginRes.body.token;
    });
    it('deve listar usuários', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/usuarios')
            .set('schema', SCHEMA)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
//# sourceMappingURL=listUser.controller.spec.js.map