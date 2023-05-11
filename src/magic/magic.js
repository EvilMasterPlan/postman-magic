const asyncHandler = require('express-async-handler');
const dotenv = require("dotenv");
dotenv.config();

const postman = require('../util/postman');

module.exports.curl_v1 = asyncHandler(async(req, res, next) => {
	let err;

	const { query: userQuery } = req.body;

	const searchResults = await postman.searchPublicRequests(userQuery);

	req.result = {
		searchResults
	};

	next(err);
});