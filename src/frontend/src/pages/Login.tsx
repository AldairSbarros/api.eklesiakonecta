import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [schema, setSchema] = useState('public');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      localStorage.setItem('schema', schema);
      const res = await api.post('/api/login', { email, senha });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Eklesia Konecta</h1>
        <p className="subtitle">Sistema de Gestão para Igrejas</p>
        <form onSubmit={handleSubmit}>
          <label>
            Schema (Igreja)
            <input
              type="text"
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              placeholder="public ou igreja_xxx"
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="footer">
          Ainda não tem igreja cadastrada?{' '}
          <Link to="/cadastro">Cadastre aqui</Link>
        </p>
      </div>
    </div>
  );
}
