const dotenv = require("dotenv");
dotenv.config();

const asyncHandler = require('express-async-handler');
const postman = require('../util/postman');
const langchain = require('../util/langchain');

module.exports.curl_v1 = asyncHandler(async(req, res, next) => {
	let err;

	const { query: userQuery } = req.body;

	const prompt = langchain.getPrompt('searchQuery', 'v1');
	const suggestedQuery = await langchain.callModel(prompt, {
		objective: userQuery,
	});

	// const searchResults = await postman.searchPublicRequests(userQuery);

	req.result = {
		searchQuery: suggestedQuery
	};

	next(err);
});