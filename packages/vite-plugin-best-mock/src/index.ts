import type { PluginOption } from "vite";
import chokidar from "chokidar";
import { store } from "./store";
import { createMockRouter } from "./createMockServer";
import { MockConfig, useMock } from "./useMock";
import { useQueryString } from "./useQueryString";
import { MultipartyConfig, useMultiparty } from "./useMultiparty";
import { isFileExisted } from "./utils";
import path from "path";
import { createProdMockServer } from "./createProdMockServer";

interface MockPluginConfig extends MockConfig {
  /** mock文件目录 */
  mockDir: string;
  /** 上传相关配置 参考中间件 connect-multiparty */
  multiparty: MultipartyConfig;
  /** 本地环境开启 */
  localEnabled: boolean;
  /** 生产环境开启 */
  prodEnabled: boolean;
  /** 运行时代码被注入的文件 默认: src/main.ts */
  entry: string;
  /** 运行时代码 */
  runtimeCode: string;
}

async function getEntry(entryFile = "src/main.ts") {
  let entry = path.resolve(process.cwd(), entryFile);
  if (await isFileExisted(entry)) {
    return {
      supportTs: true,
      entry,
    };
  }
  entry = path.resolve(process.cwd(), "src/main.js");
  if (await isFileExisted(entry)) {
    return {
      supportTs: false,
      entry,
    };
  }
  return {
    supportTs: false,
    entry: undefined,
  };
}

export const mockPlugin = ({
  multiparty,
  ...rest
}: Partial<MockPluginConfig> = {}): PluginOption => {
  const {
    mockDir = "mock",
    localEnabled = true,
    prodEnabled = false,
    runtimeCode = `
      console.log('runtime not yet implemented');
    `,
  } = rest;
  let isDev = true;
  let needSourcemap = false;
  let { entry } = rest;

  return {
    name: "vite-plugin-best-mock",
    enforce: "pre",

    async configResolved(resolvedConfig) {
      isDev = resolvedConfig.command === "serve";
      const res = await getEntry(entry);
      if (res.entry) {
        entry = res.entry;
      }
      needSourcemap = !!resolvedConfig.build.sourcemap;

      async function createMock() {
        store.mockData = await createMockRouter(mockDir);
        if (prodEnabled) {
          createProdMockServer(mockDir, store.mockData, res.supportTs);
        }
      }
      createMock();
      chokidar.watch([mockDir]).on("all", async () => {
        /**
         * TODO: 可以根据事件类型做一些优化，而非全量更新
         */
        createMock();
      });
    },

    configureServer: async (server) => {
      if (localEnabled) {
        server.middlewares.use(useQueryString());
        server.middlewares.use(useMultiparty(multiparty));
        server.middlewares.use(useMock());
      }
    },

    transform(code: string, id: string) {
      // 开发环境 或 入口不存在
      if (isDev || !entry || !id.endsWith(entry)) {
        return null;
      }

      // 线上环境未开启
      if (!prodEnabled) {
        return null;
      }

      return {
        map: needSourcemap ? this.getCombinedSourcemap() : null,
        code: `${code}\n${runtimeCode}`,
      };
    },
  };
};

export * from "./useMock";
export type { MockData } from "./store";
