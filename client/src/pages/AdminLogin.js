import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!form.username || !form.password) return setError('Please fill in all fields');
    try {
      setLoading(true);
      setError('');
      const res = await axios.post('http://localhost:8000/api/auth/login', form);
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-card">
        <div className="login-icon">🔐</div>
        <h2>Admin Login</h2>
        <p>Sign in to access the StayEase admin panel</p>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;