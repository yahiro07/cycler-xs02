import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

const configs = {
  useDevServerHttps: false,
  devServerPort: 3000,
};
if (1) {
  //For AudioWorklet, use https to access from devices on the local network.
  configs.useDevServerHttps = true;
  configs.devServerPort = 3002;
}

export default defineConfig({
  plugins: [tailwindcss(), react(), configs.useDevServerHttps && mkcert()],
  resolve: {
    alias: {
      react: fileURLToPath(
        new URL("../../frontend/node_modules/react", import.meta.url),
      ),
      "react-dom": fileURLToPath(
        new URL("../../frontend/node_modules/react-dom", import.meta.url),
      ),
      "react-dom/client": fileURLToPath(
        new URL(
          "../../frontend/node_modules/react-dom/client.js",
          import.meta.url,
        ),
      ),
    },
    dedupe: ["react", "react-dom"],
    tsconfigPaths: true,
  },
  server: {
    port: configs.devServerPort,
    host: "0.0.0.0",
    fs: {
      allow: [".", "../../frontend/src"],
    },
  },
});
