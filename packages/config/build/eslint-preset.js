module.exports = {
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"eslint-config-airbnb-base",
		"airbnb-typescript"
	],
	env: {
		es2021: true,
		node: true
	},
	parser: "@typescript-eslint/parser",
	plugins: [
		"@typescript-eslint"
	],
	rules: {
		"import/prefer-default-export": "off",
		"no-tabs": ["off"],
		"max-len": ["off"],
		"no-await-in-loop": "off",
		"react/jsx-filename-extension": "off",
		"class-methods-use-this": "off",
		"no-param-reassign": "off",
		"padded-blocks": ["error", { "switches": "never", "classes": "always", "blocks": "never" }],

		"@typescript-eslint/quotes": ["error", "double"],
		"@typescript-eslint/indent": ["error", "tab"],
		"@typescript-eslint/comma-dangle": ["error", "never"],
		"@typescript-eslint/no-namespace": "off",
		// A better practice is to define all needed variables and test data towards the end of the test suite,
		// so the one interested in seeing tests does not have to scroll down and look for them.
		// One should be able to see the test cases right away and if interested in their setup and implementation,
		// scroll down and search within the file.
		"@typescript-eslint/no-use-before-define": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }]
	},
	overrides: [
		{
			files: ["*.spec.{js,ts}"],
			env: {
				mocha: true,
				node: true,
			},
			rules: {
				"no-unused-expressions": "off",
				"@typescript-eslint/no-unused-expressions": "off",
				"@typescript-eslint/no-throw-literal": "off"
			},
		},
	]
};
