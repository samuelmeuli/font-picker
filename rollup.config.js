import autoprefixer from "autoprefixer";
import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

export default [
	{
		input: "src/font-manager/FontManager.ts",
		output: [
			{
				file: "dist/font-manager/FontManager.js",
				format: "umd",
				name: "FontManager",
			},
			{
				file: "dist/font-manager/FontManager.es",
				format: "esm",
			},
		],
		plugins: [
			typescript({
				cacheRoot: "node_modules/.cache/rollup-plugin-typescript2",
				tsconfig: "src/font-manager/tsconfig.json",
			}),
		],
	},
	{
		input: "src/font-picker/FontPicker.ts",
		output: [
			// NPM build
			{
				file: pkg.main,
				format: "umd",
				name: "FontPicker",
			},
			{
				file: pkg.module,
				format: "esm",
			},
			// Demo
			{
				file: `demo/dist/FontPicker.js`,
				format: "umd",
				name: "FontPicker",
			},
		],
		plugins: [
			postcss({
				plugins: [autoprefixer],
			}),
			typescript({
				cacheRoot: "node_modules/.cache/rollup-plugin-typescript2",
				tsconfig: "src/font-picker/tsconfig.json",
			}),
		],
	},
];
