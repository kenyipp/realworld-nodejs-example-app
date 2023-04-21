const EslintPreset = require("@conduit/config/.eslintrc.base.cjs");

module.exports = {
	...EslintPreset,
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["./tsconfig.json"]
	}
};
