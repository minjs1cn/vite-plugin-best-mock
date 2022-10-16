// import bodyParser from 'body-parser';

import { Connect } from 'vite';
import { bodyParse } from './utils';

// export default bodyParser;

function json(): Connect.NextHandleFunction {
	return async (req, res, next) => {
		// @ts-ignore
		req.body = await bodyParse(req);
		next();
	};
}

export default {
	json,
};
