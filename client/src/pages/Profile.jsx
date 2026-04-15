import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getLevelTag = (score) => {
  if (!score && score !== 0) return { label: 'Newcomer', emoji: '🌱', color: 'var(--text-muted)' };
  if (score >= 90) return { label: 'Expert', emoji: '🏆', color: '#16a34a' };
  if (score >= 70) return { label: 'Advanced', emoji: '⭐', color: '#2563eb' };
  if (score >= 50) return { label: 'Intermediate', emoji: '📘', color: '#d97706' };
  return { label: 'Beginner', emoji: '🌱', color: '#64748b' };
};

function Profile() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, reportsRes] = await Promise.all([
          axios.get('https://uxinsightlab.onrender.com/api/users/profile'),
          axios.get('https://uxinsightlab.onrender.com/api/analyze')
        ]);
        setStats(profileRes.data);
        setRecentReports(reportsRes.data.slice(0, 3)); // Last 3 scans
      } catch (err) {
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading your profile...</p>
    </div>
  );

  const quizResult = stats?.user?.lastQuizResult;
  const level = getLevelTag(quizResult?.score);

  return (
    <div className="container" style={{ maxWidth: '960px', padding: '4rem 1.5rem' }}>
      {/* User Identity Card */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            backgroundColor: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: '700', flexShrink: 0
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{user?.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{user?.email}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.25rem', borderRadius: '999px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '1.25rem' }}>{level.emoji}</span>
            <span style={{ fontWeight: '700', color: level.color }}>{level.label}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Total Scans</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)' }}>{stats?.stats?.totalScans || 0}</div>
        </div>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Avg. Score</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--success)' }}>{stats?.stats?.averageScore || 0}%</div>
        </div>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Quiz Score</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>{quizResult?.score ?? '—'}%</div>
        </div>
      </div>

      {/* Two column: Recent Activity + Learning Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Recent Scans */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Recent Activity</h3>
          {recentReports.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentReports.map(r => (
                <Link key={r._id} to={`/report/${r._id}`}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)', fontSize: '0.9rem'
                  }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{r.url?.replace(/^https?:\/\//, '').substring(0, 30)}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className={`badge ${r.score >= 80 ? 'badge-success' : r.score >= 50 ? 'badge-warning' : 'badge-error'}`}>{r.score}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <p>No scans yet.</p>
              <Link to="/" style={{ color: 'var(--primary)', fontWeight: '600', marginTop: '0.5rem', display: 'inline-block' }}>Run your first audit →</Link>
            </div>
          )}
        </div>

        {/* Learning Progress */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Learning Progress</h3>
          {quizResult ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{quizResult.score}%</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{quizResult.category} • {quizResult.difficulty}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {quizResult.date ? new Date(quizResult.date).toLocaleDateString() : ''}
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ width: `${quizResult.score}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
              </div>
              <Link to="/learning" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>Continue learning →</Link>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <p>No quiz data yet.</p>
              <Link to="/learning" style={{ color: 'var(--primary)', fontWeight: '600', marginTop: '0.5rem', display: 'inline-block' }}>Take your first quiz →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
        <button onClick={logout}
          style={{
            color: 'var(--error)', background: 'none', border: 'none',
            fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer',
            padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)',
          }}>
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Profile;
