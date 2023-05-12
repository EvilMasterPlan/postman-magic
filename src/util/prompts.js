const { PromptTemplate } = require("langchain/prompts");

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

module.exports.getPrompt = (key, version = 'v1') => {
	const promptInfo = (promptLibrary[key] || {})[version];
	if (promptInfo) {
		const { template, variables } = promptInfo;
		return new PromptTemplate({ template, inputVariables: variables })
	}
}