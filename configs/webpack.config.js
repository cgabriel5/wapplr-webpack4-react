// Stock modules.
const fs = require("fs");
const os = require("os");
const path = require("path");

// Webpack modules.
const webpack = require("webpack");
const happypack = require("happypack");
const happy_thread_pool = happypack.ThreadPool({ size: os.cpus().length });
const plugins = {
	copy: require("copy-webpack-plugin"),
	html: require("html-webpack-plugin"),
	md5hash: require("webpack-md5-hash"),
	notifier: require("webpack-notifier"),
	clean: require("clean-webpack-plugin"),
	favicons: require("favicons-webpack-plugin"),
	minicssextract: require("mini-css-extract-plugin"),
	htmlminifier: require("html-minifier-webpack-plugin"),
	perf: require("speed-measure-webpack-plugin")
};
require("@babel/register");

// Get config files.
const config = {
	babel: require("./babel.config.js"),
	postcss: require("./postcss.config.js")
};

// Get run mode.
const mode = process.env.NODE_ENV;
const is_prod = mode === "production";
const is_dev = mode === "development";

// Vars.
const __copy = new plugins.copy(
	[
		// Copy the favicon files.
		{
			from: "./src/assets/favicon/bundle",
			to: "./assets/favicons/",
			ignore: ["*.html", "*.md"]
		},
		// Copy the DLL file.
		{
			from: "./src/.dll/vendor.js",
			to: "./js/"
			// ignore: ["*.html", "*.md"]
		}
	],
	{ debug: false }
);
const __htmlminifier = new plugins.htmlminifier({
	// [https://github.com/jantimon/html-webpack-plugin#minification]
	collapseWhitespace: is_prod,
	removeComments: is_prod,
	removeRedundantAttributes: is_prod,
	removeScriptTypeAttributes: is_prod,
	removeStyleLinkTypeAttributes: is_prod,
	useShortDoctype: is_prod
});
const smp = new plugins.perf({
	outputFormat: "humanVerbose",
	pluginNames: {
		CopyWebpackPlugin: __copy,
		HtmlMinifierPlugin: __htmlminifier
	}
});
const new_filename = "[name]-[hash:18].[ext]";
const __rootdir = __dirname.replace("/configs", "");
const __plugins = [
	new webpack.DefinePlugin({
		"process.env.NODE_ENV": JSON.stringify(mode)
	}),
	new plugins.clean(["../dist"], {
		allowExternal: true
	}),
	new happypack({
		id: "html",
		threadPool: happy_thread_pool,
		verbose: false,
		loaders: [{ loader: "underscore-template-loader" }]
	}),
	new happypack({
		id: "javascript",
		threadPool: happy_thread_pool,
		verbose: false,
		loaders: [
			{
				loader: "babel-loader",
				options: config.babel
			}
		]
	}),
	new happypack({
		id: "styles:css-loader",
		threadPool: happy_thread_pool,
		verbose: false,
		loaders: [
			{
				loader: "css-loader",
				options: {
					modules: true,
					sourceMap: true,
					importLoaders: 2,
					hashPrefix: "hash",
					// exportOnlyLocals: true,
					localIdentName: "__[local]--[hash:base64]"
				}
			}
		]
	}),
	new happypack({
		id: "styles:sass-loader",
		threadPool: happy_thread_pool,
		verbose: false,
		loaders: [
			{
				loader: "sass-loader",
				options: {
					sourceMap: true,
					sourceMapContents: true
				}
			}
		]
	}),
	new plugins.html({
		hash: true,
		filename: "./index.html",
		template: "./src/index.html",
		title: "wapplr",
		description: "My app.",
		metainfo: "width=device-width,initial-scale=1,shrink-to-fit=no",
		favicons: fs
			.readFileSync("./src/assets/favicon/bundle/html_code.html")
			.toString()
	}),
	new plugins.md5hash(),
	__htmlminifier,
	new plugins.minicssextract({
		chunkFilename: "[id].css",
		filename: `css/${new_filename}`.replace(/\[ext\]/, "css")
	}),
	new webpack.HotModuleReplacementPlugin(),
	__copy,
	new plugins.notifier({
		title: "Webpack",
		alwaysNotify: true,
		contentImage: path.join(
			__rootdir,
			"src/assets/favicon/source/leaf-900.png"
		)
	})
];

// Add DLL for development mode.
if (!is_prod) {
	__plugins.unshift(
		new webpack.DllReferencePlugin({
			context: __rootdir,
			manifest: require("../src/.dll/vendor-manifest.json")
		})
	);
}

module.exports = smp.wrap({
	entry: {
		app: "./src/js/index.js"
	},
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: `js/${new_filename}`.replace(/\[ext\]/, "js")
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				use: "happypack/loader?id=html"
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: "happypack/loader?id=javascript"
			},
			// {
			// 	enforce: "pre",
			// 	test: /\.jsx?$/,
			// 	include: /src/,
			// 	use: [
			// 		// [https://www.robinwieruch.de/react-eslint-webpack-babel/]
			// 		// [https://stackoverflow.com/questions/36188569/configuring-eslint-with-jsx]
			// 		// [https://github.com/webpack-contrib/eslint-loader/issues/129#issuecomment-407681504]
			// 		// NOTE: Using 'babel-loader' causes eslint to freak out and
			// 		// break. Not using lets eslint run normally.
			// 		// "babel-loader",
			// 		{
			// 			loader: "eslint-loader",
			// 			options: {
			// 				// emitWarning: is_dev,
			// 				// Custom config file path.
			// 				// [https://github.com/webpack-contrib/eslint-loader/issues/129#issuecomment-264917847]
			// 				configFile: "./configs/eslint.config.js",
			// 				quiet: true,
			// 				fix: false,
			// 				formatter: require("eslint-formatter-simple")
			// 			}
			// 		}
			// 	]
			// },
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					is_prod
						? {
								loader: plugins.minicssextract.loader,
								options: {
									// [https://github.com/webpack-contrib/mini-css-extract-plugin/issues/222#issuecomment-417929423]
									publicPath: "../"
								}
						  }
						: "style-loader",
					"happypack/loader?id=styles:css-loader",
					// Don't use postcss with happypack for parallelization:
					// [https://github.com/amireh/happypack/issues/84#issuecomment-246665456]
					{
						// [https://stackoverflow.com/a/49789678]
						loader: "postcss-loader",
						// Config via object.
						options: config.postcss
						// Or via a config a path.
						// options: { config: { path: './configs/' } }
					},
					"happypack/loader?id=styles:sass-loader"
				],
				exclude: /node_modules/
			},
			// Media files (images/fonts)
			{
				// Specify enforce: 'pre' to apply the loader
				// before url-loader/svg-url-loader
				// and not duplicate it in rules with them.
				// [https://iamakulov.com/notes/optimize-images-webpack/]
				enforce: "pre",
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [
					{
						loader: "image-webpack-loader",
						options: {
							disable: is_dev,
							gifsicle: {
								interlaced: false
							},
							// Disable this optimizer by default to use pngquant.
							optipng: {
								enabled: false
							},
							pngquant: {
								quality: "85-90",
								speed: 4
							},
							mozjpeg: {
								progressive: true,
								quality: 85
							},
							svgo: {
								plugins: [
									{ removeViewBox: false },
									{ removeEmptyAttrs: false }
								]
							},
							webp: { quality: 75 }
						}
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.(gif|png|jpe?g|ico)$/,
				use: [
					{
						loader: "url-loader",
						options: {
							// Images larger than 10 KB won’t be inlined.
							limit: 10 * 1024,
							// [https://github.com/webpack-contrib/url-loader/issues/165]
							// [https://github.com/tcoopman/image-webpack-loader/issues/149#issuecomment-377711218]
							name: new_filename,
							outputPath: "assets/img"
						}
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.svg$/,
				// Skip loader on font files or else they won't load.
				// [https://github.com/bhovhannes/svg-url-loader/issues/111]
				// exclude: /fonts/,
				// exclude: /node_modules/,
				// [https://github.com/webpack-contrib/jshint-loader/issues/3#issuecomment-47330893]
				// [https://stackoverflow.com/a/36458947]
				exclude: [/fonts/, /node_modules/],
				use: {
					loader: "svg-url-loader",
					options: {
						// Images larger than 10 KB won’t be inlined.
						limit: 10 * 1024,
						name: new_filename,
						outputPath: "assets/img",
						// Remove quotes around the encoded URL –
						// they’re rarely useful.
						noquotes: true
					}
				}
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: new_filename,
							outputPath: "assets/fonts",
							// [https://github.com/webpack-contrib/mini-css-extract-plugin/issues/222#issuecomment-417929423]
							publicPath: is_prod ? "../assets/fonts" : null
						}
					}
				],
				exclude: /node_modules/
			},
			// Data files.
			{
				test: /\.(csv|tsv)$/,
				use: [
					{
						loader: "csv-loader",
						options: {
							name: new_filename
						}
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.xml$/,
				use: [
					{
						loader: "xml-loader",
						options: {
							name: new_filename
						}
					}
				],
				exclude: /node_modules/
			},
			{
				// [https://github.com/peerigon/modernizr-loader/issues/44#issuecomment-405607053]
				test: /modernizr\.config\.js$/,
				use: ["webpack-modernizr-loader"]
			}
		]
	},
	plugins: __plugins,
	devServer: {
		// [https://webpack.js.org/configuration/dev-server/#devserver-port]
		// [https://matmunn.me/post/webpack-browsersync-php/]
		contentBase: "src/", // Relative directory for base of server.
		publicPath: "/", // Live-reload.
		hot: true,
		inline: true,
		noInfo: true,
		overlay: true,
		host: "localhost",
		historyApiFallback: true
	},
	// Add the following CLI options to generate sourcemaps:
	// [https://stackoverflow.com/a/46372748]
	devtool: is_prod ? "source-map" : "eval-source-map",
	// [https://webpack.js.org/configuration/stats/]
	stats: "errors-only",
	resolve: {
		alias: {
			modernizr$: path.resolve(__dirname, "./modernizr.config.js")
		}
	}
});
