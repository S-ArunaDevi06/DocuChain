import React, { useState, useEffect, useRef } from 'react';
import API from '../api';

const Upload = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    expiryDate: '',
    category: '',
    file: null
  });

  const fileRef = useRef();

  useEffect(() => {
    document.title = 'Docuchain - Upload Document';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    await API.post('/docs/upload', data);
    alert('Document uploaded!');
    setForm({
      name: '',
      description: '',
      expiryDate: '',
      category: '',
      file: null
    });
    if (fileRef.current) fileRef.current.value = ''; // ✅ Clear the file input field
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload New Document</h2>

      <label>Document Name</label>
      <input
        type="text"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        placeholder="e.g., PAN Card"
        required
      />

      <label>Description</label>
      <input
        type="text"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        placeholder="Optional description"
      />

      <label>Expiry Date</label>
      <input
        type="date"
        value={form.expiryDate}
        onChange={e => setForm({ ...form, expiryDate: e.target.value })}
        required
      />

      <label>Category</label>
      <input
        type="text"
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
        placeholder="e.g., ID, Bank, Certificate"
      />

      <label>Upload File</label>
      <input
        type="file"
        ref={fileRef}
        onChange={e => setForm({ ...form, file: e.target.files[0] })}
        required
      />

      <button type="submit">Upload</button>
    </form>
  );
};

export default Upload;
