// Moudule
import gulp from "gulp";
import del from "del";
import glupAutoprefixer from "gulp-autoprefixer";
import gulpCsso from "gulp-csso";
import gulpPug from "gulp-pug";
import gulpSass from "gulp-sass";
import nodeSass from "sass";
import gulpWebserver from "gulp-webserver";
import gulpImage from "gulp-image";
import ghPages from "gulp-gh-pages";

// Compiler
const sass = gulpSass(nodeSass);

// Path
const routes = {
  img: {
    watch: "src/img/**/*",
    src: "src/img/*",
    dest: "build/img/",
  },
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build/",
  },
  scss: {
    watch: "src/style/**/*.scss",
    src: "src/style/*.scss",
    dest: "build/style/",
  },
};

// Task
const ghPage = () => gulp.src("build/**/*").pipe(ghPages());

const image = () =>
  gulp.src(routes.img.src).pipe(gulpImage()).pipe(gulp.dest(routes.img.dest));

const webserver = () =>
  gulp.src("build").pipe(gulpWebserver({ livereload: true, open: true }));

const clear = () => del(["build/", ".publish"]);

const watcher = () => {
  gulp.watch(routes.img.watch);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.pug.watch, pug);
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gulpPug()).pipe(gulp.dest(routes.pug.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(glupAutoprefixer())
    .pipe(gulpCsso())
    .pipe(gulp.dest(routes.scss.dest));

// build
const prepare = gulp.series([clear]);
const assets = gulp.series([styles, pug, image]);
const postDev = gulp.parallel([webserver, watcher]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, postDev]);
export const deploy = gulp.series([build, ghPage, clear]);
