import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Import global Tailwind and custom styles
import App from './App.jsx'

/**
 * Frontend Entry Point
 * Initializes the React root and renders the main App component
 * StrictMode is enabled for highlighting potential problems in the development lifecycle
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
