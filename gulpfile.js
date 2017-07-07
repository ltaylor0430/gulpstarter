const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['dest'], cb);
});
//sass, destination 
gulp.task('sass', function () {
 return gulp.src('./app/assets/sass/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./.generated/scss'))
 
});
//concat all javascript files
gulp.task('js', function() {
   gulp.src('app/assets/js/*.js')
   .pipe(concat('script.js'))
   .pipe(uglify())
   .pipe(gulp.dest('./dist/assets/js/'));
});

gulp.task('css', ['sass'],function(){
   gulp.src(['.generated/scss/*.css','app/assets/css/*.css'])
   .pipe(autoprefixer())
   .pipe(cleanCSS())
   .pipe(gulp.dest('./dist/assets/css'))
   .pipe(browserSync.stream({match: '**/*.css'}));
});
 

gulp.task('html', function(){
     gulp.src('app/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build',['js', 'sass','css','html'],function(){
    console.log('What can I say... You\'re Welcome!');
});
gulp.task('browserSync', function() {
    browserSync({
    server:  ['app','dist']
  });
})
// watch files for changes and reload
gulp.task('serve',['css','js','browserSync', 'watch'], function() {});

gulp.task('watch', function() {
    gulp.watch('./app/assets/sass/**/*.scss', ['css']);
    gulp.watch('app/assets/**/*.js', ['js']);
    gulp.watch(['*.html', 'app/assets/css/**/*.css', './app/assets/sass/**/*.scss', 'app/assets/**/*.js'], {cwd: 'app'}, reload);
});