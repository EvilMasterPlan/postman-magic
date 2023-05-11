const asyncHandler = require('express-async-handler');
const dotenv = require("dotenv");
dotenv.config();

module.exports.curl_v1 = asyncHandler(async(req, res, next) => {
	let err;

	next(err);
});