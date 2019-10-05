import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

const EXTERNALS = ["@samuelmeuli/font-manager"];
const GLOBALS = {
	"@samuelmeuli/font-manager": "FontManager",
};
const INPUT_FILE = "./src/FontPicker.ts";
const OUTPUT_NAME = "FontPicker";

export default [
	// Browser configuration
	{
		input: INPUT_FILE,
		output: [
			// File for distribution
			{
				file: "./dist-browser/FontPicker.js",
				format: "umd",
				name: OUTPUT_NAME,
			},
			// File for demo
			{
				file: "./demo/dist/FontPicker.js",
				format: "umd",
				name: OUTPUT_NAME,
			},
		],
		plugins: [
			// Bundle `font-manager` into the package (to make it usable with a <script> tag)
			resolve(),
			typescript(),
		],
	},

	// NPM package configuration
	{
		input: INPUT_FILE,
		output: [
			// UMD
			{
				file: pkg.main,
				format: "umd",
				name: OUTPUT_NAME,
				globals: GLOBALS,
			},
			// ES module
			{
				file: pkg.module,
				format: "esm",
				globals: GLOBALS,
			},
		],
		external: EXTERNALS,
		plugins: [
			typescript({
				tsconfigOverride: {
					compilerOptions: {
						declaration: true,
						declarationMap: true,
					},
				},
			}),
		],
	},
];
