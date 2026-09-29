import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        about: path.resolve(__dirname, "about/index.html"),
        contact: path.resolve(__dirname, "contact/index.html"),
        portfolio: path.resolve(__dirname, "portfolio/index.html"),
        prompts: path.resolve(__dirname, "prompts/index.html"),
        resources: path.resolve(__dirname, "resources/index.html"),
        login: path.resolve(__dirname, "login/index.html"),
        admin: path.resolve(__dirname, "admin/index.html"),
        notfound: path.resolve(__dirname, "404.html"),
      },
    },
  },
}));

