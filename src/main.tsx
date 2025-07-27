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

// Always use createRoot to avoid SSR/CSR mismatch issues
// The SSR data is handled within components via window.__SSR_DATA__
createRoot(root).render(app);
