import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Igrejas() {
  const [igrejas, setIgrejas] = useState<any[]>([]);
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  useEffect(() => {
    loadIgrejas();
  }, []);

  const loadIgrejas = async () => {
    try {
      const res = await api.get('/igrejas');
      setIgrejas(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) navigateToLogin();
    }
  };

  const navigateToLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('schema');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  const excluir = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta igreja?')) return;
    try {
      await api.delete(`/igrejas/${id}`);
      loadIgrejas();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao excluir');
    }
  };

  return (
    <div className="page">
      <h2>Igrejas</h2>
      <Link to="/cadastro" style={{ marginBottom: '1rem', display: 'inline-block' }}>Criar Nova Igreja</Link>
      <table>
        <thead>
          <tr><th>ID</th><th>Nome</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {igrejas.map((i) => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.nome}</td>
              <td>
                <Link to={`/igrejas/${i.id}`}>Ver</Link>
                {usuario?.role === 'PASTOR' || usuario?.role === 'SUPERUSER' && (
                  <button onClick={() => excluir(i.id)} style={{ marginLeft: '0.5rem', color: 'red' }}>Excluir</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
