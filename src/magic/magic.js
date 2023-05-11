const dotenv = require("dotenv");
dotenv.config();

const asyncHandler = require('express-async-handler');
const postman = require('../util/postman');

const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");

/*
	temperature ranges from [ 0.0 - 1.0 ]
	where 0.0 is more expected, 1.0 is more random
*/
const defaultTemperature = 0.5;

module.exports.curl_v1 = asyncHandler(async(req, res, next) => {
	let err;

	const { query: userQuery } = req.body;

	const model = new OpenAI({ temperature: defaultTemperature });
	
	const template = `A user has the following objective: "{objective}"\n write a query to search an API catalog in as few words as possible. Respond with the query and nothing else. Do NOT include the word "API" in the query.`;
	
	const prompt = new PromptTemplate({ template, inputVariables: ["objective"] });
	
	const chain = new LLMChain({ llm: model, prompt });
	
	const objective = `Make an API call to get the coordinates of a particular city`;
	
	const response = await chain.call({ objective });
	const { text: responseText } = response;

	// const searchResults = await postman.searchPublicRequests(userQuery);

	req.result = {
		searchQuery: responseText.trim()
	};

	next(err);
});