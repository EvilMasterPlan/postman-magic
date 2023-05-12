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
	// let suggestedQuery = await model.callModel(prompts.getPrompt('searchQuery'), {objective: userQuery});
	// suggestedQuery = processing.postProcessSuggestedQuery(suggestedQuery);

	const suggestedQuery = 'Schedule Zoom Meeting';

	// PHASE 2
	// Fetch the top search results from Postman's Public API Network
	const searchResults = await postman.searchPublicRequests(suggestedQuery);
	const searchResultsMarkdown = processing.preProcessSearchResults(searchResults);

	// PHASE 3
	// Pass the original query and results to the LLM to score for us
	let scoreText = await model.callModel(prompts.getPrompt('rankQuery'), {userQuery, searchResultsMarkdown});
	scores = processing.postProcessScores(scoreText);

	// PHASE 4
	// Enrich the results with the dynamic LLM scoring and select the best
	const enrichedSearchResults = searchResults.map((result, index) => {
		return {
			...result,
			magicScore: scores[index] || 0.0
		}
	});
	enrichedSearchResults.sort((a, b) => b.magicScore - a.magicScore);

	const topMagicResult = enrichedSearchResults[0];
	const { requestID } = topMagicResult;

	// PHASE 5
	// TODO: Convert the best scored result to a cURL command
	const curl = ""

	req.result = {
		phases: {
			suggestedQuery,
			searchResults,
			searchResultsMarkdown,
			scoreText,
			scores,
			enrichedSearchResults,
		},
		curl,
	};

	next(err);
});