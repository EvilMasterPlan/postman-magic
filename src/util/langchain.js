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
	}
}

const postProcessSuggestedQuery = (suggestedQuery) => {
	let query = suggestedQuery || '';
	// Remove the newlines ChatGPT occasionally adds to delimit messages
	query = query.trim();
	// Remove enclosing single or double quotes ChatGPT may have added
	query = query.replace(/^(['"])(.*)\1$/, "$2");
	query = query.trim();
	return query;
}

module.exports.callModel = async(prompt, parameters) => {
	const chain = new LLMChain({ llm: model, prompt });
	const response = await chain.call(parameters);
	const { text: responseText } = response;
	return postProcessSuggestedQuery(responseText);
};

module.exports.getPrompt = (key, version = 'v1') => {
	const promptInfo = (promptLibrary[key] || {})[version];
	if (promptInfo) {
		const { template, variables } = promptInfo;
		return new PromptTemplate({ template, inputVariables: variables })
	}
}