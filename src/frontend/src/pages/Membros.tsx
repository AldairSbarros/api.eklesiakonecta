import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Membros() {
  const [membros, setMembros] = useState<any[]>([]);
  const igrejaId = localStorage.getItem('igrejaId') || null;

  useEffect(() => {
    loadMembros();
  }, []);

  const loadMembros = async () => {
    try {
      const res = await api.get('/membros', { params: { igrejaId } });
      setMembros(res.data);
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
    if (!confirm('Excluir membro?')) return;
    try {
      await api.delete(`/membros/${id}`);
      loadMembros();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha');
    }
  };

  return (
    <div className="page">
      <h2>Membros</h2>
      <Link to="/">Voltar</Link>
      <button onClick={() => window.location.href = '/cadastro?tipo=membro'} style={{ marginBottom: '1rem', display: 'inline-block', color: 'green' }}>
        Criar Membro
      </button>
      <table>
        <thead>
          <tr><th>ID</th><th>Nome</th><th>Email</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {membros.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.nome}</td>
              <td>{m.email}</td>
              <td>
                <Link to={`/membros/${m.id}`}>Ver</Link>
                <button onClick={() => excluir(m.id)} style={{ marginLeft: '0.5rem', color: 'red' }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
