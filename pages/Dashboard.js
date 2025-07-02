import React, { useEffect, useState, useRef } from 'react';
import API from '../api';

const Dashboard = () => {
  const [docs, setDocs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    expiryDate: '',
    category: ''
  });
  const [fileToUpload, setFileToUpload] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('none');

  const fileRef = useRef();
  const editFormRef = useRef(null);

  useEffect(() => {
    document.title = 'Docuchain - Dashboard';
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    const res = await API.get('/docs');
    setDocs(res.data);
  };

  const deleteDoc = async (id) => {
    await API.delete(`/docs/${id}`);
    setDocs(docs.filter(doc => doc._id !== id));
  };

  const startEditing = (doc) => {
    setEditingId(doc._id);
    setEditForm({
      name: doc.name,
      description: doc.description,
      expiryDate: doc.expiryDate.slice(0, 10),
      category: doc.category
    });
    setFileToUpload(null);
    if (fileRef.current) fileRef.current.value = '';
    setTimeout(() => {
      if (editFormRef.current) {
        editFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', description: '', expiryDate: '', category: '' });
    setFileToUpload(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editForm.name);
    formData.append('description', editForm.description);
    formData.append('expiryDate', editForm.expiryDate);
    formData.append('category', editForm.category);
    if (fileToUpload) {
      formData.append('file', fileToUpload);
    }
    await API.put(`/docs/${editingId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    cancelEdit();
    fetchDocs();
  };

  const filteredDocs = docs.filter(doc => {
    const search = filter.toLowerCase();
    const formattedDate = `${new Date(doc.expiryDate).getDate()}/${new Date(doc.expiryDate).getMonth() + 1}/${new Date(doc.expiryDate).getFullYear()}`;
    const fileNameOnly = doc.fileUrl?.split('-').slice(1).join('-') || '';
    return (
      (doc.name || '').toLowerCase().includes(search) ||
      (doc.description || '').toLowerCase().includes(search) ||
      (doc.category || '').toLowerCase().includes(search) ||
      formattedDate.includes(search) ||
      fileNameOnly.toLowerCase().includes(search)
    );
  });

  const sortedDocs = [...filteredDocs];
  if (sortOrder === 'recent') {
    sortedDocs.sort((a, b) => new Date(b.expiryDate) - new Date(a.expiryDate));
  } else if (sortOrder === 'old') {
    sortedDocs.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
  }

  return (
    <div className="container">
      <h2>Your Documents</h2>

      <input
        type="text"
        placeholder="🔍 Search by name, category, date, or file..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          padding: '0.75em',
          marginBottom: '1.5em',
          width: '100%',
          maxWidth: '500px',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      />

      <div style={{ marginBottom: '1.5em' }}>
        <label style={{ marginRight: '1em', fontWeight: 'bold' }}>Sort by Expiry Date:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            padding: '0.5em',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            background: '#f9f9f9',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <option value="none">Not Sorted</option>
          <option value="recent">Descending</option>
          <option value="old">Ascending</option>
        </select>
      </div>

      {sortedDocs.map(doc => (
        <div key={doc._id} className="card">
          <h3>{doc.name}</h3>
          <p><strong>Description:</strong> {doc.description || 'N/A'}</p>
          <p><strong>Expiry Date:</strong> {
            `${new Date(doc.expiryDate).getDate()}/${new Date(doc.expiryDate).getMonth() + 1}/${new Date(doc.expiryDate).getFullYear()}`
          }</p>
          <p><strong>Category:</strong> {doc.category}</p>
          <p><strong>File:</strong> {doc.fileUrl?.split('-').pop()}</p>

          <div style={{ display: 'flex', gap: '1em', marginTop: '1em' }}>
            <button onClick={() => deleteDoc(doc._id)}>Delete</button>
            <button onClick={() => startEditing(doc)}>Edit</button>
            <a
              href={`http://localhost:5000/${doc.fileUrl.replace(/\\/g, '/')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '1.2rem',
                textDecoration: 'none',
                background: '#6a11cb',
                color: 'white',
                padding: '0.5em 1em',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5em'
              }}
            >
              📄 View File
            </a>
          </div>

          {editingId === doc._id && (
            <form ref={editFormRef} onSubmit={handleEditSubmit} style={{ marginTop: '1.5em' }}>
              <label>Document Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />

              <label>Description</label>
              <input
                type="text"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />

              <label>Expiry Date</label>
              <input
                type="date"
                value={editForm.expiryDate}
                onChange={(e) => setEditForm({ ...editForm, expiryDate: e.target.value })}
                required
              />

              <label>Category</label>
              <input
                type="text"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              />

              <label>Replace File (optional)</label>
              <input
                type="file"
                ref={fileRef}
                onChange={(e) => setFileToUpload(e.target.files[0])}
              />

              <div style={{ marginTop: '1em', display: 'flex', gap: '1em' }}>
                <button type="submit">Save</button>
                <button type="button" onClick={cancelEdit}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
