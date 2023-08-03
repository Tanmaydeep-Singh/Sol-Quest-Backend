module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "tsconfig.json",
		tsconfigRootDir: __dirname,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint/eslint-plugin"],
	extends: ["plugin:@typescript-eslint/recommended", "airbnb-base", "prettier"],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: [".eslintrc.js"],
	settings: {
		"import/resolver": {
			node: {
				extensions: [".ts"],
			},
		},
	},
	rules: {
		"no-shadow": "off",
		"@typescript-eslint/no-shadow": ["error"],
		"import/no-unresolved": "off",
		"import/extensions": [
			"error",
			"ignorePackages",
			{
				js: "never",
				jsx: "never",
				ts: "never",
				tsx: "never",
				css: "never",
			},
		],
		quotes: ["error", "double", { allowTemplateLiterals: true }],
		"max-len": [
			"error",
			{
				ignoreComments: true,
				ignoreTrailingComments: true,
				ignoreStrings: true,
				ignoreUrls: true,
				code: 100,
			},
		],
		indent: "off",
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": [
			"error",
			{
				argsIgnorePattern: "^_",
				destructuredArrayIgnorePattern: "^_",
				ignoreRestSiblings: true,
			},
		],
		"max-classes-per-file": "off",
		"no-shadow": "off",
		"@typescript-eslint/no-shadow": ["warn"],
		"no-useless-constructor": "off",
		"comma-dangle": "off",
		"no-underscore-dangle": "off",
		"object-curly-newline": "off",
		"no-tabs": ["warn", { allowIndentationTabs: true }],
		"no-useless-constructor": "warn",
		"no-empty-function": "warn",
		"implicit-arrow-linebreak": "off",
		"class-methods-use-this": "off",
		"import/prefer-default-export": "off",
		"import/no-extraneous-dependencies": [
			"error",
			{
				devDependencies: ["**/*.spec.ts", "**/*-spec.ts"],
				packageDir: __dirname,
			},
		],
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
	},
};
