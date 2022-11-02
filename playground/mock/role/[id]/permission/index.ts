import { MockMethod } from '../../../../src';

export const get: MockMethod = (req, res) => {
	const { id } = req.query || {};

	return {
		id,
		type: 'permission',
	};
};

export const post: MockMethod = async (req: any, res: any) => {
	const { id } = req.query || {};

	return {
		id,
		type: 'permission',
	};
};
