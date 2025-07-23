"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const SCHEMA = 'igreja_1751327431755';
let token;
beforeAll(async () => {
    // Faça login como admin para obter o token
    const res = await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/login')
        .set('schema', SCHEMA)
        .send({ email: 'aldairbarros@eklesia.app.br', senha: 'Alsib@2025' });
    token = res.body.token;
});
describe('Usuário Controller', () => {
    it('deve cadastrar um novo usuário', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/usuarios')
            .set('schema', SCHEMA)
            .set('Authorization', `Bearer ${token}`)
            .send({
            nome: 'Aldair Barros',
            email: `aldairbarros${Date.now()}@eklesia.app.br`,
            senha: 'Alsib@2025',
            perfil: 'ADMIN',
            token: process.env.TOKEN_ADMIN // <-- Adicione isso!
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
    });
    it('deve listar usuários', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/usuarios')
            .set('schema', SCHEMA)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    it('deve autenticar um usuário e retornar token', async () => {
        const email = `aldairbarros${Date.now()}@ekelsia.app.br`;
        // Cadastra o usuário
        const resCadastro = await (0, supertest_1.default)(app_1.default)
            .post('/api/usuarios')
            .set('schema', SCHEMA)
            .set('Authorization', `Bearer ${token}`)
            .send({
            nome: 'Aldair Barros',
            email,
            senha: 'Alsib@2025',
            perfil: 'ADMIN',
            token: process.env.TOKEN_ADMIN // <-- Adicione aqui!
        });
        console.log('Cadastro:', resCadastro.status, resCadastro.body);
        // Faz login
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .set('schema', SCHEMA)
            .send({ email, senha: 'Alsib@2025' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});
//# sourceMappingURL=usuario.controller.spec.js.map