import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="container" style={{ maxWidth: '800px', padding: '5rem 1.5rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>About UXAnalyzer</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto' }}>
          A professional toolkit designed to help developers and designers build better, more accessible, and more discoverable websites.
        </p>
      </header>

      <div className="card" style={{ padding: '3rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Our Mission</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>
          We believe every website deserves a professional UX audit. UXAnalyzer was built to democratize web quality analysis — making it accessible to solo developers, small teams, and large organizations alike. Our automated, rule-based engine provides instant, explainable insights without the cost of hiring a consultant.
        </p>

        <h2 style={{ marginBottom: '1rem' }}>What We Offer</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { icon: '🔍', title: 'Deep Audits', text: 'Our engine checks for 50+ common UX, SEO, and accessibility issues using rule-based analysis.' },
            { icon: '📊', title: 'Clear Scoring', text: 'Category-specific scores with progress bars and actionable recommendations for every finding.' },
            { icon: '🎓', title: 'Education First', text: 'Integrated learning content and quizzes help you understand the "why" behind every rule.' },
            { icon: '📈', title: 'Progress Tracking', text: 'Track your scores over time and monitor how your website improves with each audit.' }
          ].map((item, i) => (
            <div key={i} style={{ padding: '1.5rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.icon}</div>
              <h4 style={{ marginBottom: '0.5rem' }}>{item.title}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.text}</p>
            </div>
          ))}
        </div>

        <h2 style={{ marginBottom: '1rem' }}>Built With</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {['React', 'Node.js', 'Express', 'MongoDB', 'Cheerio', 'JWT Auth', 'Vite'].map(tech => (
            <span key={tech} style={{
              padding: '0.4rem 1rem', borderRadius: '999px',
              backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)',
              fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)'
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to="/how-it-works" style={{ color: 'var(--primary)', fontWeight: '600' }}>See how the analysis engine works →</Link>
      </div>
    </div>
  );
}

export default About;
