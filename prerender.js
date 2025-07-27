// ✅ Customised for Cloudflare Pages SSG Deployment
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

// Define routes based on App.tsx and src/pages
const routesToPrerender = [
  '/',
  '/blog',
  '/case-study',
  // Add new pages/blogs here as you create them in src/pages and App.tsx
];

;(async () => {
  for (const url of routesToPrerender) {
    const appHtml = render(url)
    const html = template.replace('<!--app-html-->', appHtml)

    // Ensure subdirectories exist before writing the file
    const filePath = `dist${url === '/' ? '/index' : url}.html`
    const fullPath = toAbsolute(filePath)
    const dir = path.dirname(fullPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(fullPath, html)
    console.log('✅ Pre-rendered:', filePath)
  }
})()

    // Update meta tags and inject content
    let html = template
      .replace(`<!--app-html-->`, appHtml)
      .replace(
        "<title>Dr. Sarah Mitchell - Therapy Services in London</title>",
        `<title>${pageMeta.title}</title>`
      )
      .replace(
        /(<meta name="description" content=")[^"]*(")/g,
        `$1${pageMeta.description}$2`
      )
      .replace(
        /(<meta property="og:title" content=")[^"]*(")/g,
        `$1${pageMeta.title}$2`
      )
      .replace(
        /(<meta property="og:description" content=")[^"]*(")/g,
        `$1${pageMeta.description}$2`
      )
      .replace(
        /(<meta property="og:image" content=")[^"]*(")/g,
        `$1${pageMeta.ogImage}$2`
      )
      .replace(
        /(<meta property="og:url" content=")[^"]*(")/g,
        `$1${pageMeta.canonical}$2`
      )
      .replace(
        "</head>",
        `${apiDataScript}${
          pageMeta.schema
            ? `<script type="application/ld+json">${JSON.stringify(
                pageMeta.schema,
                null,
                2
              )}</script>`
            : ""
        }<link rel="canonical" href="${pageMeta.canonical}" /></head>`
      );

    // Ensure proper viewport and charset
    if (!html.includes("viewport")) {
      html = html.replace(
        "<head>",
        '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">'
      );
    }
    if (!html.includes("charset")) {
      html = html.replace("<head>", '<head>\n  <meta charset="utf-8">');
    }

    const filePath = `dist${url === "/" ? "/index" : url}.html`;
    const fullPath = toAbsolute(filePath);

    // Ensure directory exists before writing file
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, html);
    console.log("pre-rendered:", filePath);
  }
})();
