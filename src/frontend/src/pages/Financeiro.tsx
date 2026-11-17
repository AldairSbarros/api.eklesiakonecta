import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Financeiro() {
  const [meses, setMeses] = useState<string[]>([]);

  useEffect(() => {
    loadMeses();
  }, []);

  const loadMeses = async () => {
    try {
      await api.get('/congregacoes/1/receitas?mes=2025-09');
      setMeses(['2025-09', '2025-10', '2025-11']);
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

  return (
    <div className="page">
      <h2>Financeiro / Relatórios</h2>
      <Link to="/">Voltar</Link>
      <table>
        <thead>
          <tr><th>Mês</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {meses.map((m) => (
            <tr key={m}>
              <td>{m}</td>
              <td>
                <button style={{color:'green'}} onClick={() => window.location.href = `/financeiro/export?mes=${m}&formato=csv`}>CSV</button>
                <button style={{color:'blue', marginLeft:'0.5rem'}} onClick={() => window.location.href = `/financeiro/export?mes=${m}&formato=pdf`}>PDF</button>
                <button style={{color:'purple', marginLeft:'0.5rem'}} onClick={() => window.location.href = `/financeiro/export?mes=${m}&formato=xlsx`}>XLSX</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
