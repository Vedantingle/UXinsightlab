const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Question = require('../models/Question');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uxanalyzer';
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const questions = [
  // --- UX CATEGORY ---
  {
    questionText: 'What is the primary purpose of responsive design?',
    options: ['To make a website load faster', 'To provide a consistent experience across screen sizes', 'To improve SEO exclusively', 'To increase image sizes'],
    correctOptionIndex: 1,
    explanation: 'Responsive design adjusts the layout to fit different screen sizes, ensuring a seamless experience.',
    category: 'UX',
    difficulty: 'Beginner'
  },
  {
    questionText: 'What is "Fitts\'s Law" primarily concerned with in UX?',
    options: ['Color theory', 'Typography', 'Target size and distance', 'Loading speed'],
    correctOptionIndex: 2,
    explanation: 'Fitts\'s Law states that the time to acquire a target is a function of the distance to and size of the target.',
    category: 'UX',
    difficulty: 'Advanced'
  },
  {
    questionText: 'Which type of research focuses on "Why" users behave a certain way?',
    options: ['Quantitative', 'Qualitative', 'A/B Testing', 'Analytics'],
    correctOptionIndex: 1,
    explanation: 'Qualitative research (interviews, usability tests) helps understand user motivations and behaviors.',
    category: 'UX',
    difficulty: 'Intermediate'
  },
  {
    questionText: 'According to Jakob Nielsen, how many users are usually enough to find 80% of usability issues?',
    options: ['5', '20', '50', '100'],
    correctOptionIndex: 0,
    explanation: 'Nielsen\'s research shows that testing with just 5 users can reveal about 80% of usability problems.',
    category: 'UX',
    difficulty: 'Intermediate'
  },
  {
    questionText: 'What is a "Heuristic Evaluation"?',
    options: ['A system performance test', 'A usability inspection method by experts', 'An automated code scan', 'A user interview session'],
    correctOptionIndex: 1,
    explanation: 'Heuristic evaluation involves usability experts judging an interface against established principles (heuristics).',
    category: 'UX',
    difficulty: 'Advanced'
  },
  {
    questionText: 'What is the "Mental Model" in UX design?',
    options: ['The designers thought process', 'How a user thinks a system works', 'The speed of the server', 'A prototype layout'],
    correctOptionIndex: 1,
    explanation: 'A mental model is the users internal understanding of how a system or product should function based on past experience.',
    category: 'UX',
    difficulty: 'Intermediate'
  },
  {
    questionText: 'What is "Cognitive Load"?',
    options: ['The weight of a device', 'The amount of mental effort used in working memory', 'The speed of a internet connection', 'The number of images on a page'],
    correctOptionIndex: 1,
    explanation: 'Cognitive load refers to the mental effort required to complete a task. Designers aim to minimize it for better UX.',
    category: 'UX',
    difficulty: 'Advanced'
  },

  // --- SEO CATEGORY ---
  {
    questionText: 'Which HTML element is best for improving search visibility of an image?',
    options: ['title', 'class', 'alt', 'id'],
    correctOptionIndex: 2,
    explanation: 'The alt attribute provides alternative text for search engines to index image content.',
    category: 'SEO',
    difficulty: 'Beginner'
  },
  {
    questionText: 'What is the ideal length for a Meta Description tag?',
    options: ['10-30 characters', '50-160 characters', '300-500 characters', 'As long as possible'],
    correctOptionIndex: 1,
    explanation: 'While there is no hard limit, search engines typicaly truncate description snippets longer than ~160 characters.',
    category: 'SEO',
    difficulty: 'Beginner'
  },
  {
    questionText: 'What are "LSI Keywords" in SEO?',
    options: ['Low Surface Indexing', 'Latent Semantic Indexing', 'Linked Site Indicators', 'Large Scale Interactions'],
    correctOptionIndex: 1,
    explanation: 'LSI keywords are conceptually related terms that search engines use to understand content deeply.',
    category: 'SEO',
    difficulty: 'Intermediate'
  },
  {
    questionText: 'What does "Dwell Time" refer to?',
    options: ['Time taken to load a page', 'Amount of time a user spends on a page before returning to results', 'Time between site updates', 'Server uptime percentage'],
    correctOptionIndex: 1,
    explanation: 'Dwell time is the duration between clicking a search result and clicking "back" to the results page.',
    category: 'SEO',
    difficulty: 'Intermediate'
  },
  {
    questionText: 'What is "Canonicalization" used for?',
    options: ['To speed up database queries', 'To handle duplicate content on different URLs', 'To translate text', 'To minify CSS files'],
    correctOptionIndex: 1,
    explanation: 'Canonical tags tell search engines which version of a URL is the master one, preventing duplicate content issues.',
    category: 'SEO',
    difficulty: 'Advanced'
  },
  {
    questionText: 'What is the primary factor for Ranking in Google localized search?',
    options: ['Social media followers', 'Relevance, Distance, and Prominence', 'Number of animations on page', 'Font size of the header'],
    correctOptionIndex: 1,
    explanation: 'Google local search results are based on how well a business matches the search, its physical distance, and its overall fame.',
    category: 'SEO',
    difficulty: 'Advanced'
  },

  // --- ACCESSIBILITY CATEGORY ---
  {
    questionText: 'What does a Contrast Ratio of 4.5:1 indicate in WCAG guidelines?',
    options: ['Minimum contrast for normal text', 'Ideal contrast for headlines', 'Failing grade for accessibility', 'Exact contrast of black on white'],
    correctOptionIndex: 0,
    explanation: 'WCAG 2.1 Level AA requires a 4.5:1 ratio for normal text to ensure readability for users with low vision.',
    category: 'Accessibility',
    difficulty: 'Intermediate'
  },
  {
    questionText: 'What is the "TAB" key primarily used for in web accessibility?',
    options: ['Closing the browser', 'Navigating through interactive elements', 'Opening the console', 'Adding spaces to text'],
    correctOptionIndex: 1,
    explanation: 'Keyboard users (and screen readers) rely on the Tab key to move focus through links, buttons, and form inputs.',
    category: 'Accessibility',
    difficulty: 'Beginner'
  },
  {
    questionText: 'What does "ARIA" stand for in web standards?',
    options: ['Advanced Responsive Interface Application', 'Accessible Rich Internet Applications', 'Alternative Research In Accessibility', 'Automated Routing and Interaction Agency'],
    correctOptionIndex: 1,
    explanation: 'ARIA is a set of attributes that define ways to make web content and applications more accessible.',
    category: 'Accessibility',
    difficulty: 'Intermediate'
  },
  {
    questionText: 'Why should you avoid using "Click Here" as link text?',
    options: ['It is too many characters', 'It provides zero context for screen reader users', 'It is not a valid CSS selector', 'It slows down SEO indexing'],
    correctOptionIndex: 1,
    explanation: 'Descriptive links (e.g., "Download our UX Guide") tell users what they are clicking, which is vital for accessibility.',
    category: 'Accessibility',
    difficulty: 'Beginner'
  },
  {
    questionText: 'What is "Focus Trapping"?',
    options: ['A bug that stops mouse movement', 'Restricting keyboard focus within a specific element (like a modal)', 'Capturing user mouse clicks', 'Freezing the screen until a video ends'],
    correctOptionIndex: 1,
    explanation: 'Focus trapping ensures that when a modal is open, a keyboard user stays within the modal for navigation.',
    category: 'Accessibility',
    difficulty: 'Advanced'
  },
  {
    questionText: 'Which tool is built-in to Chrome for auditing accessibility?',
    options: ['Lighthouse', 'Photoshop', 'Postman', 'Notepad++'],
    correctOptionIndex: 0,
    explanation: 'Chrome DevTools includes Lighthouse, which can perform automated accessibility audits.',
    category: 'Accessibility',
    difficulty: 'Beginner'
  }
];

const seedDB = async () => {
  await connectDB();
  try {
    console.log('Clearing old questions...');
    await Question.deleteMany();
    console.log(`Inserting ${questions.length} balanced questions...`);
    await Question.insertMany(questions);
    console.log('Seed data inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedDB();
