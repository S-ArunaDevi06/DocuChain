import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Docuchain - Register';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/auth/register', form);
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Your Docuchain Account</h2>
      <label>Username</label>
      <input type="text" placeholder="Choose a username" onChange={e => setForm({ ...form, username: e.target.value })} />
      <label>Email</label>
      <input type="email" placeholder="Enter your email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <label>Password</label>
      <input type="password" placeholder="Create a password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;

