import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// optional analyzer plugin will be imported when ANALYZE=true

export default defineConfig({
  plugins: [
    react(),
    ...(process.env.ANALYZE === "true"
      ? [
          await import("rollup-plugin-visualizer").then((m) =>
            m.visualizer({ filename: "dist/public/bundle-report.html", open: false })
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.PORT || 3001}`,
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
