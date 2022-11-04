import { filesToRouters, readdir, buildFile } from "./utils";
import path from "path";
import { store } from "./store";
import module from "module";

export async function createMockRouter(dir: string) {
  const files = readdir(dir);
  const routers = filesToRouters(files);
  store.routers = routers;
  const weakMap = new WeakMap<string[], string>();
  routers.forEach((item, index) => {
    const filePath = path.resolve(dir, files[index]);
    weakMap.set(item, filePath);
  });

  const resolveModulePromiseList = [];

  for (let index = 0; index < routers.length; index++) {
    const router = routers[index];
    resolveModulePromiseList.push(resolveModule(weakMap.get(router)!, router));
  }

  const mockData = await Promise.all(resolveModulePromiseList);

  return mockData;
}

export async function resolveModule(fileName: string, router: string[]) {
  const result = await buildFile(fileName);
  const bundledCode = result.outputFiles[0].text;
  const extension = path.extname(fileName);

  // @ts-expect-error
  const extensions = module.Module._extensions;
  let defaultLoader: any;
  const isJs = extension === ".js";
  if (isJs) {
    defaultLoader = extensions[extension]!;
  }

  extensions[extension] = (module: NodeModule, filename: string) => {
    if (filename === fileName) {
      // @ts-expect-error
      (module as NodeModule)._compile(bundledCode, filename);
    } else {
      if (!isJs) {
        extensions[extension]!(module, filename);
      } else {
        defaultLoader(module, filename);
      }
    }
  };
  let config;
  try {
    if (require && require.cache) {
      delete require.cache[fileName];
    }
    const raw = require(fileName);
    // config = raw.__esModule ? raw.default : raw;
    config = raw;
    if (defaultLoader && isJs) {
      extensions[extension] = defaultLoader;
    }
  } catch (error) {
    console.error(error);
  }

  return {
    router,
    config,
  };
}
