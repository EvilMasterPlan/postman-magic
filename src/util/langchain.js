const { OpenAI } = require("langchain/llms/openai");
const { LLMChain } = require("langchain/chains");
const { PromptTemplate } = require("langchain/prompts");

/*
	temperature ranges from [ 0.0 - 1.0 ]
	where 0.0 is more expected, 1.0 is more random
*/
const defaultTemperature = 0.5;
const model = new OpenAI({ temperature: defaultTemperature });

const promptLibrary = {
	'searchQuery': {
		'v1': {
			template: `A user has the following objective: "{objective}"\n write a query to search an API catalog in as few words as possible. Respond with the query and nothing else. Use present tense. Do NOT include the word "API" in the query.`,
			variables: ['objective'],
		},
	},
	'rankQuery': {
		'v1': {
			template: `You will receive a markdown list of APIs and a user's search query. Return a single list in a markdown (with no other text) that assigns a "relevance" score to each API from 0.0 to 1.0 based on how relevant the result is to the query.\n\nquery: "{userQuery}"\n\nAPIs:\n\n{searchResultsMarkdown}\n\n\nNow evaluate their relevance to the query and return only the list of scores assigned to requestIDs.  Return your list in a single block with each ranking on its own line with no explanation or other text.`,
			variables: ['userQuery', 'searchResultsMarkdown']
		}
	}
}

module.exports.postProcessSuggestedQuery = (suggestedQuery) => {
	let query = suggestedQuery || '';
	// Remove enclosing single or double quotes ChatGPT may have added
	query = query.replace(/^(['"])(.*)\1$/, "$2");
	query = query.trim();
	return query;
}

module.exports.postProcessGeneralResponse = (responseText) => {
	// Remove the newlines ChatGPT occasionally adds to delimit messages
	return responseText.trim();
}

module.exports.preProcessSearchResults = (searchResultObjects) => {
	return searchResultObjects.map((searchResult, index) => {
		const { method, name, publisherName } = searchResult;
		return [
			`## API ${index + 1}`,
			`Method: ${method}`,
			`Name: ${name}`,
			`Publisher: ${publisherName}`
		].join('\n');
	}).join('\n\n');
}

module.exports.callModel = async(prompt, parameters) => {
	const chain = new LLMChain({ llm: model, prompt });
	const response = await chain.call(parameters);
	const { text: responseText } = response;
	return module.exports.postProcessGeneralResponse(responseText);
};

module.exports.getPrompt = (key, version = 'v1') => {
	const promptInfo = (promptLibrary[key] || {})[version];
	if (promptInfo) {
		const { template, variables } = promptInfo;
		return new PromptTemplate({ template, inputVariables: variables })
	}
}