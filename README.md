# vite-plugin-best-mock

**English** | [中文](./README.zh_CN.md)

[![npm][npm-img]][npm-url] [![node][node-img]][node-url]

Provide local and prod mocks for vite.

A mock plugin for vite, and support the local environment and production environment at the same time. Connect service middleware is used locally, mockjs is used online.

### Install (yarn or npm)

**node version:** >=12.0.0

**vite version:** >=2.0.0

```bash
yarn add mockjs
# or
npm i  mockjs -S
```

```bash
yarn add vite-plugin-best-mock -D
# or
npm i vite-plugin-best-mock -D
```

### Example

**Run Example**

```bash

# ts example
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
  logger?: boolean;
  multiparty: MultipartyConfig;
}
```

## Options

### dir

**type:** `string`

**default:** `'mock'`

Set the folder where the mock .ts file is stored

### localEnabled

**type:** `boolean`

**default:** `command === 'serve'`

Set whether to enable the local mock .ts file, do not open it in the production environment

### prodEnabled

**type:** `boolean`

**default:** `command !=='serve'`

Set whether to enable mock function for packaging

### logger

**type:** `boolean`

**default:** `true`

Whether to display the request log on the console

### multiparty

**type:** `MultipartyConfig`

**default:** `{}`

If you pass multiparty to mockPlugin(), they are passed directly into [multiparty](https://www.npmjs.com/package/multiparty).

## Mock file example

`/path/mock`

```ts
// test.ts

import { MockMethod } from 'vite-plugin-best-mock'

```

### MockMethod

```ts
export type MockMethod = (req: Req, res: Res) => void;
```

you can refer to [Next.js](https://nextjs.org/docs/api-routes/dynamic-api-routes) Dynamic api routes.

## Note

- The node module cannot be used in the mock .ts file, otherwise the production environment will fail
- Mock is used in the production environment, which is only suitable for some test environments. Do not open it in the formal environment to avoid unnecessary errors. At the same time, in the production environment, it may affect normal Ajax requests, such as file upload failure, etc.

## License

MIT
