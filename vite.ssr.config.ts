import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
