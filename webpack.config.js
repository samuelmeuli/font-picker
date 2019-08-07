const path = require("path");
const nodeExternals = require("webpack-node-externals");

const baseConfig = {
	entry: "./src/FontPicker.ts",
	devtool: "source-map",
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"],
	},
	module: {
		rules: [
			{
				test: [/\.jsx?$/, /\.tsx?$/],
				use: "babel-loader",
				exclude: /node_modules/,
			},
		],
	},
};
const output = {
	filename: "FontPicker.js",
	library: "FontPicker",
};
const outputBrowser = {
	...output,
	libraryExport: "default",
	libraryTarget: "window",
};
const outputUmd = {
	...output,
	libraryTarget: "umd",
};

module.exports = [
	{
		...baseConfig,
		output: {
			...outputUmd,
			path: path.resolve(__dirname, "dist"),
		},
		externals: [nodeExternals()],
	},
	{
		...baseConfig,
		output: {
			...outputBrowser,
			path: path.resolve(__dirname, "dist-browser"),
		},
	},
	{
		...baseConfig,
		output: {
			...outputBrowser,
			path: path.resolve(__dirname, "demo", "dist"),
		},
	},
];
