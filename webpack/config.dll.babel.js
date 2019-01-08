import { DllPlugin } from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import fs from 'fs';
import path from 'path';
import WebpackOnBuildPlugin from 'on-build-webpack';

import dllrc from './dllrc';

const outputPath = path.resolve(dllrc.path);

export default () => ({
	devtool: 'inline-source-map',
	context: path.resolve(__dirname, '..'),
	entry: {
		main: dllrc.include
	},
	output: {
		path: outputPath,
		filename: '[name].[hash].dll.js',
		library: '[name]'
	},
	plugins: [
		new CleanWebpackPlugin([dllrc.path], {
			root: process.cwd()
		}),
		new DllPlugin({
			name: '[name]',
			path: path.join(outputPath, 'manifest.json')
		}),
		new WebpackOnBuildPlugin(stats => {
			const { assetsByChunkName } = stats.toJson();
			const pkgPath = path.join(outputPath, 'package.json');
			const pkg = {
				...assetsByChunkName,
				name: path.basename(dllrc.path),
				private: true,
				version: '0.0.1'
			};
			// eslint-disable-next-line no-sync
			fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
		})
	],
	resolve: {
		extensions: ['.js', '.jsx', '.json']
	}
});
