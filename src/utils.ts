import fs from 'fs/promises';

export function toBigHump(str: string) {
	let res = str.replace(/-(\w)/g, ($1) => $1.toLocaleUpperCase());
	res = res.substring(0, 1).toLocaleUpperCase() + res.substring(1);
	return res;
}

export function requireApi(url: string) {
	// 删除require缓存，修改mock数据不需要重启服务
	delete require.cache[url];
	return require(url);
}
/**
 * 是否是文件或文件是否存在
 * @param url
 * @returns
 */
export async function isFileExisted(url: string) {
	try {
		const stat = await fs.stat(url);
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
		const stat = await fs.stat(url);
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
