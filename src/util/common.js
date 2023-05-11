// verify properties of the request body
module.exports.body = (requiredFields) => {
	let requiredFieldList = [];
	if (typeof requiredFields === 'string') {
		requiredFieldList.push(requiredFields);
	} else if (requiredFields instanceof Array) {
		requiredFieldList = requiredFields;
	}

	const validator = (req, res, next) => {
		let error;

		if (requiredFields != null) {
			let missingFields = [];

			requiredFieldList.forEach(field => {
				if (!Object.keys(req.body).includes(field)) {
					missingFields.push(field);
				}
			});

			if (missingFields.length > 0) {
				error = new Error(`Missing body fields: ${missingFields.join(', ')}`);
				error.status = 400;
			}
		}

		next(error);
	};

	return validator;
};

// generic "end behavior" express middleware
module.exports.return = (req, res, next) => {
	if (req.result != null) {
		res.json(req.result);
	} else {
		res.json({
			status: 'ok'
		});
	}
};