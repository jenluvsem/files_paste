const path = require('path')
const webpack = require('webpack')

module.exports = {
	mode: 'production',
	entry: './src/main.ts',
	output: {
		path: path.resolve(__dirname, 'js'),
		filename: 'files_paste-main.js',
	},
	resolve: {
		extensions: ['.ts', '.js', '.json'],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			__NEXTCLOUD__: JSON.stringify(true),
		}),
	],
}
