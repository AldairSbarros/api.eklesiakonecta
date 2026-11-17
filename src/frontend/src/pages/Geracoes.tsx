import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Geracoes() {
  const [geracoes, setGeracoes] = useState<any[]>([]);
  const congregacaoId = localStorage.getItem('congregacaoId') || null;

  useEffect(() => {
    loadGeracoes();
  }, []);

  const loadGeracoes = async () => {
    try {
      const res = await api.get('/geracoes', { params: { congregacaoId } });
      setGeracoes(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) navigateToLogin();
    }
  };

  const navigateToLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('schema');
    localStorage.removeItem('congregacaoId');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  const excluir = async (id: number) => {
    if (!confirm('Excluir geração?')) return;
    try {
      await api.delete(`/geracoes/${id}`);
      loadGeracoes();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha');
    }
  };

  return (
    <div className="page">
      <h2>Gerações</h2>
      <Link to="/">Voltar</Link>
      <button onClick={() => window.location.href = '/cadastro?tipo=geracao'} style={{ marginBottom: '1rem', display: 'inline-block', color: 'green' }}>
        Criar Geração
      </button>
      <table>
        <thead>
          <tr><th>ID</th><th>Nome</th><th>Congregação</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {geracoes.map((g) => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.nome}</td>
              <td>{g.congregacaoId}</td>
              <td>
                <Link to={`/geracoes/${g.id}`}>Ver</Link>
                <button onClick={() => excluir(g.id)} style={{ marginLeft: '0.5rem', color: 'red' }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
