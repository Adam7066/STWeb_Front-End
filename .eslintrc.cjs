module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		"./.eslintrc-auto-import.json",
		"eslint:recommended",
		"plugin:vue/vue3-essential",
		"plugin:@typescript-eslint/recommended",
	],
	overrides: [],
	parser: "vue-eslint-parser",
	parserOptions: {
		ecmaVersion: "latest",
		parser: "@typescript-eslint/parser",
		sourceType: "module",
	},
	plugins: ["vue", "@typescript-eslint", "prettier"],
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "never"],
		"prettier/prettier": "error",
		camelcase: [2],
	},
}
