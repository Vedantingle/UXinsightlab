import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function Navbar() {
  const { user, theme, toggleTheme } = useAuth();
  const location = useLocation();

  const navLink = (to, label) => (
    <Link to={to} style={{
      color: location.pathname === to || location.pathname.startsWith(to + '/') 
        ? 'var(--text-main)' 
        : 'var(--text-muted)',
      fontWeight: location.pathname === to ? '600' : '500',
      fontSize: '0.95rem',
    }}>
      {label}
    </Link>
  );

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 2rem',
      backgroundColor: 'var(--nav-bg)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border)',
      height: '68px',
    }}>
      {/* Logo + Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontWeight: '800', fontSize: '1.35rem',
          color: 'var(--primary)', letterSpacing: '-0.025em'
        }}>
          {/* Simple SVG logo mark */}
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect width="26" height="26" rx="6" fill="var(--primary)" />
            <path d="M6 18L10 10L14 15L17 12L20 18H6Z" fill="white" />
          </svg>
          UXAnalyzer
        </Link>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {navLink('/', 'Home')}
          {navLink('/learning', 'Learning')}
          {navLink('/blog', 'Blog')}
          {navLink('/how-it-works', 'How it Works')}
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Theme toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {user ? (
          <>
            <Link to="/dashboard" style={{
              fontSize: '0.9rem', fontWeight: '500',
              color: location.pathname === '/dashboard' ? 'var(--text-main)' : 'var(--text-muted)',
            }}>
              Dashboard
            </Link>
            <Link to="/profile" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: 'var(--bg-main)',
              padding: '5px 12px',
              borderRadius: '999px',
              border: '1px solid var(--border)',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-main)',
            }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                background: 'var(--primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: '700'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              {user.name.split(' ')[0]}
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-card)',
      borderTop: '1px solid var(--border)',
      padding: '4rem 0 2rem',
      marginTop: 'auto',
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
              <rect width="26" height="26" rx="6" fill="var(--primary)" />
              <path d="M6 18L10 10L14 15L17 12L20 18H6Z" fill="white" />
            </svg>
            <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)' }}>UXAnalyzer</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            The professional toolkit for web optimization. Data-driven audits for modern teams.
          </p>
        </div>
        <div>
          <h5 style={{ marginBottom: '1.25rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Product</h5>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Analyzer</Link></li>
            <li><Link to="/learning" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Learning</Link></li>
            <li><Link to="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h5 style={{ marginBottom: '1.25rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Resources</h5>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><Link to="/blog" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Blog</Link></li>
            <li><Link to="/how-it-works" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>How it Works</Link></li>
            <li><Link to="/about" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>About</Link></li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        © 2026 UXAnalyzer. All rights reserved.
      </div>
    </footer>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              {/* Learning = renamed Quiz */}
              <Route path="/learning" element={<Quiz />} />
              <Route path="/quiz" element={<Navigate to="/learning" replace />} />
              <Route path="/dashboard" element={
                <PrivateRoute><Dashboard /></PrivateRoute>
              } />
              <Route path="/report/:id" element={
                <PrivateRoute><Report /></PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute><Profile /></PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
