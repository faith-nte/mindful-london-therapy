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
// Look for SSR data to determine if we should hydrate
const hasSSRData = typeof window !== 'undefined' && (window as any).__SSR_DATA__;

if (hasSSRData) {
  // SSR content exists, hydrate it
  console.log('Hydrating with SSR data:', hasSSRData);
  hydrateRoot(root, app);
} else {
  // No SSR content, use createRoot
  console.log('No SSR data, using createRoot');
  createRoot(root).render(app);
}
