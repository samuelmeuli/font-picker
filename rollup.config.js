import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';


export default {
	input: 'src/FontPicker.js',
	output: {
		file: 'dist/FontPicker.js',
		format: 'iife',
		name: 'FontPicker'
	},
	plugins: [
		postcss(),
		babel({
			exclude: 'node_modules/**'
		})
	]
};