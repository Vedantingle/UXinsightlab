import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
const API = import.meta.env.VITE_API_BASE_URL;

function Report() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAudit, setExpandedAudit] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${API}/api/analyze/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setResult(response.data);
      } catch (err) {
        setError('Failed to fetch the report or it does not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleDownloadPDF = () => {
    // Expand all audits before printing
    const prevExpanded = expandedAudit;
    setExpandedAudit('all');

    const style = document.createElement('style');
    style.id = 'print-styles';
    style.innerHTML = `
      @media print {
        nav, footer, .no-print { display: none !important; }
        body, [data-theme="dark"] { background: white !important; color: #0f172a !important; }
        .card, [data-theme="dark"] .card { background: white !important; box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
        * { color-adjust: exact; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        a[href]::after { content: none !important; }
        .audit-row { break-inside: avoid; }
      }
    `;
    document.head.appendChild(style);

    // Small delay so React re-renders expanded audits before print dialog opens
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.getElementById('print-styles')?.remove();
        setExpandedAudit(prevExpanded);
      }, 1000);
    }, 300);
  };

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Retrieving in-depth analysis...</p>
    </div>
  );

  if (error) return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
      <div className="badge badge-error" style={{ marginBottom: '1rem' }}>Error</div>
      <h2>{error}</h2>
      <Link to="/dashboard" style={{ color: 'var(--primary)', marginTop: '2rem', display: 'inline-block' }}>Back to Dashboard</Link>
    </div>
  );

  if (!result) return null;

  const isExpanded = (index) => expandedAudit === 'all' || expandedAudit === index;
  const toggleAudit = (index) => {
    setExpandedAudit(expandedAudit === index ? null : index);
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <Link to="/dashboard" className="no-print" style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to Dashboard
      </Link>

      <div className="card" style={{ padding: '3rem', marginBottom: '3rem' }}>
        {/* Header */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)',
          flexWrap: 'wrap', gap: '1.5rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>Audit Report</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href={result.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{result.url}</a>
              <span style={{ color: 'var(--border)' }}>|</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(result.createdAt).toLocaleString()}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={handleDownloadPDF} className="no-print"
              style={{
                padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)', background: 'var(--bg-main)',
                color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.85rem',
                fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px'
              }}>
              ⬇ Download PDF
            </button>
            <div style={{
              width: '80px', height: '80px', borderRadius: 'var(--radius-md)',
              backgroundColor: result.score >= 80 ? '#dcfce7' : result.score >= 50 ? '#fef3c7' : '#fee2e2',
              color: result.score >= 80 ? '#166534' : result.score >= 50 ? '#92400e' : '#991b1b',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(0,0,0,0.05)', flexShrink: 0
            }}>
              <div style={{ fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase', opacity: 0.8 }}>Score</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{result.score}</div>
            </div>
          </div>
        </header>

        {/* Summary */}
        {result.summary && (
          <div style={{ backgroundColor: 'var(--bg-main)', padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem', borderLeft: '5px solid var(--primary)' }}>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.15rem' }}>📝 Scan Summary</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem' }}>{result.summary}</p>
          </div>
        )}

        {/* Category Metrics */}
        {result.categoryScores && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            {[
              { label: 'SEO', score: result.categoryScores.seo, color: '#10b981' },
              { label: 'Accessibility', score: result.categoryScores.accessibility, color: '#f59e0b' },
              { label: 'UX', score: result.categoryScores.ux, color: 'var(--primary)' }
            ].map(cat => (
              <div key={cat.label} style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: 'var(--bg-card)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{cat.label}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: cat.score >= 80 ? '#166534' : '#92400e' }}>{cat.score}%</div>
                <div style={{ height: '4px', backgroundColor: 'var(--bg-main)', borderRadius: '2px', marginTop: '0.75rem', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.score}%`, height: '100%', backgroundColor: cat.color }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Heuristics */}
        {result.heuristics && result.heuristics.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🧠 Heuristic Analysis</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {result.heuristics.map((h, i) => (
                <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem' }}>{h.title}</h4>
                    <span className={`badge ${h.score >= 80 ? 'badge-success' : 'badge-warning'}`}>{h.score}%</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>{h.explanation}</p>
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                    <strong>Tip:</strong> {h.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Audits */}
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Detailed Audit Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {result.audits && result.audits.length > 0 ? result.audits.map((audit, index) => (
              <div key={index} className="audit-row" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{
                  padding: '1.25rem', backgroundColor: 'var(--bg-card)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
                }} onClick={() => toggleAudit(index)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span>❌</span>
                    <span style={{ fontWeight: '600' }}>{audit.issue}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="badge badge-error" style={{ fontSize: '0.75rem' }}>-{audit.scoreImpact} pts</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>{isExpanded(index) ? 'Hide' : 'Expand'}</span>
                  </div>
                </div>

                {isExpanded(index) && (
                  <div style={{ padding: '2rem', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border)' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>💡 Fix: {audit.suggestion}</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                      <div>
                        <h5 style={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Why it matters</h5>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>{audit.whyMatters || 'This issue affects the user experience and discoverability of your site.'}</p>
                      </div>
                      <div>
                        <h5 style={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>How to fix</h5>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '1rem' }}>{audit.howToFix || audit.suggestion}</p>
                        {audit.learnMore && (
                          <a href={audit.learnMore} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem' }}>Read Documentation →</a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )) : (
              <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ color: '#166534' }}>All Checks Passed!</h3>
                <p style={{ color: 'var(--text-muted)' }}>This page follows professional UX and accessibility standards.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
