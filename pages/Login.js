import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Docuchain - Login';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post('/auth/login', form);
    localStorage.setItem('token', res.data.token);
    window.dispatchEvent(new Event('auth-changed'));
    setForm({ email: '', password: '' }); // ✅ clear fields
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login to Docuchain</h2>
      <label>Email</label>
      <input type="email" placeholder="Enter your email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <label>Password</label>
      <input type="password" placeholder="Enter your password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
