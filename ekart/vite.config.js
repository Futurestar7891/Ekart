import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import faviconPlugin from "vite-plugin-favicon";

export default defineConfig({
  plugins: [react(), faviconPlugin("./public/favicon.png")],
  server: {
    historyApiFallback: true,
  },
});
