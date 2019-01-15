import autoprefixer from 'autoprefixer';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';

import pkg from './package.json';


export default {
	input: 'src/index.js',
	output: [
		{
			file: pkg.main,
			format: 'umd',

			// HACK: export multiple globals (FontPicker and FontManager) by adding them to window
			name: 'window',
			extend: true
		},
		{
			file: pkg.module,
			format: 'esm'
		},
		{
			file: `demo/${pkg.main}`,
			format: 'umd',

			// HACK: export multiple globals (FontPicker and FontManager) by adding them to window
			name: 'window',
			extend: true
		},
		{
			file: `demo/${pkg.module}`,
			format: 'esm'
		}
	],
	plugins: [
		resolve(),
		commonjs(),
		postcss({
			plugins: [autoprefixer]
		}),
		babel({
			exclude: 'node_modules/**'
		})
	]
};
