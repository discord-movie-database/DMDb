'use strict';

const gulp = require('gulp');
const gulpScss = require('gulp-sass');
const gulpMinifyCSS = require('gulp-csso');
const gulpRename = require('gulp-rename');

const SCSS_SRC = './public/scss/**/*.scss';
const SCSS_DEST = './public/css/';

gulp.task('compile_scss', () => {
    gulp.src(SCSS_SRC)
    .pipe(gulpScss().on('error', gulpScss.logError))
    .pipe(gulpMinifyCSS())
    .pipe(gulpRename({
        "suffix": ".min", "basename": "main"
    }))
    .pipe(gulp.dest(SCSS_DEST));
});

gulp.task('watch_scss', () => {
    gulp.watch(SCSS_SRC, ['compile_scss']);
});

gulp.task('default', ['watch_scss']);