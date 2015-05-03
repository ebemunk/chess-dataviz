var gulp = require('gulp');
var plumber = require('gulp-plumber');

var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');

var less = require('gulp-less');

var sourcemaps = require('gulp-sourcemaps');

var browserSync = require('browser-sync').create();

gulp.task('js', function () {
	return browserify('./src/js/ChessGrapher.js', {debug: true})
		.add(require.resolve('babel/polyfill'))
		.transform(babelify)
		.bundle()
			.on('error', function (err) {
				console.log(err.message);
				this.emit('end');
			})
		.pipe(source('ChessGrapher.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(uglify({mangle: false}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./build'))
		.pipe(browserSync.reload({stream:true}))
	;
});

gulp.task('less', function () {
	return gulp.src('./src/less/ChessGrapher.less')
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(less())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./build'))
		.pipe(browserSync.reload({stream:true}))
	;
});

gulp.task('serve', function() {
	return browserSync.init({
		server: {
			baseDir: "./"
		},
		open: false
	});
});

gulp.task('watch', ['serve'], function () {
	gulp.watch('src/js/*.js', ['js']);
	gulp.watch('src/less/*.less', ['less']);

	gulp.watch('test/*.html', browserSync.reload);
});