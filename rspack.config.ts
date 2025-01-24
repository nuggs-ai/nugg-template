import { rspack } from '@rspack/core';
import * as RefreshPlugin from '@rspack/plugin-react-refresh';
import { withZephyr } from 'zephyr-webpack-plugin';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { processEnvVariables } from './src/lib/env';
import wrapSelector from './src/lib/wrapselector';

const isDev = process.env.NODE_ENV === 'development';
const path = require('path');
const nuggConfig = require('./nugg.json');

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'];

const processEnv = processEnvVariables();

export default withZephyr()({
	entry: {
		main: './src/main.tsx',
	},
	resolve: {
		extensions: ['...', '.ts', '.tsx', '.js', '.jsx', '.json'],
		// @ts-expect-error
		tsConfig: path.resolve(__dirname, "tsconfig.json"),
	},
	devtool: 'source-map',
	devServer: {
		port: 4001,
		hot: true,
		static: {
			directory: path.join(__dirname, 'build'),
		},
		liveReload: false,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
			'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
		},
	},
	output: {
		path: __dirname + '/dist',
		publicPath: 'auto',
		filename: '[name].js',
	},
	watch: true,
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: 'asset',
			},
			{
				test: /src[\/\\]nugg[\/\\].*\.css$/i,
				use: [
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									['tailwindcss', {}],
									['autoprefixer', {}],
									wrapSelector({ wrapper: '#nugg-wrapper' }),
								]
							},
						},
					},
				],
				type: 'css/auto',
			},
			{
				test: /\.css$/,
				exclude: /src[\/\\]nugg[\/\\].*\.css$/i,
				use: [
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									['tailwindcss', {}],
									['autoprefixer', {}],
								]
							},
						},
					},
				],
				type: 'css/auto',
			},
			{
				test: /\.(jsx?|tsx?)$/,
				use: [
					{
						loader: 'builtin:swc-loader',
						options: {
							sourceMap: true,
							jsc: {
								parser: {
									syntax: 'typescript',
									tsx: true,
								},
								transform: {
									react: {
										runtime: 'automatic',
										development: isDev,
										refresh: isDev,
									},
								},
							},
							env: {
								targets: ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'],
							},
						},
					},
				],
			},
		],
	},
	// @ts-expect-error Below are non-blocking error and we are working on improving them
	plugins: [
		new ModuleFederationPlugin({
			name: nuggConfig.scope,
			exposes: {
				[`./${nuggConfig.name}`]: `./src/nugg/${nuggConfig.src}`,
			},
			shared: [{
				'react-dom': {
					singleton: true,
				},
				react: {
					singleton: true,
				},
			},],
			manifest: true
		}),
		new rspack.DefinePlugin({
			'process.env': processEnv
		}),
		new rspack.HtmlRspackPlugin({
			template: './index.html',
			excludeChunks: [nuggConfig.scope],
			filename: 'index.html',
			inject: true,
			publicPath: '/',
		}),
		new rspack.ProgressPlugin({}),
		isDev && new rspack.HotModuleReplacementPlugin(),
		isDev && new RefreshPlugin(),
	].filter(Boolean),
	optimization: {
		minimizer: [
			// @ts-expect-error
			new rspack.SwcJsMinimizerRspackPlugin(),
			// @ts-expect-error
			new rspack.LightningCssMinimizerRspackPlugin({
				minimizerOptions: { targets },
			}),
		],
	},
	experiments: {
		css: true,
	},
});