import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API;
function Signup({ onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
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
        <h1>AI Task Manager</h1>
        <h2>Create account</h2>

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
        />

        {error && <div className="error-message"> {error}</div>}

        <button onClick={handleSignup} disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="switch-text">
          Already have an account?{' '}
          <span onClick={onSwitch}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;