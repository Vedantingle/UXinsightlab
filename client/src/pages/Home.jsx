import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://uxinsightlab.onrender.com/api/analyze', { url });
      navigate(`/report/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze URL. Please check the URL and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="landing">
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 0', 
        textAlign: 'center', 
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)' 
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>
            Perfect Your Website's <span style={{ color: 'var(--primary)' }}>UX Strategy</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: '1.6' }}>
            Automated deep-dive audits for SEO, Accessibility, and User Experience. 
            Get actionable insights to boost convergence and retention.
          </p>

          <form onSubmit={handleAnalyze} style={{ 
            display: 'flex', 
            gap: '12px', 
            background: 'var(--bg-card)', 
            padding: '8px', 
            borderRadius: 'var(--radius-lg)', 
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              required
              style={{ 
                flex: 1, 
                padding: '1rem', 
                fontSize: '1.1rem', 
                border: 'none', 
                outline: 'none',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'transparent',
              }}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
              style={{ padding: '0 2rem', fontSize: '1rem', minWidth: '140px' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }}></span>
                  Analyzing...
                </span>
              ) : 'Analyze Now'}
            </button>
          </form>

          {error && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#fee2e2', 
              color: '#991b1b', 
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Everything you need for UX Mastery</h2>
            <p style={{ color: 'var(--text-muted)' }}>Professional tools designed for developers and designers.</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2.5rem' 
          }}>
            <div className="card" style={{ padding: '2.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>🔍</div>
              <h3 style={{ marginBottom: '1rem' }}>In-depth Audits</h3>
              <p style={{ color: 'var(--text-muted)' }}>Automated rule-based checks that scan for over 50+ common UX friction points and SEO leaks.</p>
            </div>
            <div className="card" style={{ padding: '2.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>🎓</div>
              <h3 style={{ marginBottom: '1rem' }}>Learning Hub</h3>
              <p style={{ color: 'var(--text-muted)' }}>Don't just fix issues—learn the why behind the rules with our integrated UX learning modules.</p>
            </div>
            <div className="card" style={{ padding: '2.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>📊</div>
              <h3 style={{ marginBottom: '1rem' }}>Progress Tracking</h3>
              <p style={{ color: 'var(--text-muted)' }}>Save your reports and track your website's improvement over time with our personalized dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2.25rem' }}>How it Works</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {[
              { step: '01', title: 'Connect your URL', text: 'Enter any public website URL to start our automated crawler.' },
              { step: '02', title: 'Instant Audit', text: 'Our engine parses semantic HTML, meta-tags, and UX patterns in real-time.' },
              { step: '03', title: 'Actionable Plan', text: 'Receive a prioritized list of improvements with deep-dive educational insights.' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '800', 
                  color: 'var(--primary)', 
                  backgroundColor: 'var(--bg-main)', 
                  width: '60px', 
                  height: '60px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-md)',
                  flexShrink: 0
                }}>
                  {item.step}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ backgroundColor: 'var(--text-main)', padding: '5rem 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to optimize?</h2>
          <p style={{ color: '#94a3b8', marginBottom: '3rem', fontSize: '1.1rem' }}>Join over 5,000+ developers making the web more accessible and user-friendly.</p>
          <button className="btn-primary" style={{ padding: '1rem 3rem' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Analyze your site now
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
