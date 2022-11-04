# vite-plugin-best-mock

**Chinese** | [English](./README.md)

[![npm][npm-img]][npm-url] [![node][node-img]][node-url]

为 Vite 提供开发和生产环境的 Mock 服务

一个 Vite 的 Mock 插件, 同时支持本地和线上环境. 本地是基于 Connect 中间件实现的, 线上还未实现。

### Install (yarn or npm)

**node version:** >=12.0.0

**vite version:** >=2.0.0


```bash
yarn add vite-plugin-best-mock -D
# or
npm i vite-plugin-best-mock -D
```

### Example

**Run Example**

```bash
# ts example
cd playground

yarn install

yarn dev
```

## Usage

**Development environment**

开发环境是基于 Connect 中间件实现的

- Config plugin in vite.config.ts

```ts
import { UserConfigExport, ConfigEnv } from 'vite'

import { mockPlugin } from 'vite-plugin-mock'

export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    plugins: [
      vue(),
      mockPlugin(),
    ],
  }
}
```

- Options

```ts
interface MockPluginConfig {
  dir?: string;
  prefix?: string;
  timeout?: [number, number];
  logger?: boolean;
  multiparty: MultipartyConfig;
}
```

## Options

### dir

**type:** `string`

**default:** `'mock'`

存放 mock 文件的文件夹路径

### prefix

**type:** `string`

**default:** `'/api/'`

以prefix开头的url会被mock拦截

### localEnabled

**type:** `boolean`

**default:** `command === 'serve'`

是否允许本地环境开启 mock 服务

### prodEnabled

**type:** `boolean`

**default:** `command !=='serve'`

是否允许线上环境开启 mock 服务

### multiparty

**type:** `MultipartyConfig`

**default:** `{}`

如果你传了这个配置，我会把整个配置直接透传给 [multiparty](https://www.npmjs.com/package/multiparty).

## Mock file example

`/path/mock`

```ts
// user.ts

import { MockMethod } from 'vite-plugin-best-mock'

/**
 * url: /user
 * method: get
 */
export const get: MockMethod = (req) => {
	const { id } = req.query || {};
	return {
		id,
		name: 'qingyang',
	};
};

/**
 * url: /user
 * method: post
 */
export const post: MockMethod = (req) => {
	const { id } = req.body || {};
	return {
		id,
		name: 'qingyang',
	};
};
```
### MockMethod

```ts

export interface MockMethod {
  (req: Req, res: Res): any;
  timeout?: Pick<MockConfig, "timeout">["timeout"];
}

```

你可以参考 [Next.js](https://nextjs.org/docs/api-routes/dynamic-api-routes) 约定式路由

## License

MIT
