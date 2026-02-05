import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const isGHPages = process.env.NODE_ENV === "production";
export default defineConfig({
  plugins: [react()],
  base: isGHPages ? "/ForDi/" : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});


