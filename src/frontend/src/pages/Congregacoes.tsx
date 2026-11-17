import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Congregacoes() {
  const [congregacoes, setCongregacoes] = useState<any[]>([]);
  const igrejaId = localStorage.getItem('igrejaId') || null;

  useEffect(() => {
    loadCongregacoes();
  }, []);

  const loadCongregacoes = async () => {
    try {
      const res = await api.get('/congregacoes', { params: { igrejaId } });
      setCongregacoes(res.data);
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
    if (!confirm('Excluir congregação?')) return;
    try {
      await api.delete(`/congregacoes/${id}`);
      loadCongregacoes();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha');
    }
  };

  return (
    <div className="page">
      <h2>Congregações</h2>
      <Link to="/">Voltar</Link>
      <button onClick={() => window.location.href = '/cadastro?tipo=congregacao'} style={{ marginBottom: '1rem', display: 'inline-block', color: 'green' }}>
        Criar Congregação
      </button>
      <table>
        <thead>
          <tr><th>ID</th><th>Nome</th><th>Igreja</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {congregacoes.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nome}</td>
              <td>{c.igrejaId}</td>
              <td>
                <Link to={`/congregacoes/${c.id}`}>Ver</Link>
                <button onClick={() => excluir(c.id)} style={{ marginLeft: '0.5rem', color: 'red' }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
