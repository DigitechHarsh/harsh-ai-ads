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
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-core": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
            "lucide-react",
            "framer-motion",
          ],
          "page-services": ["./src/pages/Services.tsx"],
          "page-portfolio": ["./src/pages/Portfolio.tsx"],
          "page-pricing": ["./src/pages/Pricing.tsx"],
          "page-process": ["./src/pages/Process.tsx"],
          "page-resources": ["./src/pages/Resources.tsx"],
          "page-prompts": ["./src/pages/PromptsLibrary.tsx"],
          "page-about": ["./src/pages/AboutUs.tsx"],
          "page-contact": ["./src/pages/ContactUs.tsx"],
          "page-admin": ["./src/pages/AdminDashboard.tsx"],
          "page-login": ["./src/pages/Login.tsx"],
        },
      },
    },
  },
}));
