// Get needed modules.
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");
const unprefix = require("postcss-unprefix");
const perfectionist = require("perfectionist");
const shorthand = require("postcss-merge-longhand");

// Get config files.
const config = {
	autoprefixer: require("./autoprefixer.config.js"),
	perfectionist: require("./perfectionist.config.js"),
	cssnano: require("./cssnano.config.js")
};

// Get run mode.
const mode = process.env.NODE_ENV;
const is_prod = mode === "production";

// Vars.
const plugins = [
	unprefix(),
	shorthand(),
	autoprefixer(config.autoprefixer),
	// Minimize for production, beautify for development.
	is_prod ? cssnano(config.cssnano) : perfectionist(config.perfectionist)
];

// [https://stackoverflow.com/a/49789678]

// Config via object.
module.exports = {
	plugins: () => plugins,
	sourceMap: true
};

// Or via a config a path.
// module.exports = {
// 	plugins,
// 	sourceMap: true
// };
