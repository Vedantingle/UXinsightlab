import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('https://uxinsightlab.onrender.com/api/auth/login', { email, password });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '450px', 
      margin: '80px auto', 
      padding: '40px', 
      backgroundColor: 'var(--bg-card)', 
      borderRadius: '20px', 
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--text-main)' }}>Welcome Back</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px' }}>Sign in to access your UX Dashboard</p>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid #fecaca', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '1rem', background: 'var(--bg-main)', color: 'var(--text-main)' }}
          />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '1rem', background: 'var(--bg-main)', color: 'var(--text-main)' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary"
          style={{ 
            width: '100%', 
            padding: '14px', 
            borderRadius: '10px', 
            fontSize: '1.1rem', 
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Create one</Link>
      </p>
    </div>
  );
}

export default Login;
