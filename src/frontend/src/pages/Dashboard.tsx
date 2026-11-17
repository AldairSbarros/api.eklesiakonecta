import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [igrejas, setIgrejas] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('usuario');
    if (u) setUsuario(JSON.parse(u));
    loadIgrejas();
  }, []);

  const loadIgrejas = async () => {
    try {
      const res = await api.get('/igrejas');
      setIgrejas(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) navigate('/login');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Eklesia Konecta</h1>
        <div>
          <span>{usuario?.nome} ({usuario?.role})</span>
          <button onClick={logout}>Sair</button>
        </div>
      </header>
      <nav>
        <Link to="/igrejas">Igrejas</Link>
        <Link to="/congregacoes">Congregações</Link>
        <Link to="/celulas">Células</Link>
        <Link to="/membros">Membros</Link>
        <Link to="/receitas">Financeiro</Link>
      </nav>
      <main>
        <h2>Igrejas</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>Nome</th></tr>
          </thead>
          <tbody>
            {igrejas.map((i) => (
              <tr key={i.id}><td>{i.id}</td><td>{i.nome}</td></tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
