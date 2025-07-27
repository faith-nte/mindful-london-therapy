import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render, getPageMeta } = await import('./dist/server/entry-server.js')

// Fetch API data for prerendering
const fetchApiData = async (route) => {
  try {
    if (route === '/blog') {
      const response = await fetch('https://fenn.digital/wp-json/wp/v2/posts?per_page=10&page=1&_embed=true')
      if (response.ok) {
        const posts = await response.json()
        return { posts, hasMore: true }
      }
    } else if (route === '/case-study') {
      const response = await fetch('https://fenn.digital/wp-json/wp/v2/pages?slug=private-psychiatrists-seo&_embed=true')
      if (response.ok) {
        const pages = await response.json()
        return pages.length > 0 ? pages[0] : null
      }
    }
  } catch (error) {
    console.warn(`Failed to fetch API data for ${route}:`, error.message)
  }
  return null
}

// Routes must match those defined in App.tsx
const routesToPrerender = [
  '/',
  '/blog',
  '/case-study'
]

;(async () => {
  for (const url of routesToPrerender) {
    console.log(`Fetching data for ${url}...`)
    const apiData = await fetchApiData(url)
    
    console.log(`Rendering ${url}...`)
    const appHtml = await render(url, apiData);
    const pageMeta = getPageMeta(url, apiData);
    
    // Inject API data as script tag for client-side hydration
    const apiDataScript = apiData 
      ? `<script>window.__SSR_DATA__ = ${JSON.stringify(apiData)};</script>` 
      : ''
    
    // Update meta tags
    let html = template
      .replace(`<!--app-html-->`, appHtml)
      .replace('<title>Dr. Sarah Mitchell - Therapy Services in London</title>', `<title>${pageMeta.title}</title>`)
      .replace(/(<meta name="description" content=")[^"]*(")/g, `$1${pageMeta.description}$2`)
      .replace(/(<meta property="og:title" content=")[^"]*(")/g, `$1${pageMeta.title}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*(")/g, `$1${pageMeta.description}$2`)
      .replace(/(<meta property="og:image" content=")[^"]*(")/g, `$1${pageMeta.ogImage}$2`)
      .replace('</head>', `${apiDataScript}${pageMeta.schema ? `<script type="application/ld+json">${JSON.stringify(pageMeta.schema)}</script>` : ''}<link rel="canonical" href="${pageMeta.canonical}" /></head>`)

    const filePath = `dist${url === '/' ? '/index' : url}.html`
    const fullPath = toAbsolute(filePath)
    
    // Ensure directory exists before writing file
    const dir = path.dirname(fullPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(fullPath, html)
    console.log('pre-rendered:', filePath)
  }
})()