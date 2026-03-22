import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';

function RegisterPage() {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  function submit(e) {
    e.preventDefault();
    dispatch(registerUser(form));
  }

  if (token) return <Navigate to="/chat" replace />;

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">Start your wellness journey</p>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Create your account to unlock private support chats, mood trends, and guided coping prompts.</p>
        <input className="input" placeholder="Full name" required onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" type="email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" required onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="small">{error}</p>}
        <button className="btn" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        <p className="small">Already have an account? <Link to="/login">Sign in</Link></p>
      </form>
    </div>
  );
}

export default RegisterPage;
