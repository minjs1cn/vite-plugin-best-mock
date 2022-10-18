import useMock, { MockConfig, Req, Res } from './middlewares/mock';
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

export function definedApi(fun: MockMethod) {
	return fun;
}

export type MockMethod = (req: Req, res: Res) => any;

export { useMock, mockPlugin, useMultiparty };
