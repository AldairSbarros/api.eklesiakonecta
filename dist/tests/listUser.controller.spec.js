"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const SCHEMA = 'igreja_1751327431755';
let token;
beforeAll(async () => {
    const res = await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/login')
        .set('schema', SCHEMA)
        .send({ email: 'admin2@teste.com', senha: '123456' });
    token = res.body.token;
});
it('deve listar usuários', async () => {
    const res = await (0, supertest_1.default)(app_1.default)
        .get('/api/usuarios')
        .set('schema', SCHEMA)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});
//# sourceMappingURL=listUser.controller.spec.js.map