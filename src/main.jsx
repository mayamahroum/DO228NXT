import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Version2 from './Version2.jsx'

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

createRoot(document.getElementById('root')).render(
  window.location.pathname.startsWith('/version2') ? <Version2 /> : <App />,
)
