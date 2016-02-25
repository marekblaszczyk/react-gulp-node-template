"use strict";

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'gulp-minify-css'],
  replaceString: /\bgulp[\-.]/
  // gulp-open, gulp-connect ....
  // lint Js files, including JSX
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
        css: './src/css/*.css',
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

// vendors components
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
        .pipe(plugins.if('!*.min.css', plugins.minifyCss()))
        .pipe(plugins.if('!*.min.css', plugins.rename({ suffix: ".min"})))
        .pipe(plugins.concat('combined.min.css'))
        .pipe(gulp.dest(config.paths.dist + '/vendors/css'))
        .pipe(plugins.connect.reload());
});


// Js task
gulp.task('js', function() {
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(plugins.connect.reload());
});


// Css task
gulp.task('css', function() {
    gulp.src(config.paths.css)
        .pipe(plugins.concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'))
        .pipe(plugins.connect.reload());
});


// ESlint task
gulp.task('lint', function() {
    gulp.src([config.paths.js, '!*src/components/**/*.js'])
        .pipe(plugins.debug())
        .pipe(plugins.eslint({ config: 'eslint.config.json' }))
        .pipe(plugins.eslint.format());
});


// Watch changes
gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js', 'lint']);
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
gulp.task('default', ['html', 'css', 'js', 'lint', 'vendors', 'open', 'watch']);
