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