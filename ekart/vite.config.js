import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import faviconPlugin from "vite-plugin-favicon";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), faviconPlugin("./public/favicon.png")],
});
