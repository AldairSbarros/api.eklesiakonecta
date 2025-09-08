"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // ajuste o caminho conforme necessário
const SCHEMA = 'igreja_1751327431755'; // Defina o valor apropriado para o seu caso de uso
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
it('deve cadastrar uma nova igreja', async () => {
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 1000000000)}`;
    const email = `igreja${uniqueSuffix}@teste.com`;
    const schemaNovo = `igreja_${uniqueSuffix}`;
    const res = await (0, supertest_1.default)(app_1.default)
        .post('/api/igrejas')
        .set('schema', 'public') // Use o schema global!
        .set('Authorization', `Bearer ${token}`)
        .send({
        nome: 'Igreja Teste',
        email,
        password: 'SenhaForte123', // Campo obrigatório!
        schema: schemaNovo, // Campo obrigatório!
        endereco: 'Rua Teste, 123'
    });
    expect(res.body).toHaveProperty('igreja');
    expect(res.body.igreja).toHaveProperty('id');
});
//# sourceMappingURL=newigreja.controller.spec.js.map