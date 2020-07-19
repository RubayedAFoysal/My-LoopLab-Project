var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

// Move the javascript files into our /src/js folder
gulp.task('js', function() {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
        .pipe(gulp.dest("src/js"))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', gulp.series('sass', function() {

    browserSync.init({
        server: "./src"  
    });

    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], gulp.series('sass'));
    gulp.watch("src/*.html").on('change', browserSync.reload);
}));

// Move Font Awesome Fonts folder to src
gulp.task('webfonts', function () {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest("src/webfonts"));
});

// Move font awesome css file
gulp.task('fa', function () {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/css/all.css')
        .pipe(gulp.dest("src/css"));
});

gulp.task('js', () => {
  gulp.src('./src/js/index.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('default', gulp.parallel('js','serve','fa','webfonts'));