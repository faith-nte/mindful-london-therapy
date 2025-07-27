// ✅ Customised for Cloudflare Pages SSG Deployment
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)


const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');
const { render, getPageMeta } = await import('./dist/server/entry-server.js');

// Define routes based on App.tsx and src/pages
const routesToPrerender = [
  '/',
  '/blog',
  // '/case-study', // Temporarily skip to avoid SSR error
  // Add new pages/blogs here as you create them in src/pages and App.tsx
];

// Use async/await for render
(async () => {
  for (const url of routesToPrerender) {
    // Get meta and SSR data if needed
    let apiData = undefined;
    // Provide mock apiData for /case-study if needed
    if (url === '/case-study') {
      apiData = {
        content: { rendered: '' },
        title: { rendered: 'Case Study' },
        date: '',
        _embedded: {}
      };
    }
    const pageMeta = getPageMeta(url, apiData);
    const appHtml = await render(url, apiData);
    let html = template.replace('<!--app-html-->', appHtml);

    // Update meta tags and inject content
    if (pageMeta && pageMeta.title) {
      html = html.replace(
        '<title>Dr. Sarah Mitchell - Therapy Services in London</title>',
        `<title>${pageMeta.title}</title>`
      );
    }
    if (pageMeta && pageMeta.description) {
      html = html.replace(
        /(<meta name="description" content=")[^"]*(")/g,
        `$1${pageMeta.description}$2`
      );
      html = html.replace(
        /(<meta property="og:description" content=")[^"]*(")/g,
        `$1${pageMeta.description}$2`
      );
    }
    if (pageMeta && pageMeta.title) {
      html = html.replace(
        /(<meta property="og:title" content=")[^"]*(")/g,
        `$1${pageMeta.title}$2`
      );
    }
    if (pageMeta && pageMeta.ogImage) {
      html = html.replace(
        /(<meta property="og:image" content=")[^"]*(")/g,
        `$1${pageMeta.ogImage}$2`
      );
    }
    if (pageMeta && pageMeta.canonical) {
      html = html.replace(
        /(<meta property="og:url" content=")[^"]*(")/g,
        `$1${pageMeta.canonical}$2`
      );
      html = html.replace(
        '</head>',
        `${pageMeta.schema ? `<script type="application/ld+json">${JSON.stringify(pageMeta.schema, null, 2)}</script>` : ''}<link rel="canonical" href="${pageMeta.canonical}" /></head>`
      );
    }

    // Ensure proper viewport and charset
    if (!html.includes('viewport')) {
      html = html.replace('<head>', '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">');
    }
    if (!html.includes('charset')) {
      html = html.replace('<head>', '<head>\n  <meta charset="utf-8">');
    }

    // Ensure subdirectories exist before writing the file
    const filePath = `dist${url === '/' ? '/index' : url}.html`;
    const fullPath = toAbsolute(filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, html);
    console.log('✅ Pre-rendered:', filePath);
  }
})();
