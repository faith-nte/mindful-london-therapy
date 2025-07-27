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

  // Serve prerendered HTML for main pages and single blog posts
  const prerenderedPaths = [
    "/",
    "/blog",
    "/case-study",
    "/services",
    "/about",
    "/contact",
    // Add more static pages here
  ];

  // SSR single blog post pages
  if (pathname.startsWith("/blog/")) {
    const slug = pathname.replace("/blog/", "");
    if (slug) {
      try {
        // Fetch post data from WordPress API with embedded media
        const apiUrl = `https://fenn.digital/wp-json/wp/v2/posts?slug=${encodeURIComponent(
          slug
        )}&_embed=1`;
        const apiRes = await fetch(apiUrl);
        if (apiRes.status === 200) {
          const posts = await apiRes.json();
          if (posts.length > 0) {
            const post = posts[0];
            
            // Enhanced meta data for blog posts
            const postMeta = {
              title: post.title.rendered,
              description: post.excerpt.rendered
                .replace(/<[^>]*>/g, "")
                .substring(0, 160),
              ogImage: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://yourdomain.com/og-blog.jpg",
              canonical: `https://yourdomain.com/blog/${post.slug}`,
              schema: {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: post.title.rendered,
                description: post.excerpt.rendered.replace(/<[^>]*>/g, "").substring(0, 160),
                datePublished: post.date,
                author: {
                  "@type": "Person",
                  name: "Dr. Sarah Mitchell",
                  jobTitle: "Chartered Clinical Psychologist",
                },
                publisher: {
                  "@type": "Organization",
                  name: "Dr. Sarah Mitchell Therapy Services",
                },
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `https://yourdomain.com/blog/${post.slug}`,
                },
              },
            };

            // Load the HTML template for proper asset injection
            let template;
            try {
              const templateResponse = await context.env.ASSETS.fetch(
                new Request(`${url.origin}/index.html`)
              );
              if (templateResponse.status === 200) {
                template = await templateResponse.text();
              }
            } catch (e) {
              console.log("Failed to load template:", e);
            }

            // SSR: import entry-server.js and render complete HTML
            const { renderFullHTML } = await import("../dist/server/entry-server.js");
            const html = await renderFullHTML(pathname, { post, ...postMeta }, template);
            
            return new Response(html, {
              headers: {
                "content-type": "text/html; charset=UTF-8",
                "cache-control": "public, max-age=3600", // Cache blog posts for 1 hour
              },
            });
          }
        }
      } catch (e) {
        console.log(`Failed to SSR blog post for slug ${slug}:`, e);
      }
    }
  }
  // Serve main prerendered pages
  if (prerenderedPaths.includes(pathname)) {
    const htmlPath = pathname === "/" ? "/index.html" : `${pathname}.html`;
    try {
      const response = await context.env.ASSETS.fetch(
        new Request(`${url.origin}${htmlPath}`)
      );
      if (response.status === 200) {
        // Ensure correct content-type for HTML
        return new Response(await response.text(), {
          headers: {
            "content-type": "text/html; charset=UTF-8",
            "cache-control": "no-cache",
          },
        });
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
