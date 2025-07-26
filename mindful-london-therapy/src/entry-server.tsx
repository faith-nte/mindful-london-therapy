import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export async function render(url: string, apiData?: any) {
  // Set global API data for SSR
  if (typeof window === 'undefined') {
    (global as any).__SSR_DATA__ = apiData || {};
  }
  
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
  
  return html;
}