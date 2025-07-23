"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // ajuste o caminho conforme necessário
const SCHEMA = 'igreja_1751327431755'; // Defina o valor apropriado para o schema
let token;
beforeAll(async () => {
    const res = await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/login')
        .set('schema', SCHEMA)
        .send({
        email: 'aldairbarros@eklesia.app.br',
        senha: 'Alsib@2025'
    });
    token = res.body.token;
});
it('deve listar igrejas', async () => {
    const res = await (0, supertest_1.default)(app_1.default)
        .get('/api/igrejas')
        .set('schema', SCHEMA)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});
//# sourceMappingURL=listChurc.controller.spec.js.map