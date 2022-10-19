import { mockPlugin } from './src';
import { UserConfigExport, ConfigEnv } from 'vite';

export default ({ command }: ConfigEnv): UserConfigExport => ({
	plugins: [
		mockPlugin({
			dir: 'mock',
			prefix: '/api',
			timeout: [0, 10],
		}),
	],
});
