import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  outDir: "dist",
  format: ["cjs", "esm"],
  clean: true,
  sourcemap: true,
  external: ["esbuild"],
});
