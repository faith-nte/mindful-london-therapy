// ✅ Customised for Cloudflare Pages SSG Deployment
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute("dist/index.html"), "utf-8");
const { render, getPageMeta, renderFullHTML } = await import(
  "./dist/server/entry-server.js"
);

// Helper to fetch all blog post slugs
async function fetchBlogSlugs() {
  try {
    const res = await fetch(
      "https://fenn.digital/wp-json/wp/v2/posts?per_page=100&_fields=slug"
    );
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.map((post) => `/blog/${post.slug}`);
  } catch (e) {
    console.warn("Failed to fetch blog slugs:", e);
    return [];
  }
}

// Build routes to prerender - these should match the routes in App.tsx
// IMPORTANT: Add all static routes from App.tsx here. Nested routes should use their full path.
const staticRoutes = [
  "/",           // Index page
  "/blog",       // Blog listing page
  "/case-study", // Case study page
  // Add new static pages here as you create them in src/pages and App.tsx
  // Example: "/services", "/about", "/contact"
  // Dynamic blog routes (/blog/:slug) are automatically fetched below
];

(async () => {
  const blogRoutes = await fetchBlogSlugs();
  const routesToPrerender = [...staticRoutes, ...blogRoutes];

  // Use async/await for render
  for (const url of routesToPrerender) {
    let apiData = undefined;
    // Provide mock apiData for /case-study if needed
    if (url === "/case-study") {
      apiData = {
        content: { rendered: "" },
        title: { rendered: "Case Study" },
        date: "",
        _embedded: {},
      };
    }
    // Fetch full post data for /blog/:slug routes
    if (url.startsWith("/blog/") && url.split("/").length === 3) {
      const slug = url.replace("/blog/", "");
      try {
        const postRes = await fetch(`https://fenn.digital/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`);
        if (postRes.ok) {
          const posts = await postRes.json();
          if (posts.length > 0) {
            apiData = posts[0];
          }
        }
      } catch (e) {
        console.warn(`Failed to fetch post data for slug ${slug}:`, e);
      }
    }
    // Use the new renderFullHTML function for complete HTML generation
    let html = await renderFullHTML(url, apiData, template);

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

    // Ensure subdirectories exist before writing the file
    // e.g. /blog/my-post => dist/blog/my-post.html
    // Output HTML file should match the route structure
    // e.g. /blog/my-post => dist/blog/my-post/index.html
    let filePath;
    if (url === "/") {
      filePath = "dist/index.html";
    } else {
      // Remove leading slash and split into segments
      const segments = url.slice(1).split("/");
      // If last segment is empty, treat as index.html
      if (segments[segments.length - 1] === "") {
        segments.pop();
      }
      // If route is /blog or /case-study, output dist/blog/index.html etc
      if (segments.length === 1) {
        filePath = `dist/${segments[0]}/index.html`;
      } else {
        // For nested routes, e.g. /blog/my-post
        filePath = `dist/${segments.join("/")}/index.html`;
      }
    }
    const fullPath = toAbsolute(filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, html);
    console.log("✅ Pre-rendered:", filePath);
  }
  // To add new pages/blogs:
  // 1. Add the route to staticRoutes above
  // 2. Create the corresponding component in src/pages or src/components
  // 3. Add the route to App.tsx
  // 4. Rerun prerender.js
})();
