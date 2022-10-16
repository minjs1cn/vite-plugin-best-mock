import { BestMockConfig } from './type';

export const BestMockDefaultConfig: BestMockConfig = {
	/** mock文件的路径 */
	dir: 'mock',
	/** 请求地址前缀 */
	prefix: '',
	/** 超时时间 */
	timeout: [100, 2000],
};
