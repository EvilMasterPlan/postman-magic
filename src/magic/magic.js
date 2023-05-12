const dotenv = require("dotenv");
dotenv.config();

const asyncHandler = require('express-async-handler');
const postman = require('../util/postman');
const model = require('../util/model');
const prompts = require('../util/prompts');
const processing = require('../util/processing');

module.exports.curl_v1 = asyncHandler(async(req, res, next) => {
	let err;

	const { query: userQuery } = req.body;

	// PHASE 1
	// Given a user query, derive a model-suggested API search query
	let suggestedQuery = await model.callModel(prompts.getPrompt('searchQuery'), {objective: userQuery});
	suggestedQuery = processing.postProcessSuggestedQuery(suggestedQuery);

	// PHASE 2
	// Fetch the top search results from Postman's Public API Network
	const searchResults = await postman.searchPublicRequests(suggestedQuery);
	const searchResultsMarkdown = processing.preProcessSearchResults(searchResults);

	// PHASE 3
	// Pass the original query and results to the LLM to rank for us
	const ranks = await model.callModel(prompts.getPrompt('rankQuery'), {userQuery, searchResultsMarkdown});

	// PHASE 4
	// TODO: sort by LLM rank
	// TODO: convert best ranked result to cURL command
	const curl = ""

	req.result = {
		phases: {
			suggestedQuery,
			searchResults,
			searchResultsMarkdown,
			ranks,
		},
		curl,
	};

	next(err);
});