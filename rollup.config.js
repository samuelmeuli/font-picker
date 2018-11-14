import autoprefixer from 'autoprefixer';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';


export default {
	input: 'src/index.js',
	output: [
		{
			file: 'lib/font-picker.js',
			format: 'umd',

			// HACK: export multiple globals (FontPicker and FontManager) by adding them to window
			name: 'window',
			extend: true
		},
		{
			file: 'demo/lib/font-picker.js',
			format: 'umd',
			sourcemap: true,

			// HACK: export multiple globals (FontPicker and FontManager) by adding them to window
			name: 'window',
			extend: true
		}
	],
	plugins: [
		postcss({
			plugins: [autoprefixer]
		}),
		babel({
			exclude: 'node_modules/**'
		})
	]
};
