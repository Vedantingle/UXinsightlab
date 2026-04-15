import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EDUCATIONAL_CONTENT = {
  'UX': {
    title: 'UX Design Fundamentals',
    description: 'Understanding how humans interact with digital products is the cornerstone of great design.',
    concepts: [
      { title: 'Fitts\'s Law', text: 'The time to acquire a target is a function of the distance to and size of the target. Larger, closer targets are faster to click.' },
      { title: 'Mental Models', text: 'Users base their behavior on what they already know from other products. Design with familiar patterns to reduce friction.' },
      { title: 'Cognitive Load', text: 'Minimize mental effort by using established patterns, clear visual hierarchy, and consistent feedback.' },
      { title: 'Hick\'s Law', text: 'The more choices you present, the longer it takes to make a decision. Simplify options to speed up user actions.' }
    ],
    resources: [
      { label: 'Nielsen Norman Group', url: 'https://www.nngroup.com/articles/' },
      { label: 'Laws of UX', url: 'https://lawsofux.com/' }
    ]
  },
  'SEO': {
    title: 'Search Engine Optimization',
    description: 'Learn the technical and semantic strategies that help search engines discover, understand, and rank your content.',
    concepts: [
      { title: 'Semantic Keywords', text: 'Search engines analyze conceptually related terms, not just exact word matches. Use natural language and related topics.' },
      { title: 'Metadata Optimization', text: 'Titles and descriptions directly influence click-through rates in search results. Keep them concise and compelling.' },
      { title: 'Crawlability', text: 'Bots need a clear internal link structure and a sitemap to index your site efficiently.' },
      { title: 'Core Web Vitals', text: 'Google uses page speed metrics (LCP, FID, CLS) as ranking signals. Optimize performance for better visibility.' }
    ],
    resources: [
      { label: 'Google Search Central', url: 'https://developers.google.com/search' },
      { label: 'Ahrefs SEO Guide', url: 'https://ahrefs.com/blog/seo-basics/' }
    ]
  },
  'Accessibility': {
    title: 'Web Accessibility (A11y)',
    description: 'Building for accessibility ensures your product works for everyone, including the 1 billion+ people worldwide living with disabilities.',
    concepts: [
      { title: 'WCAG Principles', text: 'Web content must be Perceivable, Operable, Understandable, and Robust (POUR). These four pillars guide all accessibility work.' },
      { title: 'ARIA Roles', text: 'Special attributes that describe the function of complex UI elements to assistive technologies like screen readers.' },
      { title: 'Keyboard Navigation', text: 'Interactive sites must be fully usable without a mouse, via Tab, Enter, Escape, and arrow keys.' },
      { title: 'Color Contrast', text: 'Text must have a minimum contrast ratio (4.5:1 for normal text) to be readable by people with low vision.' }
    ],
    resources: [
      { label: 'W3C Accessibility Standards', url: 'https://www.w3.org/WAI/standards-guidelines/' },
      { label: 'A11y Project', url: 'https://www.a11yproject.com/' }
    ]
  },
  'All': {
    title: 'Holistic Web Quality',
    description: 'Great websites balance performance, accessibility, SEO, and user experience seamlessly.',
    concepts: [
      { title: 'Holistic Design', text: 'Consider all dimensions — speed, accessibility, discoverability, and usability — as interconnected.' },
      { title: 'Progressive Enhancement', text: 'Start with a solid HTML foundation and layer on CSS and JavaScript so the core experience always works.' },
      { title: 'Performance Budgets', text: 'Set limits on page weight and load times to maintain quality as features grow.' }
    ],
    resources: [
      { label: 'Web.dev by Google', url: 'https://web.dev/learn/' }
    ]
  }
};

const getLevelTag = (score) => {
  if (!score && score !== 0) return { label: 'Newcomer', emoji: '🌱', color: 'var(--text-muted)' };
  if (score >= 90) return { label: 'Expert', emoji: '🏆', color: '#16a34a' };
  if (score >= 70) return { label: 'Advanced', emoji: '⭐', color: '#2563eb' };
  if (score >= 50) return { label: 'Intermediate', emoji: '📘', color: '#d97706' };
  return { label: 'Beginner', emoji: '🌱', color: '#64748b' };
};

function Quiz() {
  const { user } = useAuth();
  const [step, setStep] = useState('LEARN'); // LEARN, SELECT, QUIZ, RESULTS
  const [filters, setFilters] = useState({ category: 'All', difficulty: 'All' });
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userAnswer, setUserAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [maxPossibleScore, setMaxPossibleScore] = useState(0);
  const [lastQuizResult, setLastQuizResult] = useState(null);
  const [missedItems, setMissedItems] = useState([]);

  useEffect(() => {
    const fetchLastResult = async () => {
      if (user) {
        try {
          const res = await axios.get('https://uxinsightlab.onrender.com/api/users/profile');
          if (res.data.user.lastQuizResult) {
            setLastQuizResult(res.data.user.lastQuizResult);
            return;
          }
        } catch (err) {
          console.error('Failed to fetch user quiz result from profile');
        }
      }
      const saved = localStorage.getItem('lastQuizResult');
      if (saved) setLastQuizResult(JSON.parse(saved));
    };
    fetchLastResult();
  }, [user]);

  const difficultyWeights = { 'Beginner': 10, 'Intermediate': 20, 'Advanced': 40 };

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { category, difficulty } = filters;
      const res = await axios.get(`https://uxinsightlab.onrender.com/api/quiz?category=${category}&difficulty=${difficulty}`);
      setQuestions(res.data);
      setCurrentIndex(0);
      setScore(0);
      setMissedItems([]);
      setMaxPossibleScore(res.data.reduce((acc, q) => acc + (difficultyWeights[q.difficulty] || 10), 0));
      setStep('QUIZ');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelection = async (index) => {
    if (userAnswer !== null) return;
    setUserAnswer(index);
    const currentQ = questions[currentIndex];
    try {
      const res = await axios.post('https://uxinsightlab.onrender.com/api/quiz/check', {
        questionId: currentQ._id,
        answerIndex: index
      });
      setFeedback(res.data);
      if (res.data.isCorrect) {
        setScore(prev => prev + (difficultyWeights[currentQ.difficulty] || 10));
      } else {
        setMissedItems(prev => [...prev, {
          question: currentQ.questionText,
          yourAnswer: currentQ.options[index],
          correctAnswer: currentQ.options[res.data.correctOptionIndex],
          explanation: res.data.explanation
        }]);
      }
    } catch (err) {
      console.error('Answer check failed', err);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer(null);
      setFeedback(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const percentage = Math.round((score / maxPossibleScore) * 100);
    const result = { score: percentage, category: filters.category, difficulty: filters.difficulty, date: new Date() };
    if (user) {
      try { await axios.post('https://uxinsightlab.onrender.com/api/users/quiz-result', result); }
      catch (err) { console.error('Failed to save quiz result to profile'); }
    } else {
      localStorage.setItem('lastQuizResult', JSON.stringify({ ...result, date: new Date().toLocaleDateString() }));
    }
    setLastQuizResult(result);
    setStep('RESULTS');
  };

  const level = getLevelTag(lastQuizResult?.score);

  // ─── STEP 1: LEARN (Landing) ──────────────────────────────────────────
  if (step === 'LEARN') {
    const content = EDUCATIONAL_CONTENT[filters.category];
    return (
      <div className="container" style={{ maxWidth: '900px', padding: '4rem 1.5rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.75rem', marginBottom: '1rem' }}>Learning Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
            Master the fundamentals of UX, SEO, and Accessibility through curated lessons and interactive quizzes.
          </p>
        </header>

        {/* Level badge */}
        {lastQuizResult && (
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{level.emoji}</span>
              <div>
                <div style={{ fontWeight: '700', color: level.color, fontSize: '1.1rem' }}>{level.label}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Last score: {lastQuizResult.score}% in {lastQuizResult.category}</div>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{lastQuizResult.score}%</div>
          </div>
        )}

        {/* Category picker */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {['All', 'UX', 'SEO', 'Accessibility'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilters({ ...filters, category: cat })}
              style={{
                padding: '0.6rem 1.25rem', borderRadius: '999px', cursor: 'pointer',
                border: '1px solid',
                borderColor: filters.category === cat ? 'var(--primary)' : 'var(--border)',
                backgroundColor: filters.category === cat ? 'var(--primary)' : 'var(--bg-card)',
                color: filters.category === cat ? 'white' : 'var(--text-muted)',
                fontWeight: '600', fontSize: '0.875rem',
              }}
            >
              {cat === 'All' ? 'All Topics' : cat}
            </button>
          ))}
        </div>

        {/* Learning content */}
        <div className="card" style={{ padding: '3rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.75rem', fontSize: '1.75rem' }}>{content.title}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: '1.6' }}>{content.description}</p>

          <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Key Concepts</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
            {content.concepts.map((c, i) => (
              <div key={i} style={{ padding: '1.25rem 1.5rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '1rem' }}>{c.title}</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{c.text}</p>
              </div>
            ))}
          </div>

          <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Recommended Reading</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {content.resources.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)',
                  color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem',
                }}>
                {r.label} →
              </a>
            ))}
          </div>
        </div>

        {/* CTA to take quiz */}
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '0.75rem' }}>Ready to test your knowledge?</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Take a short quiz to see how well you've absorbed the concepts above.</p>
          <button onClick={() => setStep('SELECT')} className="btn-primary" style={{ padding: '0.875rem 2.5rem', fontSize: '1.05rem' }}>
            Take the Quiz →
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP 2: SELECT DIFFICULTY ────────────────────────────────────────
  if (step === 'SELECT') {
    return (
      <div className="container" style={{ maxWidth: '550px', padding: '4rem 1.5rem' }}>
        <div className="card" style={{ padding: '3rem' }}>
          <button onClick={() => setStep('LEARN')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', marginBottom: '2rem', fontSize: '0.9rem' }}>
            ← Back to Learning
          </button>
          <h2 style={{ marginBottom: '0.5rem' }}>Configure Quiz</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Category: <strong>{filters.category}</strong></p>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Difficulty</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFilters({ ...filters, difficulty: lvl })}
                  style={{
                    flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: filters.difficulty === lvl ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: filters.difficulty === lvl ? 'var(--primary)' : 'var(--bg-card)',
                    color: filters.difficulty === lvl ? 'white' : 'var(--text-main)',
                    cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {error && <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</p>}

          <button onClick={fetchQuestions} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}>
            {loading ? 'Loading...' : 'Start Quiz'}
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP 3: QUIZ ─────────────────────────────────────────────────────
  if (step === 'QUIZ') {
    const q = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
      <div className="container" style={{ maxWidth: '700px', padding: '4rem 1.5rem' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>Question {currentIndex + 1} of {questions.length}</span>
            <span className="badge" style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{q.category} • {q.difficulty}</span>
          </div>

          <div style={{ height: '6px', backgroundColor: 'var(--bg-main)', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
          </div>

          <h3 style={{ marginBottom: '2rem', lineHeight: '1.5', fontSize: '1.15rem' }}>{q.questionText}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {q.options.map((opt, idx) => {
              let bg = 'var(--bg-card)';
              let borderColor = 'var(--border)';
              if (userAnswer === idx) {
                bg = feedback?.isCorrect ? '#dcfce7' : '#fee2e2';
                borderColor = feedback?.isCorrect ? '#22c55e' : '#ef4444';
              } else if (feedback && idx === feedback.correctOptionIndex) {
                bg = '#dcfce7'; borderColor = '#22c55e';
              }
              return (
                <button key={idx} onClick={() => handleAnswerSelection(idx)} disabled={userAnswer !== null}
                  style={{
                    padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)',
                    border: `2px solid ${borderColor}`, backgroundColor: bg,
                    textAlign: 'left', fontSize: '0.95rem',
                    cursor: userAnswer === null ? 'pointer' : 'default',
                    color: 'var(--text-main)', transition: 'all 0.15s',
                  }}>
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: 'var(--radius-md)', backgroundColor: feedback.isCorrect ? '#f0fdf4' : '#fef2f2', border: `1px solid ${feedback.isCorrect ? '#bbf7d0' : '#fecaca'}` }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: feedback.isCorrect ? '#166534' : '#991b1b', fontSize: '1rem' }}>
                {feedback.isCorrect ? '✨ Correct!' : '❌ Incorrect'}
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{feedback.explanation}</p>
              <button onClick={nextQuestion} className="btn-primary" style={{ marginTop: '1.25rem', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── STEP 4: RESULTS ──────────────────────────────────────────────────
  if (step === 'RESULTS') {
    const percentage = Math.round((score / maxPossibleScore) * 100);
    const content = EDUCATIONAL_CONTENT[filters.category];
    const resultLevel = getLevelTag(percentage);

    return (
      <div className="container" style={{ maxWidth: '800px', padding: '4rem 1.5rem' }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{resultLevel.emoji}</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Quiz Completed!</h2>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)', margin: '0.5rem 0' }}>{percentage}%</div>
          <div style={{ display: 'inline-block', padding: '0.4rem 1rem', borderRadius: '999px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)', fontWeight: '600', color: resultLevel.color, fontSize: '0.9rem', marginBottom: '2rem' }}>
            {resultLevel.emoji} {resultLevel.label}
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={fetchQuestions} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>Try Again</button>
            <button onClick={() => setStep('LEARN')}
              style={{ padding: '0.75rem 2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>
              Back to Learning
            </button>
          </div>
        </div>

        {missedItems.length > 0 && (
          <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--error)' }}>📉 Improvement Plan</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Review the concepts you missed to strengthen your {filters.category} knowledge.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {missedItems.map((item, i) => (
                <div key={i} style={{ padding: '1.5rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--error)' }}>
                  <strong style={{ display: 'block', marginBottom: '0.75rem' }}>Q: {item.question}</strong>
                  <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--error)' }}><strong>Your Answer:</strong> {item.yourAnswer}</span>
                    <span style={{ color: 'var(--success)' }}><strong>Correct:</strong> {item.correctAnswer}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}><strong>Tip:</strong> {item.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>📚 Dive Deeper into {filters.category}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {content.resources.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', color: 'var(--primary)', fontWeight: '600', textAlign: 'center', fontSize: '0.9rem' }}>
                {r.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default Quiz;
