import { Link } from 'react-router-dom';

const CHECKS = [
  {
    category: 'SEO',
    icon: '🔍',
    rules: [
      { name: 'Title Tag', description: 'Checks for the presence, length (50–60 chars), and uniqueness of the <title> element.' },
      { name: 'Meta Description', description: 'Validates that a meta description exists and is within the optimal 120–160 character range.' },
      { name: 'Heading Hierarchy', description: 'Ensures a single <h1> per page and proper sequential heading structure (h1 → h2 → h3).' },
      { name: 'Image Alt Text', description: 'Scans all <img> tags for descriptive alt attributes critical for search and accessibility.' },
      { name: 'Canonical URL', description: 'Checks if a canonical link element is present to prevent duplicate content issues.' },
      { name: 'Open Graph Tags', description: 'Verifies og:title, og:description, and og:image for social media sharing previews.' },
    ]
  },
  {
    category: 'Accessibility',
    icon: '♿',
    rules: [
      { name: 'Language Attribute', description: 'Ensures the <html> element has a valid lang attribute for screen readers.' },
      { name: 'Form Labels', description: 'Checks that every <input> has an associated <label> or aria-label.' },
      { name: 'ARIA Landmarks', description: 'Validates proper use of role attributes and ARIA landmarks for assistive navigation.' },
      { name: 'Contrast Ratio', description: 'Evaluates text-to-background color contrast against WCAG 2.1 AA standards (4.5:1).' },
      { name: 'Keyboard Focus', description: 'Checks for visible focus indicators on interactive elements.' },
    ]
  },
  {
    category: 'UX & Performance',
    icon: '⚡',
    rules: [
      { name: 'Viewport Meta', description: 'Ensures the viewport meta tag is present for correct mobile rendering.' },
      { name: 'Responsive Design', description: 'Detects CSS media queries or responsive frameworks in the stylesheet.' },
      { name: 'Navigation Clarity', description: 'Checks for the presence of <nav> element and properly structured internal links.' },
      { name: 'Content Length', description: 'Evaluates if the page has sufficient body content (word count, paragraph structure).' },
      { name: 'External Links', description: 'Validates that outbound links use target="_blank" with rel="noopener noreferrer".' },
    ]
  }
];

function HowItWorks() {
  return (
    <div className="container" style={{ maxWidth: '900px', padding: '5rem 1.5rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>How It Works</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.7', maxWidth: '650px', margin: '0 auto' }}>
          UXAnalyzer uses a rule-based engine to crawl and evaluate your website against industry standards. Here's exactly what happens under the hood.
        </p>
      </header>

      {/* Pipeline Steps */}
      <div className="card" style={{ padding: '3rem', marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '2.5rem' }}>The Analysis Pipeline</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {[
            { step: '01', title: 'Fetch & Parse', text: 'We send an HTTP request to your URL using Axios, then parse the raw HTML response into a structured DOM tree using Cheerio (a server-side jQuery implementation).' },
            { step: '02', title: 'Rule Engine', text: 'The parsed DOM is evaluated against 50+ automated checks organized into three categories: SEO, Accessibility, and UX. Each check produces a pass/fail result with a weighted score impact.' },
            { step: '03', title: 'Score Calculation', text: 'Starting from a base score of 100, each failed check deducts a weighted number of points. Category scores are calculated independently. The overall score is the weighted average.' },
            { step: '04', title: 'Report Generation', text: 'The engine compiles a structured report with a scan summary, category breakdowns, heuristic analysis, strengths, areas for improvement, and detailed audit findings with "why it matters" and "how to fix" explanations.' },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{
                fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)',
                backgroundColor: 'var(--bg-main)', width: '50px', height: '50px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-md)', flexShrink: 0, border: '1px solid var(--border)'
              }}>
                {item.step}
              </div>
              <div>
                <h4 style={{ marginBottom: '0.5rem' }}>{item.title}</h4>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules & Checks */}
      <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Rules & Checks</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {CHECKS.map((group, gi) => (
          <div key={gi} className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{group.icon}</span>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{group.category}</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {group.rules.map((rule, ri) => (
                <div key={ri} style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <h5 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>{rule.name}</h5>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{rule.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Scoring explanation */}
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem' }}>Scoring Methodology</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Each rule has a weighted score impact (typically 3–15 points). Minor issues like missing alt text on decorative images deduct fewer points, while critical issues like missing viewport meta or no heading hierarchy carry heavier penalties. The final score is capped between 0–100.
        </p>
        <Link to="/" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>Try it yourself →</Link>
      </div>
    </div>
  );
}

export default HowItWorks;
