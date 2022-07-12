"use strict";

const joiToSwagger = require("joi-to-swagger");

function getSwaggerFromJoi(schema) {
	const result = {};

	Object
		.keys(schema)
		.forEach((type) => {
			const member = {};
			Object
				.keys(schema[type])
				.forEach((definition) => {
					if (schema[type][definition].isJoi) {
						member[definition] = joiToSwagger(schema[type][definition]).swagger;
					} else {
						member[definition] = schema[type][definition];
					}
				});
			result[type] = member;
		});

	return result;
}

module.exports = getSwaggerFromJoi;
