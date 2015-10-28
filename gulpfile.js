var gulp = require('gulp');

//util
var plumber = require('gulp-plumber');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');

//js
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');

//css
var less = require('gulp-less');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');

gulp.task('js', function () {
	return browserify({
		entries: './src/js/ChessGrapher.js',
		debug: true
	})
	// .add(require.resolve('babel/polyfill'))
	.transform(babelify)
	.bundle()
		.on('error', errorHandler)
	.pipe(source('ChessGrapher.js'))
	.pipe(buffer())
	.pipe(gulp.dest('./dist/'))
	.pipe(rename('ChessGrapher.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./dist/'))
	.pipe(browserSync.reload({stream:true}))
	;
});

gulp.task('less', function () {
	return gulp.src('./src/less/ChessGrapher.less')
		.pipe(plumber())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(less())
			.on('error', errorHandler)
		.pipe(postcss([
			autoprefixer({
				browsers: ['last 2 versions']
			}),
			mqpacker,
			csswring({
				removeAllComments: true
			})
		]))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist'))
		.pipe(browserSync.reload({stream:true}))
	;
});

gulp.task('serve', function() {
	return browserSync.init({
		server: {
			baseDir: './'
		},
		open: false
	});
});

gulp.task('watch', ['serve'], function () {
	gulp.watch('src/js/*.js', ['js']);
	gulp.watch('src/less/*.less', ['less']);

	gulp.watch('test/*.html', browserSync.reload);
});

function errorHandler(err) {
	/*eslint no-console: 0*/
	console.log(err);
	this.emit('end');
}