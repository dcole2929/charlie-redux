import {
	HotModuleReplacementPlugin,
	DllReferencePlugin,
	ProvidePlugin,
	DefinePlugin
} from 'webpack';
import colors from 'colors/safe';
import fs from 'fs';
import path from 'path';

const GLOBALS = {
	'process.browser': true
};

// eslint-disable-next-line no-sync
if (!fs.existsSync(path.resolve(__dirname, '../.dlls/manifest.json'))) {
	throw new Error(`Hi friend, you need to run this first:
	${colors.red('npm run build:dll')}
Ok, i'm going to crash now, bye.
	`);
}

export default () => ({
	devtool: 'inline-source-map',
	context: path.resolve(__dirname, '..'),
	entry: {
		components: [
			'webpack-hot-middleware/client?reload=true',
			'./polyfills.js',
			'./dev/frontend/index.js'
		],
		styles: ['webpack-hot-middleware/client?reload=true', './dev/styles/index.less']
	},
	output: {
		path: '/',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: [/node_modules/],
				loader: ['react-hot-loader', 'babel-loader']
			},
			{
				test: /\.(less|css)$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: { importLoaders: 1 }
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'less-loader',
						options: { paths: [path.resolve(__dirname, '../node_modules')] }
					}
				]
			},
			{
				test: /pickadate/,
				use: 'imports-loader?define=>false'
			}
		]
	},
	plugins: [
		new ProvidePlugin({ Promise: 'bluebird' }),
		new DefinePlugin(GLOBALS),
		// eslint-disable-next-line import/no-unresolved, global-require
		new DllReferencePlugin({ manifest: require('../.dlls/manifest.json') }),
		new HotModuleReplacementPlugin()
	],
	resolve: {
		alias: {
			process: path.resolve(__dirname, '../dev/frontend/process.shim')
		},
		extensions: ['.js', '.jsx', '.json']
	}
});
