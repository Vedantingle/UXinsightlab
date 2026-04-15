import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <h1>UX Analyzer – Analyze Your Website UX, SEO & Accessibility</h1>
    <App />
  </StrictMode>,
)
