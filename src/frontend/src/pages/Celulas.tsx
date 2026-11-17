import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Celulas() {
  const [celulas, setCelulas] = useState<any[]>([]);
  const igrejaId = localStorage.getItem('igrejaId') || null;

  useEffect(() => {
    loadCelulas();
  }, []);

  const loadCelulas = async () => {
    try {
      const res = await api.get('/celulas', { params: { igrejaId } });
      setCelulas(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) navigateToLogin();
    }
  };

  const navigateToLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('schema');
    localStorage.removeItem('igrejaId');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  const excluir = async (id: number) => {
    if (!confirm('Excluir célula?')) return;
    try {
      await api.delete(`/celulas/${id}`);
      loadCelulas();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha');
    }
  };

  return (
    <div className="page">
      <h2>Células</h2>
      <Link to="/">Voltar</Link>
      <button onClick={() => window.location.href = '/cadastro?tipo=celula'} style={{ marginBottom: '1rem', display: 'inline-block', color: 'green' }}>
        Criar Célula
      </button>
      <table>
        <thead>
          <tr><th>ID</th><th>Nome</th><th>Congregação</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {celulas.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nome}</td>
              <td>{c.congregacaoId}</td>
              <td>
                <Link to={`/celulas/${c.id}`}>Ver</Link>
                <button onClick={() => excluir(c.id)} style={{ marginLeft: '0.5rem', color: 'red' }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
