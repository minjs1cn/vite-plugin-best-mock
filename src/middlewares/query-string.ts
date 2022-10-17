import qs from 'qs';
import { Connect } from 'vite';

export default function queryString(): Connect.NextHandleFunction {
	return (req, res, next) => {
		const { originalUrl = '' } = req;
		const [, search] = originalUrl.split('?');
		const query = qs.parse(search);
		// @ts-ignore
		req.query = query;
		next();
	};
}
