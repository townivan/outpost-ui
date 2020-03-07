const gulp = require('gulp')
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create()


const myGlobs = {
    scssSource: './src/*.scss',  // includes .scss files in any subfolders of ./scss also
    cssDest:  './docs/',
    htmlSource: './docs/*.html'
};

function compileSass(){
    return gulp.src(myGlobs.scssSource) // make a stream of files to compile
    .pipe(sass()) // use the gulp-sass plugin on each file in the stream
    .pipe(gulp.dest(myGlobs.cssDest)) // save the compiled files
    .pipe(browserSync.stream()) // push updates to open browsers with browser-sync
}
exports.compileSass = compileSass // enables 'gulp compileSass' from the terminal

function reload(cb){ 
    browserSync.reload() // A simple task to reload the page
    cb() // use the error-first callback to signal task completion
}

function startServer(){
    browserSync.init({
        server: {
            baseDir: "./docs/"
        }
        // If you are already serving your website locally using something like apache
        // You can use the proxy setting to proxy that instead
        // proxy: "yourlocal.dev"
    })
    gulp.watch(myGlobs.scssSource, compileSass) // if something here updates, run the compileSass task
    gulp.watch(myGlobs.htmlSource, reload) // if something in the html glob updates, run the reload task
}
exports.startServer = startServer // enables 'gulp startServer' from the terminal


exports.default = gulp.series( startServer, compileSass ) // start the browser-sync server with a simple 'gulp' command in terminal