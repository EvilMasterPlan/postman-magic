module.exports.postProcessSuggestedQuery = (suggestedQuery) => {
	let query = suggestedQuery || '';
	// Remove enclosing single or double quotes ChatGPT may have added
	query = query.replace(/^(['"])(.*)\1$/, "$2");
	query = query.trim();
	return query;
}

/*
  ChatGPT usually returns a clean list with a numeric relevance score in each line.
  However, sometimes it gets cheecky and labels them like this: "API 1: 0.5".
  Most of the time we can extract this number by taking the final token and parsing it.
*/
module.exports.postProcessScores = (scoresText) => {
	return scoresText.split('\n').map(scoreLine => {
		let scoreAttempt = Number.parseFloat(scoreLine);
		if (Number.isNaN(scoreAttempt)) {
			scoreAttempt = Number.parseFloat(scoreLine.split(' ').at(-1));
		}
		return scoreAttempt;
	});
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