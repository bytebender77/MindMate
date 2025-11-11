import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { DarkModeProvider } from './contexts/DarkModeContext';
import './index.css';

// Set dark mode as default on initial load
const savedDarkMode = localStorage.getItem('darkMode');
const isDarkMode = savedDarkMode !== null ? savedDarkMode === 'true' : true;
if (isDarkMode) {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </StrictMode>
);
