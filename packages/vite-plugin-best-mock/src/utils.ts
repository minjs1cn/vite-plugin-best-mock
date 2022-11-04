import fs from "fs";
import path from "path";
import { build } from "esbuild";
import { MockConfig } from "./useMock";

export function delayApi(timeout: Pick<MockConfig, "timeout">["timeout"]) {
  // 延迟n毫秒后返回结果，模拟接口延迟
  let [min, max] = timeout;
  min = Math.min(min, max);
  max = Math.max(min, max);
  const time = randomIn(min, max);
  return delay(time);
}

export function toBigHump(str: string) {
  let res = str.replace(/-(\w)/g, ($1) => $1.toLocaleUpperCase());
  res = res.substring(0, 1).toLocaleUpperCase() + res.substring(1);
  return res;
}

/**
 * 是否是文件或文件是否存在
 * @param url
 * @returns
 */
export async function isFileExisted(url: string) {
  try {
    const stat = fs.statSync(url);
    return stat.isFile();
  } catch (error) {
    return false;
  }
}

/**
 * 是否是文件夹或文件是否存在
 * @param url
 * @returns
 */
export async function isDirExisted(url: string) {
  try {
    const stat = fs.statSync(url);
    return stat.isDirectory();
  } catch (error) {
    return false;
  }
}
/**
 * 随机生成最大最小之间的值
 * @param min - 最小值
 * @param max - 最大值
 */
export function randomIn(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 延迟时间
 * @param time - 延迟时间
 */
export function delay(time: number): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(time), time);
  });
}

export async function buildFile(p: string) {
  const result = await build({
    entryPoints: [p],
    outfile: "out.js",
    write: false,
    platform: "node",
    bundle: true,
    format: "cjs",
    metafile: true,
    target: "es2015",
  });
  return result;
}

export function readdir(mockDir: string) {
  const mockFiles: string[] = [];

  function _readdir(dir: string) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const state = fs.statSync(path.join(dir, file));
      if (state.isDirectory()) {
        _readdir(path.join(dir, file));
      } else {
        mockFiles.push(path.relative(mockDir, path.join(dir, file)));
      }
    });
  }

  _readdir(mockDir);
  return mockFiles;
}

export function filesToRouters(mockFiles: string[]) {
  return mockFiles.map((item) => {
    item = item.replace(/\.[j|t]s/, "");
    const paths = item.split("/");
    return paths;
  });
}
