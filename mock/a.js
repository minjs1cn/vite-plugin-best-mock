const get = (req, res) => {
	const { id } = req.query || {};
	res.end(
		JSON.stringify({
			id,
		}),
	);
};

module.exports = {
	get,
};
