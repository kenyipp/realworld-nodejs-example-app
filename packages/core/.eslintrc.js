const EslintPreset = require("@conduit/config/build/eslint-preset");

module.exports = {
	... EslintPreset,
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: [
			"./tsconfig.json"
		]
	}
};
