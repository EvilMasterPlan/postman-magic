const asyncHandler = require('express-async-handler');

module.exports.curl_v1 = asyncHandler(async(req, res, next) => {
	let err;

	next(err);
});