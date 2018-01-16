import babel from 'rollup-plugin-babel';


export default {
	input: 'src/index.js',
	output: {
		file: 'dist/index.js',
		format: 'iife',
		name: 'FontPicker'
	},
	plugins: [
		babel({
			exclude: 'node_modules/**'
		})
	]
};