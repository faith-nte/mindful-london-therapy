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
// Look for SSR hydration markers to determine if we should hydrate
if (root.innerHTML.includes('<!--ssr-hydrated-->')) {
  // SSR content exists, hydrate it
  hydrateRoot(root, app);
} else {
  // No SSR content, use createRoot
  createRoot(root).render(app);
}
