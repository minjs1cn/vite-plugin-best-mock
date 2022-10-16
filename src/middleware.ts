import { Connect, normalizePath } from 'vite';
import { BestMockConfig } from './type';
import fs from 'fs/promises';
import { join, relative, resolve } from 'path';
import { BestMockDefaultConfig } from './config';
import { delay, getRandom } from './utils';
import qs from 'qs';

require('ts-node').register({});

function requireApi(url: string) {
	// 删除require缓存，修改mock数据不需要重启服务
	delete require.cache[url];
	return require(url);
}

function executeApi(apis: any, funName: string) {
	return apis[funName]();
}

function delayApi(timeout: Pick<BestMockConfig, 'timeout'>['timeout']) {
	// 延迟n毫秒后返回结果，模拟接口延迟
	let [min, max] = timeout;
	min = Math.min(min, max);
	max = Math.max(min, max);
	const time = getRandom(min, max);
	return delay(time);
}

async function isFileExisted(url: string) {
	try {
		const stat = await fs.stat(url);
		return stat.isFile();
	} catch (error) {
		return false;
	}
}

async function isDirExisted(url: string) {
	try {
		const stat = await fs.stat(url);
		return stat.isDirectory();
	} catch (error) {
		return false;
	}
}

export function useMiddleware(
	config: Partial<BestMockConfig>,
): Connect.NextHandleFunction {
	const { dir, prefix, timeout } = {
		...BestMockDefaultConfig,
		...config,
	};
	return async (req, res, next) => {
		const { originalUrl, method } = req;
		const funName = method?.toLocaleLowerCase() || 'get';
		const mockDir = join(process.cwd(), dir);
		// @ts-ignore
		console.log(originalUrl, method, req.body);

		async function response(url: string, args: string[] = []) {
			const apis = requireApi(url);
			await delayApi(timeout);
			const data = await apis[funName](...args, req, res);
			res.end(JSON.stringify(data));
		}
		if (originalUrl?.startsWith(prefix)) {
			try {
				const theOriginUrl = originalUrl.replace(prefix, '');
				const [apiUrl, search] = theOriginUrl.split('?');
				const query = qs.parse(search);
				// @ts-ignore
				req.query = query;
				const result = await Promise.all(
					['.ts', '/index.ts'].map((item) =>
						isFileExisted(join(mockDir, apiUrl + item)),
					),
				);
				const existed = result.filter((item) => item === true).length;
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
						const stat = await fs.stat(u);
						if (stat.isDirectory()) {
							root = join(root, path);
						} else {
							// const files = await fs.readdir(root);
							// files.forEach((file) => {
							// 	console.log(file);
							// });
						}
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
