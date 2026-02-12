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
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor-react";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("recharts")) return "vendor-charts";
            if (id.includes("@radix-ui")) return "vendor-radix";
            if (id.includes("@tanstack")) return "vendor-query";
            return "vendor";
          }
        },
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
