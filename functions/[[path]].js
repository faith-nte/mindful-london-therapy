import { render } from "../dist/server/entry-server.js";

// List of static files to serve
const STATIC_FILES = [
  "/favicon.ico",
  "/robots.txt",
  "/placeholder.svg",
  // Add more as needed
];

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Serve static files from dist
  if (STATIC_FILES.includes(pathname)) {
    // Try dist first, then dist/server
    const filePath =
      pathname === "/favicon.ico"
        ? "../dist/favicon.ico"
        : `../dist${pathname}`;
    try {
      const file = await context.env.ASSETS.fetch(pathname);
      if (file && file.status === 200) {
        return file;
      }
    } catch (e) {
      // fallback to SSR if not found
    }
  }

  // SSR fallback
  const html = await render(url.toString());
  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
}
