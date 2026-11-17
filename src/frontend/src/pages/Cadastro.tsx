import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Cadastro() {
  const [form, setForm] = useState({
    nomeIgreja: '',
    nomePastor: '',
    emailPastor: '',
    senhaPastor: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await api.post('/api/cadastro-inicial', form);
      setSuccess(`Igreja "${res.data.igrejaId}" criada! Schema: ${res.data.schema}`);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha no cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Cadastro Inicial</h1>
        <p className="subtitle">Crie sua igreja e comece a usar o sistema</p>
        <form onSubmit={handleSubmit}>
          <label>
            Nome da Igreja
            <input name="nomeIgreja" value={form.nomeIgreja} onChange={handleChange} required />
          </label>
          <label>
            Nome do Pastor
            <input name="nomePastor" value={form.nomePastor} onChange={handleChange} required />
          </label>
          <label>
            Email do Pastor
            <input type="email" name="emailPastor" value={form.emailPastor} onChange={handleChange} required />
          </label>
          <label>
            Senha
            <input type="password" name="senhaPastor" value={form.senhaPastor} onChange={handleChange} required />
          </label>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Igreja'}
          </button>
        </form>
        <p className="footer">
          Já tem conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
}
