import useMock, { MockConfig } from './middlewares/mock';
import { PluginOption } from 'vite';
import useMultiparty, {
	MultipartyConfig,
} from './middlewares/connect-multiparty';
import queryString from './middlewares/query-string';

interface MockPluginConfig extends MockConfig {
	multiparty: MultipartyConfig;
}

function mockPlugin({
	multiparty: multipartConfig,
	...rest
}: Partial<MockPluginConfig> = {}) {
	return {
		name: 'vite-plugin-best-mock',

		configureServer(server) {
			server.middlewares.use(queryString());
			server.middlewares.use(useMultiparty(multipartConfig));
			server.middlewares.use(useMock(rest));
		},
	} as PluginOption;
}

export { useMock, mockPlugin, useMultiparty };
