import { useState } from 'react';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
  {
    id: 1,
    title: "The 10 Usability Heuristics for User Interface Design",
    excerpt: "Learn the foundational principles for interaction design developed by Jakob Nielsen — the most widely taught heuristics in the industry.",
    date: "April 10, 2026",
    author: "UX Specialist",
    category: "UX Design",
    readTime: "6 min read",
    icon: "🎨"
  },
  {
    id: 2,
    title: "Why Accessible Design is Good for Business",
    excerpt: "Accessibility isn't just about compliance — it opens your product to a 20% larger global market and often improves usability for everyone.",
    date: "April 12, 2026",
    author: "A11y Expert",
    category: "Accessibility",
    readTime: "5 min read",
    icon: "♿"
  },
  {
    id: 3,
    title: "Semantic HTML: More than just SEO",
    excerpt: "How proper structural markup improves crawlability, assistive technology support, and developer maintainability simultaneously.",
    date: "April 14, 2026",
    author: "Web Architect",
    category: "Technical",
    readTime: "7 min read",
    icon: "🛠️"
  }
];

const CATEGORIES = ['All', 'UX Design', 'Accessibility', 'Technical'];

function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === activeCategory);

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Learning Hub</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem' }}>
          Insights and strategies for building better digital experiences.
        </p>
      </header>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: activeCategory === cat ? 'var(--primary)' : 'var(--border)',
              backgroundColor: activeCategory === cat ? 'var(--primary)' : 'var(--bg-card)',
              color: activeCategory === cat ? 'white' : 'var(--text-muted)',
              fontWeight: activeCategory === cat ? '600' : '500',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
        {filtered.map(post => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="card"
            style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            <div style={{
              height: '180px',
              backgroundColor: 'var(--bg-main)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3.5rem',
              borderBottom: '1px solid var(--border)'
            }}>
              {post.icon}
            </div>
            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--primary)',
                  padding: '3px 12px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  border: '1px solid var(--border)'
                }}>
                  {post.category}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{post.readTime}</span>
              </div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', lineHeight: '1.4' }}>{post.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1, fontSize: '0.9rem', lineHeight: '1.6' }}>
                {post.excerpt}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{post.date}</span>
                <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.875rem' }}>Read →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          No articles in this category yet.
        </div>
      )}
    </div>
  );
}

export default Blog;
