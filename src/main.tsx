import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const root = document.getElementById("root")!;
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Check if this is a hydration or initial render
// If there's SSR content, hydrate; otherwise, create new root
if (root.innerHTML.includes('<!--app-html-->') || root.innerHTML.trim() === '') {
  // No SSR content, use createRoot
  createRoot(root).render(app);
} else {
  // SSR content exists, hydrate it
  hydrateRoot(root, app);
}
