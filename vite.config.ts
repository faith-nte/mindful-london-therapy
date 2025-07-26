import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
const clientConfig = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

const ssrConfig = defineConfig({
  build: {
    ssr: "src/entry-server.tsx",
    outDir: "dist/server",
    rollupOptions: {
      input: "src/entry-server.tsx",
      output: {
        entryFileNames: "entry-server.js",
        format: "esm",
      },
    },
  },
});

export default [clientConfig, ssrConfig];
