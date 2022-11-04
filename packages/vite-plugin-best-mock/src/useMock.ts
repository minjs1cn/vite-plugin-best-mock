import { Connect } from "vite";
import { store } from "./store";
import { delayApi } from "./utils";
import type { ServerResponse } from "http";
import { getMockByUrl } from "./getMockByUrl";

export interface MockConfig {
  /** 要匹配的路由前缀 默认 /api/ */
  prefix: string;
  /** 接口超时时间设置 */
  timeout: [number, number];
}

export const MockDefaultConfig: MockConfig = {
  prefix: "/api/",
  timeout: [100, 2000],
};

function urlFormat(url: string) {
  return url.split("/").filter(Boolean).join("/");
}

export type Req = Connect.IncomingMessage & {
  query?: Record<string, string>;
  body?: Record<string, any>;
  files?: Record<
    string,
    {
      fieldName: string;
      originalFilename: string;
      path: string;
      size: number;
      name: string;
      type: string;
    }
  >;
};

export type Res = ServerResponse<Req>;

export interface MockMethod {
  (req: Req, res: Res): any;
  timeout?: Pick<MockConfig, "timeout">["timeout"];
}

export function useMock(
  config: Partial<MockConfig> = {}
): Connect.NextHandleFunction {
  const { prefix, timeout } = {
    ...MockDefaultConfig,
    ...config,
  };
  return async (req: Req, res: Res, next) => {
    const { originalUrl = "", method = "GET" } = req;
    const url = originalUrl.split("?")[0];

    if (url && url.startsWith(prefix)) {
      // 处理一下请求地址和请求方式
      const mockUrl = urlFormat(url.replace(prefix, ""));
      const mockMethod = method.toLocaleLowerCase();
      // 查找符合当前请求地址的路由
      const { mockData } = store;
      // 从所有mock数据中找到符合当前路由的mock
      const mock = getMockByUrl(mockUrl, mockData);
      if (mock) {
        if (mock.config) {
          const api = mock.config[mockMethod] || mock.config["default"];
          if (api) {
            // 延迟
            await delayApi(api["timeout"] || timeout);
            // 返回结果
            const response = api(req, res);
            if (response) {
              res.end(JSON.stringify(response));
            }
          } else {
            // mock文件中缺少相应请求的方法
            res.end(
              JSON.stringify({
                message: `mock file: ${mock.router.join(
                  "/"
                )} missing ${method} function`,
              })
            );
          }
        } else {
          // mock文件不存在或者发生语法错误
          res.end(
            JSON.stringify({
              message: `mock file: ${mock.router.join(
                "/"
              )} missing or something wrong`,
            })
          );
        }
      } else {
        // mock文件不存在或者发生语法错误
        res.end(
          JSON.stringify({
            message: `mock url: ${mockUrl} missing mock file or something wrong`,
          })
        );
      }
    } else {
      next();
    }
  };
}
