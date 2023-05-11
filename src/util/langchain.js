const { OpenAI } = require("langchain/llms/openai");
const { LLMChain } = require("langchain/chains");

/*
	temperature ranges from [ 0.0 - 1.0 ]
	where 0.0 is more expected, 1.0 is more random
*/
const defaultTemperature = 0.5;
const model = new OpenAI({ temperature: defaultTemperature });

module.exports.callModel = async(prompt, parameters) => {
	const chain = new LLMChain({ llm: model, prompt });
	const response = await chain.call(parameters);
	const { text: responseText } = response;
	return responseText.trim();
};