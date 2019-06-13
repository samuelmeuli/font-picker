import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

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
		// Bundle `font-manager` into the package (to make it usable with a <script> tag)
		resolve(),
		typescript({
			cacheRoot: "./node_modules/.cache/rollup-plugin-typescript2/",
		}),
	],
};
