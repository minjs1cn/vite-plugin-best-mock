import { Connect } from 'vite';
import fs from 'fs/promises';
import { join, relative } from 'path';
import {
	delay,
	randomIn,
	isDirExisted,
	isFileExisted,
	requireApi,
} from '../utils';
import logger from '../logger';

require('ts-node').register({
	skipProject: true,
});

function delayApi(timeout: Pick<MockConfig, 'timeout'>['timeout']) {
	// 延迟n毫秒后返回结果，模拟接口延迟
	let [min, max] = timeout;
	min = Math.min(min, max);
	max = Math.max(min, max);
	const time = randomIn(min, max);
	return delay(time);
}

export interface MockConfig {
	dir: string;
	prefix: string;
	timeout: [number, number];
	logger: boolean;
}

export const MockDefaultConfig: MockConfig = {
	/** mock文件的路径 */
	dir: 'mock',
	/** 请求地址前缀 */
	prefix: '',
	/** 超时时间 */
	timeout: [100, 2000],
	logger: false,
};

export default function mock(
	config: Partial<MockConfig> = {},
): Connect.NextHandleFunction {
	const { dir, prefix, timeout } = {
		...MockDefaultConfig,
		...config,
	};
	return async (req, res, next) => {
		const { originalUrl, method } = req;
		// @ts-ignore
		const { query, body } = req; // 通过另外两个中间件处理的参数
		// 获取请求方式 也就是函数名 默认 get
		const funName = method?.toLocaleLowerCase() || 'get';
		// mock根目录
		const mockDir = join(process.cwd(), dir);

		async function response(url: string, args: string[] = []) {
			const apis = requireApi(url);
			await delayApi(timeout);
			const data = await apis[funName](...args, req, res);
			logger.res(data);
			res.end(JSON.stringify(data));
		}

		if (originalUrl?.startsWith(prefix)) {
			try {
				const theOriginUrl = originalUrl.replace(prefix, '');
				const [apiUrl] = theOriginUrl.split('?');

				const result = await Promise.all(
					['.ts', '/index.ts'].map((item) =>
						isFileExisted(join(mockDir, apiUrl + item)),
					),
				);
				const existed = result.filter((item) => item === true).length;

				logger.req(
					funName.toLocaleUpperCase(),
					apiUrl,
					funName === 'get' ? query : body,
				);

				if (existed) {
					const url = join(mockDir, apiUrl);
					await response(url);
					return;
				}

				const paths = apiUrl.split('/').filter(Boolean);
				let root = join(mockDir);
				const args: string[] = [];
				for (let i = 0; i < paths.length; i++) {
					const path = paths[i];
					const u = join(root, path);
					const existed = await isDirExisted(u);
					if (existed) {
						root = join(root, path);
					} else {
						const files = await fs.readdir(root);

						const file = files.find((file) => {
							const u = relative(root, join(root, path));
							if (file.startsWith('[')) {
								args.push(path);
								return true;
							}
							return file === u;
						});
						if (!file) {
							throw Error('请求路径不对');
						}
						root = join(root, file);
					}
				}
				await response(root, args);
			} catch (error) {
				console.error(error);
				next();
			}
			return;
		}
		next();
	};
}
