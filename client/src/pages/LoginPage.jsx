import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';

function LoginPage() {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  function submit(e) {
    e.preventDefault();
    dispatch(loginUser(form));
  }

  if (token) return <Navigate to="/chat" replace />;

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">Secure and private</p>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Sign in to continue your guided support conversation and mood tracking.</p>
        <input className="input" placeholder="Email" type="email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" required onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="small">{error}</p>}
        <button className="btn" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        <p className="small">New here? <Link to="/register">Create account</Link></p>
      </form>
    </div>
  );
}

export default LoginPage;
