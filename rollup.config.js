import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";

import pkg from "./package.json";

const EXTENSIONS = [".js", ".ts"];

export default {
	input: "./src/FontPicker.ts",
	output: [
		{
			file: pkg.main,
			format: "umd",
			name: "FontPicker",
		},
		{
			file: "./demo/dist/FontPicker.js",
			format: "umd",
			name: "FontPicker",
		},
		{
			file: pkg.module,
			format: "esm",
		},
	],
	plugins: [
		// Resolve TypeScript files and dependencies
		// Bundle `font-manager` into the package (to make it usable with a <script> tag)
		resolve({
			extensions: EXTENSIONS,
		}),
		// Transform TypeScript with Babel
		babel({
			presets: ["@babel/preset-env", "@babel/preset-typescript"],
			plugins: ["@babel/plugin-proposal-class-properties"],
			exclude: "./node_modules/**",
			extensions: EXTENSIONS,
		}),
	],
};
