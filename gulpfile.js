// Get needed modules.
const gulp = require("gulp");
const rf = require("gulp-real-favicon");

// Get config files.
const config = {
	rf: require("./configs/realfavicon.config.js")
};

// // File where the favicon markups are stored
// var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever rfGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task("generate-favicon", function(done) {
	rf.generateFavicon(config.rf, function() {
		done();
	});
});

// // Inject the favicon markups in your HTML pages. You should run
// // this task whenever you modify a page. You can keep this task
// // as is or refactor your existing HTML pipeline.
// gulp.task('inject-favicon-markups', function() {
// 	return gulp.src([ 'TODO: List of the HTML files where to inject favicon markups' ])
// 		.pipe(rf.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
// 		.pipe(gulp.dest('TODO: Path to the directory where to store the HTML files'));
// });

// // Check for updates on rfGenerator (think: Apple has just
// // released a new Touch icon along with the latest version of iOS).
// // Run this task from time to time. Ideally, make it part of your
// // continuous integration system.
// gulp.task('check-for-favicon-update', function(done) {
// 	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
// 	rf.checkForUpdates(currentVersion, function(err) {
// 		if (err) {
// 			throw err;
// 		}
// 	});
// });
