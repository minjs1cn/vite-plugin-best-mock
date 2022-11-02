import { MockMethod } from '../src';

export const post: MockMethod = (req, res) => {
	const { id } = req.body || {};
	const { file } = req.files || {};
	res.end(
		JSON.stringify({
			id,
			...file,
		}),
	);
};
