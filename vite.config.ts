import { mockPlugin } from './src';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		mockPlugin({
			dir: 'mock',
			prefix: '/api',
			timeout: [0, 10],
		}),
	],
});
