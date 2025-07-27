// Build script for SSR with proper asset handling
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the built index.html to extract asset paths
const indexHtmlPath = path.resolve(__dirname, "dist/index.html");
const serverEntryPath = path.resolve(__dirname, "dist/server/entry-server.js");

if (!fs.existsSync(indexHtmlPath)) {
  console.error("❌ dist/index.html not found. Run 'npm run build' first.");
  process.exit(1);
}

if (!fs.existsSync(serverEntryPath)) {
  console.error("❌ dist/server/entry-server.js not found. SSR build failed.");
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexHtmlPath, "utf-8");

// Extract CSS and JS asset paths from the built HTML
const cssMatch = indexHtml.match(/<link[^>]*href="([^"]*\.css)"[^>]*>/);
const jsMatch = indexHtml.match(/<script[^>]*src="([^"]*\.js)"[^>]*>/);

const cssPath = cssMatch ? cssMatch[1] : "/assets/index.css";
const jsPath = jsMatch ? jsMatch[1] : "/assets/index.js";

console.log(`✅ Found CSS asset: ${cssPath}`);
console.log(`✅ Found JS asset: ${jsPath}`);

// Create asset manifest for SSR
const assetManifest = {
  css: cssPath,
  js: jsPath,
  template: indexHtml
};

const manifestPath = path.resolve(__dirname, "dist/ssr-manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(assetManifest, null, 2));

console.log(`✅ Created SSR manifest: ${manifestPath}`);
console.log("✅ SSR build preparation complete!");