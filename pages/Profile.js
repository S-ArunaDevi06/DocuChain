// File: src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchUser();
    fetchStats();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get('/auth/user');
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err.message);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get('/docs/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err.message);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const res = await API.post('/auth/reset-password', { newPassword });
      setSuccessMsg(res.data.msg);
      setErrorMsg('');
      setNewPassword('');
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Password reset failed');
      setSuccessMsg('');
    }
  };

  return (
    <div className="profile-container" style={styles.container}>
      <h2 style={styles.heading}>👤 Profile</h2>
      <div style={styles.card}>
        <p><strong>Name:</strong> {user.username || '—'}</p>
        <p><strong>Email:</strong> {user.email || '—'}</p>
        <p>
          <strong>Password:</strong> {showPassword ? user.password || '********' : '********'}
          <hr></hr>
        </p>
        <div style={{ marginTop: '1em' }}>
          <label>Reset Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
            placeholder="New Password"
          />
          <button onClick={handlePasswordReset} style={styles.resetBtn}>Update Password</button>
          {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        </div>
      </div>

      <h3 style={{ marginTop: '2em' }}>📊 Document Summary</h3>
      {stats ? (
        <div style={styles.grid}>
          <div style={{ ...styles.statBox, backgroundColor: '#9b59b6' }}>
            <h4>Total Documents</h4>
            <p>{stats.total}</p>
          </div>
          <div style={{ ...styles.statBox, backgroundColor: '#8e5c42' }}>
            <h4>Expired</h4>
            <p>{stats.expired}</p>
          </div>
          <div style={{ ...styles.statBox, backgroundColor: '#e74c3c' }}>
            <h4>Expiring in 0–7 Days</h4>
            <p>{stats.red}</p>
          </div>
          <div style={{ ...styles.statBox, backgroundColor: '#f1c40f' }}>
            <h4>Expiring in 8–15 Days</h4>
            <p>{stats.yellow}</p>
          </div>
          <div style={{ ...styles.statBox, backgroundColor: '#2ecc71' }}>
            <h4>Expiring in 16–30 Days</h4>
            <p>{stats.green}</p>
          </div>
          <div style={{ ...styles.statBox, backgroundColor: '#3498db' }}>
            <h4>Expiring After 30 Days</h4>
            <p>{stats.later}</p>
          </div>
        </div>
      ) : (
        <p>Loading stats...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2em',
    maxWidth: '800px',
    margin: '0 auto',
  },
  heading: {
    marginBottom: '1em',
    color: '#2c3e50',
  },
  card: {
    background: '#f9f9f9',
    padding: '1.5em',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.08)',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1em',
    marginTop: '1.5em',
  },
  statBox: {
    color: 'white',
    padding: '1em',
    borderRadius: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  toggleBtn: {
    marginLeft: '1em',
    padding: '0.3em 0.6em',
    fontSize: '0.9em',
    cursor: 'pointer',
  },
  resetBtn: {
    marginLeft: '1em',
    padding: '0.4em 1em',
    background: '#6a11cb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  input: {
    padding: '0.5em',
    marginTop: '0.5em',
    marginRight: '0.5em',
    width: '200px'
  }
};

export default Profile;
