import autoprefixer from "autoprefixer";
import fs from "fs";
import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";

const EXTENSIONS = [".es.js", ".es.js.map", ".js", ".js.map"];
const MANAGER_OUT_TEMP = "./dist/font-manager/FontManager";
const MANAGER_OUT = "./dist/font-manager/font-manager/FontManager";
const PICKER_OUT_TEMP = "./dist/font-picker/FontPicker";
const PICKER_OUT = "./dist/font-picker/font-picker/FontPicker";
const TS_CACHE_DIR = "node_modules/.cache/rollup-plugin-typescript2";

/**
 * Fix file organization in `dist` folder (by default, using Rollup together with Typescript project
 * references results in type definitions being placed in different directories than the bundles)
 */
const cleanDist = (pathOutTemp, pathOut) => ({
	writeBundle() {
		EXTENSIONS.forEach(extension => {
			if (fs.existsSync(`${pathOutTemp}${extension}`)) {
				fs.renameSync(`${pathOutTemp}${extension}`, `${pathOut}${extension}`);
			}
		});
	},
});

/**
 * Copy font picker bundle into demo directory
 */
const copyDist = () => ({
	writeBundle() {
		fs.copyFileSync(`${PICKER_OUT}.js`, `demo/FontPicker.js`);
	},
});

/**
 * Rollup configuration
 */
export default [
	{
		input: "src/font-manager/FontManager.ts",
		output: [
			{
				file: `${MANAGER_OUT_TEMP}.js`,
				format: "umd",
				name: "FontManager",
			},
			{
				file: `${MANAGER_OUT_TEMP}.es.js`,
				format: "esm",
			},
		],
		plugins: [
			typescript({
				cacheRoot: TS_CACHE_DIR,
				tsconfig: "src/font-manager/tsconfig.json",
			}),
			cleanDist(MANAGER_OUT_TEMP, MANAGER_OUT),
		],
	},
	{
		input: "src/font-picker/FontPicker.ts",
		output: [
			{
				file: `${PICKER_OUT_TEMP}.js`,
				format: "umd",
				name: "FontPicker",
			},
			{
				file: `${PICKER_OUT_TEMP}.es.js`,
				format: "esm",
			},
		],
		plugins: [
			postcss({
				plugins: [autoprefixer],
			}),
			typescript({
				cacheRoot: TS_CACHE_DIR,
				tsconfig: "src/font-picker/tsconfig.json",
			}),
			cleanDist(PICKER_OUT_TEMP, PICKER_OUT),
			copyDist(),
		],
	},
];
