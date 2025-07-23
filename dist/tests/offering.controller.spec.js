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
        .send({
        email: 'aldairbarros@eklesia.app.br',
        senha: 'Alsib@2025', // Use "password" if your backend expects it
    });
    token = res.body.token;
});
it.only('should create a tithe', async () => {
    const resChurch = await (0, supertest_1.default)(app_1.default)
        .post('/api/igrejas')
        .set('schema', 'public')
        .set('Authorization', `Bearer ${token}`)
        .send({
        nome: 'Igreja Teste',
        email: `igreja${Date.now()}@teste.com`,
        password: 'SenhaForte123',
        schema: `igreja_${Date.now()}`,
        endereco: 'Rua Teste, 123'
    });
    console.log('CHURCH RESPONSE:', resChurch.status, resChurch.body);
    const churchId = resChurch.body.igreja.id;
    const newSchema = resChurch.body.igreja.schema;
    console.log('churchId:', churchId);
    console.log('newSchema:', newSchema);
    const resCong = await (0, supertest_1.default)(app_1.default)
        .post('/api/congregacoes')
        .set('schema', newSchema)
        .set('Authorization', `Bearer ${token}`)
        .send({
        nome: 'Congregação Teste',
        churchId: churchId,
        endereco: 'Rua da Congregação, 456'
    });
    console.log('CONG RESPONSE:', resCong.status, resCong.body);
    const congregacaoId = resCong.body.id;
    console.log('CONG ID:', congregacaoId);
    const resMember = await (0, supertest_1.default)(app_1.default)
        .post('/api/membros')
        .set('schema', newSchema)
        .set('Authorization', `Bearer ${token}`)
        .send({
        nome: 'Membro Teste',
        email: `membro${Date.now()}@teste.com`,
        congregacaoId: congregacaoId
    });
    const memberId = resMember.body.id;
    const resOffering = await (0, supertest_1.default)(app_1.default)
        .post('/api/offerings')
        .set('schema', newSchema)
        .set('Authorization', `Bearer ${token}`)
        .send({
        type: 'DIZIMO',
        valor: 100, // <-- em português!
        data: new Date('2025-07-01').toISOString(), // <-- em português!
        memberId: memberId,
        congregacaoId: congregacaoId,
        usuarioId: 1 // se necessário
    });
    console.log('OFFERING ERROR:', resOffering.body);
    expect(resOffering.status).toBe(201);
    expect(resOffering.body).toHaveProperty('id');
});
//# sourceMappingURL=offering.controller.spec.js.map