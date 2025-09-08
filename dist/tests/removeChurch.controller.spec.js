"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // ajuste o caminho conforme necessário para importar seu app Express
// Defina o valor de SCHEMA conforme necessário para seu ambiente de testes
const SCHEMA = 'igreja_1751327431755';
let token;
beforeAll(async () => {
    const res = await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/login')
        .set('schema', SCHEMA)
        .send({ email: 'aldairbarros@eklesia.app.br', senha: 'Alsib@2025' });
    token = res.body.token;
});
it('deve remover uma igreja', async () => {
    const email = `igreja${Date.now()}@teste.com`;
    const resCadastro = await (0, supertest_1.default)(app_1.default)
        .post('/api/igrejas')
        .set('schema', SCHEMA)
        .set('Authorization', `Bearer ${token}`)
        .send({
        nome: 'Igreja Remove',
        email,
        endereco: 'Rua Remover'
    });
    const igrejaId = resCadastro.body.igreja.id; // <-- Corrigido!
    const newSchema = resCadastro.body.igreja.schema;
    const resDelete = await (0, supertest_1.default)(app_1.default)
        .delete(`/api/igrejas/${igrejaId}`)
        .set('schema', newSchema) // <-- Use o schema da igreja criada
        .set('Authorization', `Bearer ${token}`);
    expect(resDelete.status).toBe(200);
    expect(resDelete.body.message).toMatch(/removida com sucesso/i);
});
//# sourceMappingURL=removeChurch.controller.spec.js.map