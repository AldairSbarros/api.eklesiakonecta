
import request from 'supertest';
import app from '../app';
jest.setTimeout(30000);

describe('Células', () => {
	let token: string;
	let churchId: number;
	let congregacaoId: number;
	let schemaNovo: string;

	beforeAll(async () => {
		const email = `igreja${Date.now()}@teste.com`;
		const senha = 'SenhaForte123';
		const resIgreja = await request(app)
			.post('/api/igrejas')
			.send({
				nome: 'Igreja Teste',
				email,
				senhaAdmin: senha,
				endereco: 'Rua Teste, 123'
			});
		console.log('RES IGREJA:', resIgreja.status, resIgreja.body);
		expect(resIgreja.status).toBe(201);
		schemaNovo = resIgreja.body.igreja.schema;
		churchId = resIgreja.body.igreja.id;

		const resLogin = await request(app)
			.post('/api/auth/login')
			.set('schema', schemaNovo)
			.send({ email, senha });
		console.log('RES LOGIN:', resLogin.status, resLogin.body);
		expect(resLogin.status).toBe(200);
		token = resLogin.body.token;

		const resCong = await request(app)
			.post('/api/congregacoes')
			.set('schema', schemaNovo)
			.set('Authorization', `Bearer ${token}`)
			.send({ nome: 'Congregação Teste', churchId, endereco: 'Rua Teste' });
		console.log('RES CONG:', resCong.status, resCong.body);
		expect(resCong.status).toBe(201);
		congregacaoId = resCong.body.id;
		console.log('CONGREGACAO ID:', congregacaoId);
	}, 20000);

	it('deve criar uma célula', async () => {
		const res = await request(app)
			.post('/api/celulas')
			.set('schema', schemaNovo)
			.set('Authorization', `Bearer ${token}`)
			.send({ nome: 'Célula Teste', congregacaoId });
		console.log('RES CELULA CREATE:', res.status, res.body);
		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('id');
	}, 20000);

	it('deve listar as células', async () => {
		const res = await request(app)
			.get('/api/celulas')
			.set('schema', schemaNovo)
			.set('Authorization', `Bearer ${token}`);
		console.log('RES CELULA LIST:', res.status, res.body);
		expect(res.status).toBe(200);
		expect(res.body).toBeInstanceOf(Array);
	});

	it('deve atualizar uma célula', async () => {
		const resCriacao = await request(app)
			.post('/api/celulas')
			.set('schema', schemaNovo)
			.set('Authorization', `Bearer ${token}`)
			.send({ nome: 'Célula Atualização Teste', congregacaoId });
		expect(resCriacao.status).toBe(201);
		const celulaId = resCriacao.body.id;

		const resAtualizacao = await request(app)
			.put(`/api/celulas/${celulaId}`)
			.set('schema', schemaNovo)
			.set('Authorization', `Bearer ${token}`)
			.send({ nome: 'Célula Atualizada' });
		console.log('RES CELULA UPDATE:', resAtualizacao.status, resAtualizacao.body);
		expect(resAtualizacao.status).toBe(200);
		expect(resAtualizacao.body.nome).toBe('Célula Atualizada');
	});

	it('deve excluir uma célula', async () => {
		const resCriacao = await request(app)
			.post('/api/celulas')
			.set('schema', schemaNovo)
			.set('Authorization', `Bearer ${token}`)
			.send({ nome: 'Célula Exclusão Teste', congregacaoId });
		expect(resCriacao.status).toBe(201);
		const celulaId = resCriacao.body.id;

		const resExclusao = await request(app)
			.delete(`/api/celulas/${celulaId}`)
			.set('schema', schemaNovo)
			.set('Authorization', `Bearer ${token}`);
		console.log('RES CELULA DELETE:', resExclusao.status, resExclusao.body);
		expect(resExclusao.status).toBe(200);
		expect(resExclusao.body).toHaveProperty('message');
	});
});
