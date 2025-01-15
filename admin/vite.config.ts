import path from "path";
import react from "@vitejs/plugin-react-swc";
import Inspect from "vite-plugin-inspect";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), Inspect({ build: true, outputDir: ".vite-inspect"})],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
});
