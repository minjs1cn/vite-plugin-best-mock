import { useMiddleware } from './middleware';
import { PluginOption } from 'vite';
import { BestMockConfig } from './type';
import { BestMockDefaultConfig } from './config';
import bodyParser from 'body-parser';

export const BestMockPlugin = (c?: Partial<BestMockConfig>) => {
	const config = {
		...BestMockDefaultConfig,
		...c,
	};

	return {
		name: 'vite-plugin-best-mock',

		configureServer(server) {
			server.middlewares.use(bodyParser.json());
			server.middlewares.use(useMiddleware(config));
		},
	} as PluginOption;
};
