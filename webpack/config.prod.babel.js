import { ProvidePlugin, DefinePlugin, optimize } from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import path from 'path';

import pkg from '../package.json';

const GLOBALS = {
	'process.browser': true,
	'process.env.NODE_ENV': JSON.stringify('production')
};

const escapeRegExp = str => str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');

const whitelistDependencies = Object.keys(pkg.dependencies).map(
	key => new RegExp(`^${escapeRegExp(key)}(?:\\/|$)`)
);

export default () => ({
	context: path.resolve(__dirname, '..'),
	entry: {
		components: ['./polyfills.js', './frontend/analytics.js', './frontend/index.jsx'],
		styles: './frontend/styles/index.less'
	},
	output: {
		path: path.resolve(__dirname, '../build'),
		publicPath: '/',
		filename: '[name].js',
		libraryTarget: 'commonjs2'
	},
	externals: [
		(context, request, cb) => {
			switch (true) {
				default:
					cb();
			}
		},
		nodeExternals({
			whitelist: [
				...whitelistDependencies,
				// this is not used in prod build, but needs to be included here to prevent build error
				'redux-immutable-state-invariant',
				// es6 dep of redux
				/^lodash-es(?:\/|$)/,
			]
		})
	],
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: [/node_modules/],
				loader: 'babel-loader'
			},
			{
				test: /\.(less|css)$/,
				exclude: /node_modules/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: { importLoaders: 1, autoprefixer: false, discardUnused: true }
						},
						{
							loader: 'postcss-loader'
						},
						{
							loader: 'less-loader',
							options: { paths: [path.resolve(__dirname, './../node_modules')] }
						}
					]
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('[name].css'),
		new DefinePlugin(GLOBALS),
		new ProvidePlugin({ Promise: 'bluebird' }),
		new optimize.ModuleConcatenationPlugin(),
		new optimize.UglifyJsPlugin({
			output: { beautify: true, comments: true },
			mangle: false,
			sourceMap: true
		})
	],
	resolve: {
		extensions: ['.js', '.jsx', '.json']
	}
});
