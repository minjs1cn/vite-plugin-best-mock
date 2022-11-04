import { defineConfig } from "vite";
import { mockPlugin } from "./dist/index";

export default defineConfig({
  plugins: [
    mockPlugin({
      prodEnabled: true,
    }),
  ],
});
