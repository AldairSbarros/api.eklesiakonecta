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
it('deve atualizar um usuário', async () => {
    const email = `update${Date.now()}@teste.com`;
    const resCadastro = await (0, supertest_1.default)(app_1.default)
        .post('/api/usuarios')
        .set('schema', SCHEMA)
        .set('Authorization', `Bearer ${token}`)
        .send({
        nome: 'Usuário Update',
        email,
        senha: '123456',
        perfil: 'ADMIN',
        token: process.env.TOKEN_ADMIN
    });
    const userId = resCadastro.body.id;
    const resUpdate = await (0, supertest_1.default)(app_1.default)
        .put(`/api/usuarios/${userId}`)
        .set('schema', SCHEMA)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Usuário Atualizado' });
    expect(resUpdate.status).toBe(200);
    expect(resUpdate.body.nome).toBe('Usuário Atualizado');
});
//# sourceMappingURL=updateUser.controller.spec.js.map