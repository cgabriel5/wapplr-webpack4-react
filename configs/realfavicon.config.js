// Modify the RealFaviconGenerator configuration to one's liking.
// [https://realfavicongenerator.net/]

module.exports = {
	masterPicture: "./src/assets/favicon/source/leaf-900.png",
	dest: "./src/assets/favicon/bundle",
	iconsPath: "assets/favicons",
	design: {
		ios: {
			pictureAspect: "backgroundAndMargin",
			backgroundColor: "#f6f5dd",
			margin: "53%",
			assets: {
				ios6AndPriorIcons: false,
				ios7AndLaterIcons: false,
				precomposedIcons: true,
				declareOnlyDefaultIcon: true
			}
		},
		desktopBrowser: {},
		windows: {
			pictureAspect: "whiteSilhouette",
			backgroundColor: "#00a300",
			onConflict: "override",
			assets: {
				windows80Ie10Tile: true,
				windows10Ie11EdgeTiles: {
					small: false,
					medium: true,
					big: false,
					rectangle: false
				}
			}
		},
		androidChrome: {
			pictureAspect: "backgroundAndMargin",
			margin: "42%",
			backgroundColor: "#f6f5dd",
			themeColor: "#ffffff",
			manifest: {
				name: "wapplr",
				display: "standalone",
				orientation: "notSet",
				onConflict: "override",
				declared: true
			},
			assets: {
				legacyIcon: false,
				lowResolutionIcons: false
			}
		},
		safariPinnedTab: {
			pictureAspect: "silhouette",
			themeColor: "#669935"
		}
	},
	settings: {
		compression: 1,
		scalingAlgorithm: "Mitchell",
		errorOnImageTooSmall: false,
		readmeFile: true,
		htmlCodeFile: true,
		usePathAsIs: false
	},
	markupFile: "./configs/favicondata.json"
};
