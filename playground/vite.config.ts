import { defineConfig } from "vite";
import { mockPlugin } from "vite-plugin-best-mock";

export default defineConfig({
  plugins: [
    mockPlugin({
      prefix: "/api",
    }),
  ],
});
