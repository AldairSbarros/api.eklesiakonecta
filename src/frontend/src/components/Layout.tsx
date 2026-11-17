import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Eklesia Konecta</h1>
        <div className="header-right">
          {usuario && <span>{usuario.nome} ({usuario.role})</span>}
          <button onClick={logout}>Sair</button>
        </div>
      </header>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/igrejas">Igrejas</Link>
        <Link to="/congregacoes">Congregações</Link>
        <Link to="/celulas">Células</Link>
        <Link to="/membros">Membros</Link>
        <Link to="/financeiro">Financeiro</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
