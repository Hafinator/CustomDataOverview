/// <binding AfterBuild='buildAll' ProjectOpened='watch' />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp'),
	mainBowerFiles = require('main-bower-files'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	filter = require('gulp-filter'),
	jshint = require('gulp-jshint'),
	del = require('del'),
	sequence = require('run-sequence'),
	flatten = require('gulp-flatten');

var _baseTargetPath = '../REST';

gulp.task('3rd_all', ['bower_js', 'bower_css', 'bower_fontawesome', 'other_w3css', 'other_js']);
gulp.task('bower_js', function () {
	const f = filter(['**/*.min.js', '**/*.js']);

	return gulp.src(['bower_lib/**/*'])
		.pipe(f)
		.pipe(flatten())
		.pipe(gulp.dest('wwwroot/3rd/scripts'));
});
gulp.task('bower_css', function () {
	const f = filter(['**/*.min.{css,scss}', '**/*.css']);

	return gulp.src('bower_lib/**/*')
		.pipe(f)
		.pipe(flatten())
		.pipe(gulp.dest('wwwroot/3rd/styles/css'));
});
gulp.task('bower_fontawesome', function () {
	const f = filter(['**', '!**/*.{js,json}']);

	return gulp.src('bower_lib/font-awesome/**/*')
		.pipe(f)
		.pipe(gulp.dest('wwwroot/3rd/styles'));
});
gulp.task('other_w3css', function () {
	const f = filter(['**', '!**/*.{css}']);

	return gulp.src('other_lib/**/*')
		.pipe(f)
		.pipe(gulp.dest('wwwroot/3rd/styles/css'));
});
gulp.task('other_js', function () {
	const f = filter(['**', '!**/*.{js}']);

	return gulp.src('other_lib/**/*')
		.pipe(f)
		.pipe(gulp.dest('wwwroot/3rd/scripts'));
});

gulp.task('ToService_app', function () {
	return gulp.src('wwwroot/app/**/*.*')
		.pipe(gulp.dest(_baseTargetPath + '/app'));
});
gulp.task('ToService_3rd', function () {
	return gulp.src('wwwroot/3rd/**/*.*')
		.pipe(gulp.dest(_baseTargetPath + '/3rd'));
});
gulp.task('ToService_index', function () {
	return gulp.src('wwwroot/index.html')
		.pipe(gulp.dest(_baseTargetPath));
});
gulp.task('ToService_all', ['ToService_app', 'ToService_3rd', 'ToService_index']);

gulp.task('buildAll', function () {
	sequence('3rd_all', 'ToService_all');
});

gulp.task('watch', function () {
	gulp.watch('wwwroot/app/**/*.js', function () {
		sequence('ToService_app');
	});
	gulp.watch('wwwroot/app/**/**/*.js', function () {
		sequence('ToService_app');
	});
	gulp.watch('wwwroot/app/**/*.html', function () {
		sequence('ToService_app');
	});
	gulp.watch('wwwroot/app/**/**/*.html', function () {
		sequence('ToService_app');
	});
	gulp.watch('wwwroot/scripts/**/*.js', function () {
		sequence('ToService_app');
	});
	gulp.watch('wwwroot/directives/**/*.js', function () {
		sequence('ToService_app');
	});
	gulp.watch('wwwroot/index.html', function () {
		sequence('ToService_app', 'ToService_index');
	});
});