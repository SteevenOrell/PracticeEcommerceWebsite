import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // allowedHosts lets the dev server answer through a VS Code / Dev Tunnels URL for
  // testing on a phone (dev server only; production builds are unaffected).
  server: { port: 3000, strictPort: false, allowedHosts: [".devtunnels.ms"] },
  preview: { port: 4173 },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: "firebase", test: /node_modules[\\/](@?firebase)/ },
            { name: "ui", test: /node_modules[\\/](@nextui-org|@react-aria|@react-stately|framer-motion)/ },
            { name: "react", test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.js"],
    css: false,
    include: ["src/**/*.test.{js,jsx}"],
  },
});
