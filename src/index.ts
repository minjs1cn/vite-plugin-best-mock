import useMock, { MockConfig, Req, Res } from "./middlewares/mock";
import { normalizePath, PluginOption } from "vite";
import useMultiparty, {
  MultipartyConfig,
} from "./middlewares/connect-multiparty";
import queryString from "./middlewares/query-string";
import path from "path";

interface MockPluginConfig extends MockConfig {
  multiparty: MultipartyConfig;
  localEnabled: boolean;
  prodEnabled: boolean;
  injectFile: string;
  supportTs: boolean;
}

function getDefaultPath(supportTs = true) {
  return path.resolve(process.cwd(), `src/main.${supportTs ? "ts" : "js"}`);
}

function mockPlugin({
  multiparty: multipartConfig,
  ...rest
}: Partial<MockPluginConfig> = {}) {
  const {
    localEnabled = true,
    prodEnabled = false,
    supportTs = true,
    injectFile = normalizePath(getDefaultPath(supportTs)),
  } = rest;
  const injectCode = `
		console.log('The online version has not been implemented');
	`;
  let config;
  let isDev = true;

  return {
    name: "vite-plugin-best-mock",
    enforce: "pre",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
      isDev = config.command === "serve";
      console.log("injectFile", injectFile);
    },

    configureServer(server) {
      if (localEnabled) {
        server.middlewares.use(queryString());
        server.middlewares.use(useMultiparty(multipartConfig));
        server.middlewares.use(useMock(rest));
      }
    },

    transform(code: string, id: string) {
      if (isDev || !injectFile || !id.endsWith(injectFile)) {
        return null;
      }

      if (!prodEnabled) {
        return null;
      }

      return {
        map: null,
        code: `${code}\n${injectCode}`,
      };
    },
  } as PluginOption;
}

export function definedApi(fun: MockMethod) {
  return fun;
}

export type MockMethod = (req: Req, res: Res) => any;

export { useMock, mockPlugin, useMultiparty };

export default { useMock, mockPlugin, useMultiparty };
