var gulp = require('gulp');
// Plugins
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');


// browserify task
gulp.task('browserify', function () {
	gulp.src('./js/main.js')
		.pipe(browserify())
		.on('error', swallowError)
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('./js/'));
});

function swallowError(error) {
	//If you want details of the error in the console
	console.log(error.toString());
	console.log("Error Swallowed")
	this.emit('end');
}

// Watch Files For Changes
gulp.task('watch', function () {
	gulp
		.watch(['./js/*.js', './js/**/*.js', '!./js/bundle.js'], [
			'browserify'
		])
		.on('change', function (event) {
			console.log("\n============");
			console.log('File ' + event.path + ' was ' + event.type +
				', running tasks...');
		});
});

// Default Task
gulp.task('default', ['watch', 'browserify']);
