import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const API = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API}/api/analyze`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setReports(response.data);
      } catch (err) {
        setError('Failed to fetch report history from the database.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
      <div className="loading-spinner"></div>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Retrieving your audit history...</p>
    </div>
  );

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '3rem',
        paddingBottom: '2rem',
        borderBottom: '1px solid var(--border)'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Audits</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage and track your historical website scans.</p>
        </div>
        <Link to="/" className="btn-primary" style={{ marginBottom: '5px' }}>+ New Audit</Link>
      </header>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <div className="card" style={{ padding: '5rem', textAlign: 'center', backgroundColor: 'transparent', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🏜️</div>
          <h2 style={{ marginBottom: '1rem' }}>No scans found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>Perform your first analysis to see it here.</p>
          <Link to="/" className="btn-primary">Analyze a URL</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
          {reports.map(report => (
            <Link key={report._id} to={`/report/${report._id}`} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: report.score >= 80 ? '#dcfce7' : report.score >= 50 ? '#fef3c7' : '#fee2e2',
                  color: report.score >= 80 ? '#166534' : report.score >= 50 ? '#92400e' : '#991b1b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  {report.score}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                  {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h3 style={{
                marginBottom: '1rem',
                fontSize: '1.25rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: 'var(--text-main)'
              }}>
                {report.url.replace(/^https?:\/\//, '')}
              </h3>

              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>UX</div>
                  <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${report.categoryScores?.ux || 0}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px' }}></div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO</div>
                  <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${report.categoryScores?.seo || 0}%`, height: '100%', background: '#10b981', borderRadius: '3px' }}></div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>A11y</div>
                  <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${report.categoryScores?.accessibility || 0}%`, height: '100%', background: '#f59e0b', borderRadius: '3px' }}></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
