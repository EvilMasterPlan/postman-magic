const dotenv = require("dotenv");
dotenv.config();

const asyncHandler = require('express-async-handler');
const postman = require('../util/postman');
const langchain = require('../util/langchain');

const { PromptTemplate } = require("langchain/prompts");

module.exports.curl_v1 = asyncHandler(async(req, res, next) => {
	let err;

	const { query: userQuery } = req.body;

	const template = `A user has the following objective: "{objective}"\n write a query to search an API catalog in as few words as possible. Respond with the query and nothing else. Use present tense. Do NOT include the word "API" in the query.`;
	const prompt = new PromptTemplate({ template, inputVariables: ["objective"] });

	const suggestedQuery = await langchain.callModel(prompt, {
		objective: userQuery,
	});

	// const searchResults = await postman.searchPublicRequests(userQuery);

	req.result = {
		searchQuery: suggestedQuery
	};

	next(err);
});