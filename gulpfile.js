"use strict";

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var tsc = require('gulp-typescript');
var tslint = require('gulp-tslint');
var tsProject = tsc.createProject('tsconfig.json');
var config = require('./gulp.config.js')();

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var historyFallback = require('connect-history-api-fallback');
var log = require('connect-logger');

gulp.task('ts-lint', function () {
    return gulp
        .src(['./app/main.ts'])
        .pipe(tslint())
        .pipe(tslint.report("verbose", {
            emitError: false,
            summarizeFailureOutput: true
        }));
});

gulp.task('compile-ts', function () {

    var tsResult = gulp
        .src(config.tsSource)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.tsOutputPath));
});

gulp.task('start', ['compile-ts'], function () {

    browserSync({
        injectChanges: false, // workaround for Angular 2 styleUrls loading
        files: ['./**/*.{html,htm,css,js}'],
        watchOptions: {
            ignored: "node_modules"
        },
        server: {
            baseDir: './',
            middleware: [
                log({ format: '%date %status %method %url' }),
                historyFallback({ "index": '/index.html' })
            ]
        }
    });

    gulp.watch(config.tsSource, ['compile-ts', browserSync.reload]);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['start']);