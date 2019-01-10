// [https://eslint.org/docs/user-guide/configuring#specifying-globals]
module.exports = {
	"feature-detects": [
		"test/custom-elements",
		"test/history",
		"test/pointerevents",
		"test/postmessage",
		"test/webgl",
		"test/websockets",
		"test/css/animations",
		"test/css/columns",
		"test/css/flexbox",
		"test/elem/picture",
		"test/img/sizes",
		"test/img/srcset",
		"test/workers/webworkers"
	],
	minify: false,
	options: [
		"domPrefixes",
		"prefixes",
		"addTest",
		"hasEvent",
		"mq",
		"prefixedCSSValue",
		"testAllProps",
		"testProp",
		"testStyles",
		"setClasses"
	]
};
