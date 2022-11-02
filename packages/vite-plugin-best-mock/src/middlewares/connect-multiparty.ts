import _multiparty from 'connect-multiparty';
import { mkdir } from 'fs/promises';
import { FormOptions } from 'multiparty';
import { join } from 'path';
import { Connect } from 'vite';
import { isDirExisted } from '../utils';

export interface MultipartyConfig extends FormOptions {}

const uploadDir = join(process.cwd(), 'node_modules/.multiparty');

init();
async function init() {
	const dirExisted = await isDirExisted(uploadDir);
	if (!dirExisted) {
		await mkdir(uploadDir);
	}
}

export const MultipartyDefaultConfig: MultipartyConfig = {
	uploadDir,
};

export default function multiparty(config: Partial<MultipartyConfig> = {}) {
	const options = {
		...MultipartyDefaultConfig,
		...config,
	};
	return _multiparty(options) as Connect.NextHandleFunction;
}
