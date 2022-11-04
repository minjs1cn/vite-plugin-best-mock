# vite-plugin-best-mock

**English** | [中文](./README.zh_CN.md)

[![npm][npm-img]][npm-url] [![node][node-img]][node-url]

Provide local and prod mocks for vite.

A mock plugin for vite, and support the local environment and production environment at the same time. Connect service middleware is used locally, runtime not yet implemented.

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

The development environment is implemented using Connect middleware。

Different from the production environment, you can view the network request record in the Google Chrome console

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
  multiparty: MultipartyConfig;
}
```

## Options

### dir

**type:** `string`

**default:** `'mock'`

Set the folder where the mock .ts file is stored

### prefix

**type:** `string`

**default:** `'/api/'`

the url start with prefix will be mocked

### localEnabled

**type:** `boolean`

**default:** `command === 'serve'`

Set whether to enable the local mock .ts file, do not open it in the production environment

### prodEnabled

**type:** `boolean`

**default:** `command !=='serve'`

Set whether to enable mock function for packaging

### multiparty

**type:** `MultipartyConfig`

**default:** `{}`

If you pass multiparty to mockPlugin(), they are passed directly into [multiparty](https://www.npmjs.com/package/multiparty).

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

you can refer to [Next.js](https://nextjs.org/docs/api-routes/dynamic-api-routes) Dynamic api routes.


## License

MIT
