import { mockPlugin } from "./src";
import { UserConfigExport, ConfigEnv } from "vite";
import pkg from "./package.json";
import { getName } from "pkg-get";

const name = getName(pkg.name);

export default ({ command }: ConfigEnv): UserConfigExport => ({
  base: `/${name}/`,
  plugins: [
    mockPlugin({
      dir: "mock",
      prefix: "/api",
      timeout: [0, 10],
      localEnabled: command === "serve",
    }),
  ],
});
