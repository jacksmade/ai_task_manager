import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API;
function Login({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      login(data.token, data.user);

    } catch (err) {
      setError('Something went wrong. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1> AI Task Manager</h1>
        <h2>Welcome back!</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
        />

        {error && <div className="error-message">{error}</div>}

        <button onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="switch-text">
          Don't have an account?{' '}
          <span onClick={onSwitch}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;