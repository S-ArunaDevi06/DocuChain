// File: src/pages/Notifications.js
import React, { useEffect, useState } from 'react';
import API from '../api';

const Notifications = () => {
  const [expiringDocs, setExpiringDocs] = useState([]);
  const [expiredDocs, setExpiredDocs] = useState([]);

  useEffect(() => {
    document.title = 'Docuchain - Notifications';
    fetchExpiringDocs();
    fetchExpiredDocs();
  }, []);

  const fetchExpiringDocs = async () => {
    const res = await API.get('/docs/notifications/soon');
    const sorted = res.data.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    setExpiringDocs(sorted);
  };

  const fetchExpiredDocs = async () => {
    const now = new Date().toISOString();
    const res = await API.get('/docs');
    const expired = res.data
      .filter(doc => new Date(doc.expiryDate) < new Date(now))
      .sort((a, b) => new Date(b.expiryDate) - new Date(a.expiryDate));
    setExpiredDocs(expired);
  };

  const getUrgencyColor = (date) => {
    const today = new Date();
    const diff = (new Date(date) - today) / (1000 * 3600 * 24);
    if (diff <= 7) return '#ff4d4d'; // red
    if (diff <= 15) return '#ffcc00'; // yellow
    return '#66cc66'; // green
  };

  return (
    <div className="container">
      <h2>Notifications - Expiring Soon</h2>
      {expiringDocs.length === 0 && <p>No upcoming expirations within 30 days.</p>}
      {expiringDocs.map(doc => (
        <div
          key={doc._id}
          className="card"
          style={{ backgroundColor: getUrgencyColor(doc.expiryDate), color: 'white' }}
        >
          <h3>{doc.name}</h3>
          <p><strong>Expires on:</strong> {new Date(doc.expiryDate).toLocaleDateString()}</p>
          <p><strong>Description:</strong> {doc.description || 'N/A'}</p>
        </div>
      ))}

      <h2 style={{ marginTop: '2em' }}>Expired Documents</h2>
      {expiredDocs.length === 0 && <p>No expired documents.</p>}
      {expiredDocs.map(doc => (
        <div
          key={doc._id}
          className="card"
          style={{ backgroundColor: '#835513', color: 'white' }} // brown
        >
          <h3>{doc.name}</h3>
          <p><strong>Expired on:</strong> {new Date(doc.expiryDate).toLocaleDateString()}</p>
          <p><strong>Description:</strong> {doc.description || 'N/A'}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
