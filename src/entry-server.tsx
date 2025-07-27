import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

// Page-specific meta data
const getPageMeta = (url: string, apiData?: any) => {
  const baseUrl = "https://yourdomain.com"; // Update with your actual domain

  switch (url) {
    case "/":
      return {
        title: "Dr. Sarah Mitchell - Professional Therapy Services in London",
        description:
          "Professional therapy services in central London. Dr. Sarah Mitchell offers individual, couples, and group therapy with evidence-based approaches. BACP accredited.",
        ogImage: `${baseUrl}/og-home.jpg`,
        canonical: baseUrl,
        schema: {
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          name: "Dr. Sarah Mitchell Therapy Services",
          description: "Professional therapy services in central London",
          address: {
            "@type": "PostalAddress",
            addressLocality: "London",
            addressCountry: "UK",
          },
          telephone: "+44-XXX-XXX-XXXX",
        },
      };

    case "/blog":
      return {
        title: "Therapy Blog - Mental Health Articles by Dr. Sarah Mitchell",
        description:
          "Read expert insights on mental health, therapy techniques, and psychological wellbeing from Dr. Sarah Mitchell. Evidence-based articles on anxiety, depression, and more.",
        ogImage: `${baseUrl}/og-blog.jpg`,
        canonical: `${baseUrl}/blog`,
        schema: {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Dr. Sarah Mitchell Therapy Blog",
          description: "Expert insights on mental health and therapy",
          author: {
            "@type": "Person",
            name: "Dr. Sarah Mitchell",
            jobTitle: "Chartered Clinical Psychologist",
            affiliation: "BACP",
          },
          mainEntity: apiData?.posts
            ? apiData.posts.map((post: any) => ({
                "@type": "BlogPosting",
                headline: post.title.rendered,
                description: post.excerpt.rendered
                  .replace(/<[^>]*>/g, "")
                  .substring(0, 160),
                datePublished: post.date,
                author: {
                  "@type": "Person",
                  name: "Dr. Sarah Mitchell",
                },
              }))
            : [],
        },
      };

    case "/case-study":
      return {
        title:
          "SEO Case Study - Private Psychiatrists Digital Marketing Success",
        description:
          "Discover how our SEO strategy helped private psychiatrists increase their online visibility by 300%. Learn proven digital marketing techniques for healthcare professionals.",
        ogImage: `${baseUrl}/og-case-study.jpg`,
        canonical: `${baseUrl}/case-study`,
        schema: {
          "@context": "https://schema.org",
          "@type": "Article",
          headline:
            "SEO Case Study - Private Psychiatrists Digital Marketing Success",
          author: {
            "@type": "Person",
            name: "Dr. Sarah Mitchell",
          },
          datePublished: "2024-01-01",
        },
      };

    default:
      return {
        title: "Dr. Sarah Mitchell - Therapy Services in London",
        description:
          "Professional therapy services in central London. Dr. Sarah Mitchell offers individual, couples, and group therapy with evidence-based approaches. BACP accredited.",
        ogImage: `${baseUrl}/og-home.jpg`,
        canonical: baseUrl,
        schema: null,
      };
  }
};

export async function render(url: string, apiData?: any) {
  // Set global API data for SSR
  if (typeof window === "undefined") {
    (global as any).__SSR_DATA__ = apiData || {};
    (global as any).__PAGE_META__ = getPageMeta(url, apiData);

    // Ensure window is not referenced during SSR
    (global as any).window = undefined;
    (global as any).document = {
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
      createElement: () => ({}),
      body: { appendChild: () => {} },
    };
  }

  // Pass SSR post data for /blog/:slug
  let post = undefined;
  if (url.startsWith("/blog/") && apiData?.post) {
    post = apiData.post;
  }

  const appHtml = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <App post={post} />
    </StaticRouter>
  );

  const pageMeta = getPageMeta(url, apiData);

  // Return the rendered HTML string - it will be injected into template by prerender.js or Cloudflare function
  return appHtml;
}

// New function for complete HTML document rendering (used by Cloudflare function)
export async function renderFullHTML(url: string, apiData?: any, template?: string) {
  const appHtml = await render(url, apiData);
  const pageMeta = getPageMeta(url, apiData);

  // If no template provided, create a basic one
  if (!template) {
    template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dr. Sarah Mitchell Therapy</title>
    <meta name="description" content="Professional therapy services in central London. Dr. Sarah Mitchell offers individual, couples, and group therapy with evidence-based approaches. BACP accredited." />
    <meta property="og:title" content="Dr. Sarah Mitchell Therapy" />
    <meta property="og:description" content="Professional therapy services in central London. Dr. Sarah Mitchell offers individual, couples, and group therapy with evidence-based approaches. BACP accredited." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://yourdomain.com" />
    <meta property="og:image" content="https://yourdomain.com/og-home.jpg" />
    <link rel="icon" href="/favicon.ico" />
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script>
      window.__SSR_DATA__ = ${JSON.stringify(apiData || {})};
      window.__PAGE_META__ = ${JSON.stringify(pageMeta)};
    </script>
  </body>
</html>`;
  }

  // Inject SSR data and hydration scripts
  let html = template;
  
  // Inject hydration data before any existing scripts
  const hydrationScript = `<script>
    window.__SSR_DATA__ = ${JSON.stringify(apiData || {})};
    window.__PAGE_META__ = ${JSON.stringify(pageMeta)};
  </script>`;

  // Replace the app HTML placeholder with SSR content and add hydration marker
  html = html.replace("<!--app-html-->", `<!--ssr-hydrated-->${appHtml}<!--/ssr-hydrated-->`);
  
  // Add hydration script before </body>
  if (html.includes("</body>")) {
    html = html.replace("</body>", `${hydrationScript}\n</body>`);
  }

  // Update meta tags
  if (pageMeta?.title) {
    html = html.replace(
      /<title>([^<]*)<\/title>/,
      `<title>${pageMeta.title}</title>`
    );
    html = html.replace(
      /(<meta property="og:title" content=")[^"]*(")/,
      `$1${pageMeta.title}$2`
    );
  }

  if (pageMeta?.description) {
    html = html.replace(
      /(<meta name="description" content=")[^"]*(")/,
      `$1${pageMeta.description}$2`
    );
    html = html.replace(
      /(<meta property="og:description" content=")[^"]*(")/,
      `$1${pageMeta.description}$2`
    );
  }

  if (pageMeta?.ogImage) {
    html = html.replace(
      /(<meta property="og:image" content=")[^"]*(")/,
      `$1${pageMeta.ogImage}$2`
    );
  }

  if (pageMeta?.canonical) {
    html = html.replace(
      /(<meta property="og:url" content=")[^"]*(")/,
      `$1${pageMeta.canonical}$2`
    );
    // Add canonical link and schema
    html = html.replace(
      "</head>",
      `${
        pageMeta.schema
          ? `<script type="application/ld+json">${JSON.stringify(
              pageMeta.schema,
              null,
              2
            )}</script>`
          : ""
      }<link rel="canonical" href="${pageMeta.canonical}" /></head>`
    );
  }

  return html;
}

export { getPageMeta };
