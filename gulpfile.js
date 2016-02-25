"use strict";

var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var minifycss = require('gulp-minify-css');
var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'gulp-minify-css'],
  replaceString: /\bgulp[\-.]/
  // gulp-open, gulp-connect ....
});
var browserify = require('browserify'); // Bundles JS
var reactify = require('reactify'); // Transforms React JSX to JS
var source = require('vinyl-source-stream'); // Use conventional text streams with Gulp
var transform = require('vinyl-transform');



// Config dev server
var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        components: './src/components/**',
        dist: './dist',
        mainJs: './src/main.js'
    }
}

// Copy src html to dist
gulp.task('html', function() {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(plugins.connect.reload());
});

// vendors
gulp.task('vendors', function() {
//    plugins.util.log(mainBowerFiles('**/*'));

    var jsFilter = plugins.filter('**/**/*.js', { restore: true });
    var cssFilter = plugins.filter('**/**/*.css', { restore: true });

    gulp.src(plugins.mainBowerFiles())
        .pipe(jsFilter)
        .pipe(plugins.if('!*.min.js', plugins.uglify()))
        .pipe(plugins.if('!*.min.js', plugins.rename({ suffix: ".min"})))
        .pipe(plugins.concat('combined.min.js'))
        .pipe(gulp.dest(config.paths.dist + '/vendors/js'))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(plugins.if('!*.min.css', minifycss()))
        .pipe(plugins.if('!*.min.css', plugins.rename({ suffix: ".min"})))
        .pipe(plugins.concat('combined.min.css'))
        .pipe(gulp.dest(config.paths.dist + '/vendors/css'))
        .pipe(plugins.connect.reload());
});


gulp.task('js', function() {
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(plugins.connect.reload());
});


// Watch changes
gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
});


// Start local dev server
gulp.task('connect', function() {
    plugins.connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    })
});


// Open uri in browser
gulp.task('open', ['connect'], function() {
    gulp.src('./dist/index.html')
        .pipe(plugins.open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
});

// Default task - gulp command in project dir
gulp.task('default', ['html', 'js', 'vendors', 'open', 'watch']);
