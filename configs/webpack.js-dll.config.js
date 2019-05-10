// Stock modules.
const path = require("path");

// Webpack modules.
const webpack = require("webpack");
const plugins = {
	notifier: require("webpack-notifier"),
	minicssextract: require("mini-css-extract-plugin")
};

// Get config files.
const config = {
	babel: require("./babel.config.js"),
	postcss: require("./postcss.config.js")
};

// Get run mode.
const mode = process.env.NODE_ENV;
const is_prod = mode === "production";

// Vars.
const new_filename = "[name]-[hash:18].[ext]";
const odir = "../src/.dll";

module.exports = {
	entry: {
		vendor: [
			// "font-awesome/scss/font-awesome.scss",
			"./src/styles/font-awesome/fontawesome.scss",
			"lodash",
			"react",
			"react-dom"
		]
	},
	output: {
		path: path.resolve(__dirname, odir),
		filename: "[name].js",
		library: "[name]_[hash]"
	},

	module: {
		rules: [
			{
				test: /\.html$/,
				use: [
					{
						loader: "underscore-template-loader"
					}
				]
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: config.babel
				}
			},
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
					},
					{
						// [https://stackoverflow.com/a/49789678]
						loader: "postcss-loader",
						// Config via object.
						options: config.postcss
						// Or via a config a path.
						// options: {
						// 	config: {
						// 		path: './configs/'
						// 	}
						// }
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: true,
							sourceMapContents: true
						}
					}
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
				]
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
				]
			},
			{
				test: /\.svg$/,
				// Skip loader on font files or else they won't load.
				// [https://github.com/bhovhannes/svg-url-loader/issues/111]
				exclude: /fonts/,
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
							publicPath: is_prod ? "../assets/fonts" : ""
						}
					}
				]
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
				]
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
				]
			},
			{
				// [https://github.com/peerigon/modernizr-loader/issues/44#issuecomment-405607053]
				test: /modernizr\.config\.js$/,
				use: ["webpack-modernizr-loader"]
			}
		]
	},
	plugins: [
		new plugins.minicssextract({
			chunkFilename: "[id].css",
			filename: `css/${new_filename}`.replace(/\[ext\]/, "css")
		}),
		new plugins.notifier({
			title: "Webpack",
			alwaysNotify: true,
			contentImage: path.join(
				__dirname.replace("/configs", ""),
				"src/assets/favicon/source/leaf-900.png"
			)
		}),
		new webpack.DllPlugin({
			path: path.join(__dirname, odir, "[name]-manifest.json"),
			name: "[name]_[hash]"
		})
	],
	// [https://webpack.js.org/configuration/stats/]
	stats: "errors-only",
	resolve: {
		alias: {
			modernizr$: path.resolve(__dirname, "./modernizr.config.js")
		}
	}
};
