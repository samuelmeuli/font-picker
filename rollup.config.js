import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';


export default {
	input: 'src/FontPicker.js',
	output: [
		{
			file: 'lib/index.js',
			format: 'umd',
			name: 'FontPicker'
		},
		{
			file: 'demo/index.js',
			format: 'umd',
			name: 'FontPicker'
		}],
	plugins: [
		postcss(),
		babel({
			exclude: 'node_modules/**',
			plugins: ['external-helpers']
		})
	]
};