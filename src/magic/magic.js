const dotenv = require("dotenv");
dotenv.config();

const asyncHandler = require('express-async-handler');
const postman = require('../util/postman');
const model = require('../util/model');
const prompts = require('../util/prompts');
const processing = require('../util/processing');
const scraper = require('../util/scraper');

module.exports.curl_v1 = asyncHandler(async(req, res, next) => {
	let err;

	const { query: userQuery } = req.body;

	console.log('PHASE 1: LLM query optimization...');

	// PHASE 1
	// Given a user query, derive a model-suggested API search query
	let suggestedQuery = await model.callModel(prompts.getPrompt('searchQuery'), {objective: userQuery});
	suggestedQuery = processing.postProcessSuggestedQuery(suggestedQuery);

	console.log('PHASE 2: Search Postman Public API Network...');

	// PHASE 2
	// Fetch the top search results from Postman's Public API Network
	const searchResults = await postman.searchPublicRequests(suggestedQuery);
	const searchResultsMarkdown = processing.preProcessSearchResults(searchResults);

	console.log('PHASE 3: LLM scoring optimization...');

	// PHASE 3
	// Pass the original query and results to the LLM to score for us
	let scoreText = await model.callModel(prompts.getPrompt('rankQuery'), {userQuery, searchResultsMarkdown});
	scores = processing.postProcessScores(scoreText);

	console.log('PHASE 4: Rank by magic score...');

	// PHASE 4
	// Enrich the results with the dynamic LLM scoring and select the best
	const enrichedSearchResults = searchResults.map((result, index) => {
		return {
			...result,
			magicScore: scores[index] || 0.0
		}
	});
	enrichedSearchResults.sort((a, b) => b.magicScore - a.magicScore);

	console.log('PHASE 5: Convert top result to cURL command...');

	// PHASE 5
	// Convert the best scored result to a cURL command
	const topMagicResult = enrichedSearchResults[0];
	const { requestID, publisherHandle, workspaceSlugs } = topMagicResult;
	const firstWorkspaceSlug = workspaceSlugs[0];
	// Not sure the best programmatic way to do this, so we scrape if from the request page
	const command = await scraper.scrapeCommand(publisherHandle, firstWorkspaceSlug, requestID);

	req.result = {
		phases: {
			suggestedQuery,
			searchResults,
			scoreText,
			scores,
			enrichedSearchResults,
		},
		curl: command,
	};

	next(err);
});