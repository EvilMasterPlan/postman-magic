const dotenv = require("dotenv");
dotenv.config();

const asyncHandler = require('express-async-handler');
const postman = require('../util/postman');
const langchain = require('../util/langchain');

module.exports.curl_v1 = asyncHandler(async(req, res, next) => {
	let err;

	const { query: userQuery } = req.body;

	// PHASE 1
	// Given a user query, derive a model-suggested API search query
	let suggestedQuery = await langchain.callModel(langchain.getPrompt('searchQuery'), {objective: userQuery});
	suggestedQuery = langchain.postProcessSuggestedQuery(suggestedQuery);

	// PHASE 2
	// Fetch the top search results from Postman's Public API Network
	const searchResults = await postman.searchPublicRequests(suggestedQuery);
	const searchResultsMarkdown = langchain.preProcessSearchResults(searchResults);

	// PHASE 3
	// Pass the original query and results to the LLM to rank for us
	const ranks = await langchain.callModel(langchain.getPrompt('rankQuery'), {userQuery, searchResultsMarkdown});

	// PHASE 4
	// TODO: sort by LLM rank
	// TODO: convert best ranked result to cURL command

	req.result = {
		suggestedQuery,
		searchResults,
		ranks,
	};

	next(err);
});