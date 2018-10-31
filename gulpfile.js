const {parallel, series, src, dest, watch, task} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();

const distDirectory = 'dist';
const htmlBlob = 'src/*.html';
const imagesBlob = 'src/images/**';
const fontsBlob = 'src/fonts/**';
const stylesBlob = 'src/css/**';

const reloadBrowser = function (done) {
  browserSync.reload();
  done();
};

const processHtml = function () {
  return src(htmlBlob)
    .pipe(dest(distDirectory));
};

const processImages = function () {
  return src(imagesBlob)
    .pipe(dest(`${distDirectory}/images/`));
};

const processFonts = function () {
  return src(fontsBlob)
    .pipe(dest(`${distDirectory}/fonts/`));
};

const processStyles = function () {
  return src(stylesBlob)
    .pipe(concat('styles.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(dest(`${distDirectory}/css`));
};

const serve = function () {
  browserSync.init({
    server: {
      baseDir: distDirectory
    }
  });

  watch(htmlBlob, series(processHtml, reloadBrowser));
  watch(imagesBlob, series(processImages, reloadBrowser));
  watch(fontsBlob, series(processFonts, reloadBrowser));
  watch(stylesBlob, series(processStyles, reloadBrowser));
};

const cleanDist = function () {
  return src(distDirectory, {read: false, allowEmpty: true}).pipe(clean());
};

const build = series(
  cleanDist,
  parallel(processStyles, processHtml, processImages, processFonts),
);

task('build', build);

task('default', series(
  build,
  serve
))
;
