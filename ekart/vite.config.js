import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import faviconPlugin from "vite-plugin-favicon";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), faviconPlugin("./public/favicon.png"),tailwindcss(),],
  server: {
    historyApiFallback: true,
  },
});

