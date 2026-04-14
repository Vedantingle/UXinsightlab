import { useParams, Link } from 'react-router-dom';

const BLOG_CONTENT = {
  "1": {
    title: "The 10 Usability Heuristics for User Interface Design",
    author: "UX Specialist",
    date: "April 10, 2026",
    category: "UX Design",
    content: (
      <>
        <p>In the world of user experience design, consistency and clarity are king. One of the most influential frameworks for evaluating usability was developed by Jakob Nielsen in the early 90s. These ten general principles for interaction design are called "heuristics" because they are broad rules of thumb and not specific usability guidelines.</p>
        
        <h3>1. Visibility of system status</h3>
        <p>The system should always keep users informed about what is going on, through appropriate feedback within a reasonable time. For example, a progress bar helps users understand how long a process will take.</p>
        
        <h3>2. Match between system and the real world</h3>
        <p>The system should speak the users' language, with words, phrases, and concepts familiar to the user, rather than system-oriented terms. Follow real-world conventions, making information appear in a natural and logical order.</p>
        
        <h3>3. User control and freedom</h3>
        <p>Users often choose system functions by mistake and will need a clearly marked "emergency exit" to leave the unwanted state without having to go through an extended dialogue. Support undo and redo.</p>
        
        <h3>4. Consistency and standards</h3>
        <p>Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform conventions.</p>
        
        <h3>5. Error prevention</h3>
        <p>Even better than good error messages is a careful design which prevents a problem from occurring in the first place. Either eliminate error-prone conditions or check for them and present users with a confirmation option before they commit to the action.</p>
      </>
    )
  },
  "2": {
    title: "Why Accessible Design is Good for Business",
    author: "A11y Expert",
    date: "April 12, 2026",
    category: "Accessibility",
    content: (
      <>
        <p>Accessibility is often treated as a checklist for legal compliance, but it's actually a powerful driver for innovation and business growth. When you design for the most extreme use cases, you often end up creating products that are better for everyone.</p>
        
        <h3>Inclusive design reaches more people</h3>
        <p>Over 1 billion people worldwide live with some form of disability. By making your website accessible, you are essentially opening your storefront to a significant portion of the global population that might otherwise be locked out.</p>
        
        <h3>SEO and Accessibility are siblings</h3>
        <p>Many accessibility best practices (like semantic HTML, alt text for images, and clear heading structures) are exactly what search engine crawlers look for. Accessible sites often rank better because they are easier for bots to understand.</p>
        
        <h3>Brand Reputation</h3>
        <p>Commitment to inclusion sends a strong message about your brand values. In an era where consumers value social responsibility, being an accessibility leader can set your business apart.</p>
      </>
    )
  },
  "3": {
    title: "Semantic HTML: More than just SEO",
    author: "Web Architect",
    date: "April 14, 2026",
    category: "Technical",
    content: (
      <>
        <p>In the rush to build complex React applications, developers often forget the humblest but most important part of the web stack: HTML. Semantic HTML is the use of HTML markup to reinforce the semantics, or meaning, of the information in webpages and web applications rather than merely to define its look or appearance.</p>
        
        <h3>Why use Semantic HTML?</h3>
        <ul>
          <li><strong>Accessibility:</strong> Assistive technologies (like screen readers) use semantic tags to navigate content.</li>
          <li><strong>Maintainability:</strong> It's much easier to read a file with &lt;header&gt;, &lt;main&gt;, and &lt;footer&gt; than one with nested &lt;div&gt; tags.</li>
          <li><strong>SEO:</strong> As mentioned before, search engines give higher weight to keywords inside clear semantic tags like &lt;h1&gt; or &lt;article&gt;.</li>
        </ul>
        
        <p>Stop using &lt;div&gt; for buttons. Use &lt;button&gt;. It comes with built-in keyboard support and focuses for free. Your users (and your crawler) will thank you.</p>
      </>
    )
  }
};

function BlogPost() {
  const { id } = useParams();
  const post = BLOG_CONTENT[id];

  if (!post) return <div className="container">Post not found</div>;

  return (
    <article className="container" style={{ maxWidth: '800px', padding: '5rem 1.5rem' }}>
      <Link to="/blog" style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '2rem', display: 'inline-block' }}>← Back to Blog</Link>
      
      <header style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span className="badge" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--primary)', border: '1px solid var(--border)' }}>{post.category}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{post.date} • By {post.author}</span>
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>{post.title}</h1>
      </header>

      <div style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
        {post.content}
      </div>

      <footer style={{ marginTop: '5rem', padding: '3rem 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <h3>Want to analyze your site?</h3>
        <p style={{ marginBottom: '2rem' }}>Get a professional UX audit in seconds.</p>
        <Link to="/" className="btn-primary">Go to Analyzer</Link>
      </footer>
    </article>
  );
}

export default BlogPost;
