"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// church.controller.spec.ts
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const SCHEMA = 'igreja_1751327431755';
let token;
beforeAll(async () => {
    // Faça login e pegue o token de admin
    const res = await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/login')
        .set('schema', SCHEMA)
        .send({ email: 'aldairbarros@eklesia.app.br', senha: 'Alsib@2025' });
    token = res.body.token;
});
describe('Church Controller', () => {
    it('deve criar uma igreja', async () => {
        jest.setTimeout(30000);
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/igrejas')
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'Igreja Teste', email: `igreja${Date.now()}@teste.com`, senhaAdmin: '123456', endereco: 'Rua Teste, 123' });
        expect(res.status).toBe(201);
        expect(res.body.igreja).toHaveProperty('id');
    }, 30000);
    it('deve listar igrejas', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/igrejas')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
//# sourceMappingURL=church.controller.spec.js.map