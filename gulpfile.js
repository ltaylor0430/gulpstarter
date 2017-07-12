const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const changed = require('gulp-changed');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const del = require('del');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');

//install components with bower then add them here to be bundle
const VENDORS = [
  'components/lib/jquery/dist/jquery.js',
  'components/lib/bootstrap/dist/js/bootstrap.js'];
const STYLES = [
  'components/bootstrap/bootstrap.css'
]
gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['dist','.generated'], cb);
});
//sass, destination
gulp.task('sass',['clean'], function () {
 return gulp.src('./app/assets/sass/**/*.scss')
  .pipe(changed('./.generated/scss'))
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./.generated/scss'))

});

//concat all javascript files
gulp.task('vendor',['clean'], function() {
   gulp.src(VENDORS)
   .pipe(concat('vendor.js'))
   .pipe(uglify())
   .pipe(rename({suffix:'.min', extname:'.js'}))
   .pipe(gulp.dest('./dist/assets/js/'));
});
//concat all javascript files
gulp.task('js',['clean'], function() {
   gulp.src('app/assets/js/*.js')
   .pipe(concat('script.js'))
   .pipe(uglify())
   .pipe(rename({suffix:'.min', extname:'.js'}))
   .pipe(gulp.dest('./dist/assets/js/'));
});
//css task,
gulp.task('css', ['clean','sass'],function(){
   gulp.src(STYLES.concat([
     '.generated/scss/*.css',
     'app/assets/css/*.css']))
   .pipe(changed('./dist/assets/css'))
   .pipe(concat('main.bundle.css'))
   .pipe(autoprefixer())
   .pipe(cleanCSS())
   .pipe(rename({suffix:'.min', extname:'.css'}))
   .pipe(gulp.dest('./dist/assets/css'))
   .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('images', ['clean'], function() {
    gulp.src('app/assets/iamges/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/images'));
});
gulp.task('html', ['clean'],function(){
     gulp.src('app/**/*.html')
     .pipe(changed('./dist'))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build',['clean', 'vendor','js', 'sass','css','images','html'],function(){
    console.log('What can I say... You\'re Welcome!');
});
gulp.task('browserSync', function() {
    browserSync({
    server:  ['app','dist']
  });
})

// watch files for changes and reload
gulp.task('serve',['clean','css', 'vendor','js', 'browserSync', 'watch'], function() {
      //gutil.log('Server started on port', gutil.colors.magenta('8000'));
});

gulp.task('watch', function() {
    gulp.watch('./app/assets/sass/**/*.scss', ['css']);
    gulp.watch('app/assets/**/*.js', ['js']);
    gulp.watch(['*.html', 'app/assets/css/**/*.css', './app/assets/sass/**/*.scss', 'app/assets/**/*.js'], {cwd: 'app'}, reload);
});
