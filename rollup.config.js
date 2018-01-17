import babel from 'rollup-plugin-babel';


export default {
	input: 'src/FontPicker.js',
	output: {
		file: 'dist/FontPicker.js',
		format: 'iife',
		name: 'FontPicker'
	},
	plugins: [
		babel({
			exclude: 'node_modules/**'
		})
	]
};