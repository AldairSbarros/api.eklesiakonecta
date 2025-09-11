"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
let SCHEMA;
let token;
describe('Update User Controller', () => {
    beforeAll(async () => {
        // Cria uma igreja e obtém o schema dinâmico
        const emailIgreja = `igreja_updateuser_${Date.now()}@eklesia.app.br`;
        const churchRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/igrejas')
            .send({
            nome: 'Igreja Teste UpdateUser',
            email: emailIgreja,
            senhaAdmin: 'Alsib@2025',
            endereco: 'Rua dos Usuários, 123',
        });
        console.log('CHURCH RESPONSE:', churchRes.status, churchRes.body);
        expect(churchRes.status).toBe(201);
        SCHEMA = churchRes.body.igreja?.schema;
        // Faz login como admin da igreja criada
        const loginRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .set('schema', SCHEMA)
            .send({ email: emailIgreja, senha: 'Alsib@2025' });
        console.log('LOGIN RESPONSE:', loginRes.status, loginRes.body);
        expect(loginRes.status).toBe(200);
        token = loginRes.body.token;
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
            senha: 'Alsib@2025',
            perfil: 'ADMIN',
        });
        console.log('CADASTRO USUÁRIO RESPONSE:', resCadastro.status, resCadastro.body);
        expect(resCadastro.status).toBe(201);
        const userId = resCadastro.body.id;
        const resUpdate = await (0, supertest_1.default)(app_1.default)
            .put(`/api/usuarios/${userId}`)
            .set('schema', SCHEMA)
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'Usuário Atualizado' });
        expect(resUpdate.status).toBe(200);
        expect(resUpdate.body.nome).toBe('Usuário Atualizado');
    });
});
//# sourceMappingURL=updateUser.controller.spec.js.map