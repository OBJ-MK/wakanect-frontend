import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import '@/styles/animations.css'
import App from './App'

const root = document.getElementById('root')

if (localStorage.getItem('waka_theme') === 'dark' || (!localStorage.getItem('waka_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (reg) => console.log('[SW] enregistré, scope:', reg.scope),
      (err) => console.error('[SW] échec enregistrement:', err),
    );
  });
}
