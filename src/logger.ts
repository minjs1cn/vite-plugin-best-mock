import colors from 'colors';

function req(method: string, url: string, params: Record<string, any>) {
	console.log(
		[
			colors.bgGreen('BestMock Req:'),
			colors.bgBlue(method),
			colors.bgBlue(url),
			colors.bgBlue(JSON.stringify(params)),
		].join(' '),
	);
}

function res(data: Record<string, any>) {
	console.log(
		[colors.bgGreen('BestMock Res:'), colors.bgBlue(JSON.stringify(data))].join(
			' ',
		),
	);
}

export default {
	req,
	res,
};
