import { MockData } from "./store";
import path from "path";
import fs from "fs";

function routerName(router: string[]) {
  return router
    .map((item) => item.replace(/\[/, "").replace(/\]/, ""))
    .join("_");
}

export function createProdMockServer(
  dir: string,
  mockData: MockData[],
  supportTs: boolean
) {
  const routers = mockData.map(({ router }) => router);
  const imports = routers
    .map((router) => {
      const p = path.relative(process.cwd(), path.join(dir, ...router));
      return `import * as ${routerName(router)} from './${p}'`;
    })
    .join("\n");
  const exports = routers
    .map(
      (router) => `
{ router: [${router.map((r) => `'${r}'`).join(",")}], config: ${routerName(
        router
      )} },`
    )
    .join("\n");

  fs.writeFileSync(
    supportTs ? "mock.ts" : "mock.js",
    `
${imports}
import type { MockData } from 'vite-plugin-best-mock'

export const mockData = [
${exports}

]

export function getMockByUrl(url: string, mockData: MockData[]) {
  const pp = url.split("/").filter(Boolean);

  return mockData.find(({ router }) => {
    for (let index = 0; index < pp.length; index++) {
      const p = pp[index];
      if (p !== router[index] || !/^\[(.+)\]$/.test(router[index])) {
        return false;
      }
    }
    return true;
  });
}
`
  );
}
