const axios = require('axios');

const parseSearchResultsResponse = (response) => {
	const { data: searchResults } = response;
	return searchResults.map(searchResult => {
		const { score, document: doc } = searchResult;
		const { id: requestID, method, name, url, publisherName, workspaces } = doc;
		
		// Let's pull out the most relevant information we can get
		return { requestID, name, publisherName, score, method, url };
	});
};

module.exports.searchPublicRequests = async(query, limit = 10) => {
	// filter to only 'request' searches ('runtime.request') for now
	const proxyUrl = 'https://www.postman.com/_api/ws/proxy';
	const response = await axios.post(proxyUrl, {
			service: 'search',
			method: 'POST',
			path: '/search-all',
			body: {
				'domain': 'public',
				'from': 0,
				'nested': false,
				'nonNestedRequests': true,
				'mergeEntities': true,
				'queryIndices': ['runtime.request'],
				'queryText': query,
				'size': limit,
			}
	});
	return parseSearchResultsResponse(response.data)
};