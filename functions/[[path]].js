// Cloudflare Function for SPA routing fallback
// The SSG/prerendering handles SEO pages, this just ensures client-side routing works

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // List of static file extensions to serve directly
  const staticExtensions = [
    ".js",
    ".css",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".webp",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
  ];
  const isStaticFile = staticExtensions.some((ext) => pathname.endsWith(ext));

  // Serve static files directly
  if (isStaticFile || pathname === "/robots.txt") {
    try {
      const response = await context.env.ASSETS.fetch(context.request);
      if (response.status === 200) {
        return response;
      }
    } catch (e) {
      // Continue to fallback
    }
  }

  // Check if we have a prerendered HTML file for this route
  const prerenderedPaths = [
    "/",
    "/blog",
    "/case-study",
    "/services",
    "/about",
    "/contact",
  ];

  if (prerenderedPaths.includes(pathname)) {
    const htmlPath = pathname === "/" ? "/index.html" : `${pathname}.html`;
    try {
      const response = await context.env.ASSETS.fetch(
        new Request(`${url.origin}${htmlPath}`)
      );
      if (response.status === 200) {
        return response;
      }
    } catch (e) {
      console.log(`Failed to fetch prerendered file ${htmlPath}:`, e);
    }
  }

  // Fallback to index.html for SPA routing (client-side rendering)
  try {
    const indexResponse = await context.env.ASSETS.fetch(
      new Request(`${url.origin}/index.html`)
    );
    if (indexResponse.status === 200) {
      return new Response(await indexResponse.text(), {
        headers: {
          "content-type": "text/html",
          "cache-control": "no-cache", // Don't cache SPA fallbacks
        },
      });
    }
  } catch (e) {
    console.log("Failed to fetch index.html:", e);
  }

  return new Response("Not Found", { status: 404 });
}
