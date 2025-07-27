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

<<<<<<< HEAD
// Build routes to prerender - these should match the routes in App.tsx
const staticRoutes = [
  "/",           // Index page
  "/blog",       // Blog listing page
  "/case-study", // Case study page
  // Add new static pages here as you create them in src/pages and App.tsx
  // Dynamic blog routes (/blog/:slug) are automatically fetched below
=======
// Build routes to prerender
// List all static routes from App.tsx
const staticRoutes = [
  "/",
  "/blog",
  "/case-study",
  // Add new static pages here as you create them in src/pages and App.tsx
>>>>>>> 9437698 (Update prerender.js to match App.tsx routes and ensure subdirectories for static output)
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
    let filePath;
    if (url === "/") {
      filePath = "dist/index.html";
    } else if (url.startsWith("/blog/")) {
      // Nested blog post route
      filePath = `dist${url}.html`;
    } else {
      filePath = `dist${url}.html`;
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
