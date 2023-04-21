const EslintPreset = require("./.eslintrc.base.cjs");

module.exports = {
	...EslintPreset,
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["./tsconfig.json"]
	}
};
