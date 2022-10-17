// /role/1/permission

import fs from 'fs/promises';

export function get(id: string) {
	return {
		id,
		type: 'permission',
	};
}

export async function post(id: string, req: any, res: any) {
	return {
		id,
		type: 'permission',
		...req.body,
		...req.query,
	};
}
