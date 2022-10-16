import { BestMockPlugin } from './src';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		BestMockPlugin({
			dir: 'mock',
			prefix: '/api',
		}),
	],
});
