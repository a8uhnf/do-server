const gulp = require('gulp');
const _ = require('lodash');
const del = require('del');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const exec = require('child_process').exec;
const eslint = require('gulp-eslint');
const sassLint = require('gulp-sass-lint');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const htmlreplace = require('gulp-html-replace');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const watchify = require('watchify');
const streamify = require('gulp-streamify');
const browserify = require('browserify');
const aliasify = require('aliasify');
const sourcemaps = require('gulp-sourcemaps');
const nunjucks = require('gulp-nunjucks');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const merge = require('merge-stream');
const glob = require('glob');
const globalShim = require('browserify-global-shim').configure({
    'jquery': '$'
});

/* FILE PATHS */
const paths = {
    html: {
        files: ['index.html'],
        indexFiles: 'index.html',
        srcDir: '.',
        destDir: 'dist'
    },
    js: {
        apps: 'js/app.js',
        files: ['js/**/*.js'],
        srcDir: 'js',
        destDir: 'dist/assets/js'
    },
    external_js: {
        files: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/jquery-validation/dist/jquery.validate.js',
            'node_modules/ion-rangeslider/js/ion.rangeSlider.min.js',
            'node_modules/nunjucks/browser/nunjucks-slim.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/toastr/toastr.js',
            'node_modules/clipboard/dist/clipboard.min.js',
            'node_modules/codemirror/lib/codemirror.js',
            'node_modules/codemirror/mode/shell/shell.js',
            'node_modules/codemirror/mode/javascript/javascript.js'
        ],
        ie: [
            'node_modules/html5shiv/dist/html5shiv.min.js',
            'node_modules/respond.js/dest/respond.min.js'
        ],
        destDir: 'dist/assets/external_js'
    },
    templates: {
        files: ['templates/**/*.html'],
        srcDir: 'templates',
        destDir: 'dist/assets/templates'
    },
    scss: {
        files: ['scss/**/*.scss'],
        srcDir: 'scss',
        destDir: 'dist/assets/css'
    },
    css_external: {
        files: [
            'node_modules/bootstrap/dist/css/bootstrap.css',
            // 'node_modules/bootstrap/dist/css/bootstrap-theme.css',
        ],
    },
    images: {
        files: ['images/**/*'],
        srcDir: 'images',
        destDir: 'dist/assets/images'
    },
    fonts: {
        files: [],
        srcDir: 'fonts',
        destDir: 'dist/assets/fonts'
    },
};


/* TASKS */
/* Lints the CSS files */
gulp.task('lint:css', function () {
    gulp.src(paths.scss.files)
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});

/* Compiles SCSS files into CSS files and copies them to the distribution directory */
gulp.task('scss', function () {
    const scssStream = gulp.src(paths.scss.files)
        .pipe(sass({
            'outputStyle': 'compressed',
            'errLogToConsole': true
        }))
        .pipe(concat('scss-files.scss'));

    const cssextStream = gulp.src(paths.css_external.files)
        .pipe(concat('css-ext-files.css'));

    return merge(scssStream, cssextStream)
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(paths.scss.destDir));
});

/* Development css task */
gulp.task('css:dev', function () {
    runSequence('lint:css', 'scss');
});

/* Production css task */
gulp.task('css:prod', function (done) {
    runSequence('lint:css', 'scss', function (error) {
        done(error && error.err);
    });
});

/* Copies files to the distribution directory */
['images', 'fonts'].forEach(function (fileType) {
    console.log('hello world');
    gulp.task(fileType, function () {
        return gulp.src(paths[fileType].files)
            .pipe(gulp.dest(paths[fileType].destDir));
    });
});

/* Deletes the distribution directory */
gulp.task('clean', function () {
    return del('dist');
});

/* Copies the HTML file to the distribution directory (dev) */
gulp.task('html:dev', function () {
    const ext = [];
    _.forEach(paths.external_js.files, function(file)  {
        ext.push('./assets/external_js/' + file.substring(file.lastIndexOf('/') + 1));
    });

    const ie = [];
    _.forEach(paths.external_js.ie, function(file) {
        ie.push('./assets/external_js/' + file.substring(file.lastIndexOf('/') + 1));
    });
    glob(paths.html.indexFiles, null, function(err, files) {
        _.each(files, function(file) {
            const filePath = file.substring(file.indexOf('/') + 1, file.lastIndexOf('/'));
            return gulp.src(file)
                .pipe(htmlreplace({
                    'app_js': './assets/js/app.js',
                    'external_js': ext,
                    'js_ie': ie,
                    'login_check': '', // don't look for phtkn
                    'css': './assets/css/style.min.css',
                }))
                .pipe(gulp.dest(paths.html.destDir + '/' + filePath));
        });
    });
});

/* Copies the HTML file to the distribution directory (prod) */
gulp.task('html:prod', function () {
    glob(paths.html.indexFiles, null, function (err, files) {
        _.each(files, function (file) {
            const filePath = file.substring(file.indexOf('/') + 1, file.lastIndexOf('/'));
            return gulp.src(file)
                .pipe(htmlreplace({
                    'pharm_js': '../assets/js/pharm.app.js',
                    'ci_js': '../assets/js/ci.app.js',
                    'artifactory_js': '../assets/js/artifactory.app.js',
                    'js_ext': ext,
                    'js_ie': ie,
                    'css': '../assets/css/style.min.css',
                }))
                .pipe(gulp.dest(paths.html.destDir + '/' + filePath));
        });
    });
});

gulp.task('templates', function () {
    return gulp.src(paths.templates.files)
        .pipe(nunjucks())
        .pipe(concat('templates.min.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(paths.templates.destDir));
});

/* Lints the JS files */
gulp.task('lint:js', function () {
    return gulp.src(paths.js.files)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/* Helper which bundles the JS files and copies the bundle into the distribution file (dev) */
function bundle(b, name) {
    return b
        .bundle()
        .pipe(source(name))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .on('error', function (error) {
            gutil.log(gutil.colors.red('Error bundling distribution files:'), error.message);
        })
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.js.destDir));
}

/* Browserifies the JS files and copies the bundle into the distribution file (dev) */
gulp.task('js:dev', function () {
    glob(paths.js.apps, null, function (err, files) {
        _.each(files, function (file) {
            const name = file.substring(file.lastIndexOf('/') + 1);
            const b = browserify({
                plugin: [watchify],
                cache: {},
                debug: true,
                fullPaths: true,
                packageCache: {}
            })
                .transform(aliasify, {
                    aliases: {
                        'underscore': 'lodash'
                    },
                    verbose: true,
                    global: true
                })
                .transform(babelify, {
                    presets: ['es2015']
                })
                .transform(globalShim)
                .add(file);

            // Re-bundle the distribution file every time a source JS file changes
            b.on('update', function () {
                gutil.log('Re-bundling distribution files');
                bundle(b, name);
            });

            // Log a message and reload the browser once the bundling is complete
            b.on('log', function (message) {
                gutil.log('Distribution files re-bundled:', message);
                runSequence('lint:js', 'reload');
            });
            return bundle(b, name);
        });
    });
});

/* Browserifies the JS files and copies the bundle into the distribution file (prod) */
gulp.task('js:prod', function (done) {
    runSequence('lint:js', 'browserify:js', function (error) {
        done(error && error.err);
    });
});


/* Replaces image and link absolute paths with the correct production path */
gulp.task('copy:js', function () {
    return gulp.src(paths.js.files)
        .pipe(gulp.dest(paths.js.destDir));
});

/* Replaces image and link absolute paths with the correct production path */
gulp.task('copy:js_ext', function () {
    return gulp.src([].concat(paths.external_js.files, paths.external_js.files))
    // .pipe(gulpRev())
        .pipe(gulp.dest(paths.external_js.destDir));
});

gulp.task('copy:schema', function (cb) {
    exec("bash -c 'dir=$PWD;pushd $GOPATH/src/github.com/api;echo $dir;mkdir -p $dir/js/schema;find . -name '*.schema.json' | cpio -pdm $dir/js/schema;'", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('copy:data', function (cb) {
    exec("bash -c 'dir=$PWD;rm -rf $dir/js/data;pushd $GOPATH/src/github.com/data/files;echo $dir;mkdir -p $dir/js/data;cp *.json $dir/js/data;'", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

/* Copies files to the distribution directory */
['images', 'fonts'].forEach(function (fileType) {
    gulp.task(fileType, function () {
        return gulp.src(paths[fileType].files)
            .pipe(gulp.dest(paths[fileType].destDir));
    });
});

/* Removes all script files in the distribution directory except the Browserify bundle */
gulp.task('removeTempScriptFiles', function () {
    return del('dist/js/!(*.min.js)');
});

/* Browserifies the JS files into a single bundle file */
gulp.task('browserify:js', function () {
    glob(paths.js.apps, null, function (err, files) {
        _.each(files, function (file) {
            const name = file.substring(file.lastIndexOf('/') + 1);
            return browserify()
                .transform(aliasify, {
                    aliases: {
                        'underscore': 'lodash'
                    },
                    verbose: true,
                    global: true
                })
                .transform(babelify, {
                    presets: ['es2015']
                })
                .transform(globalShim)
                .add(file)
                .bundle()
                .on('error', function (error) {
                    gutil.log(gutil.colors.red('Error bundling distribution files:'), error.message);
                    process.exit(1);
                })
                .pipe(source(name))
                .pipe(buffer())
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(streamify(uglify()))
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(paths.js.destDir));
        });
    });
});

/* Watches for file changes (JS file changes are watched elsewhere via watchify) */
gulp.task('watch', function () {
    const fileTypesToWatch = {
        scss: 'css:dev',
        html: 'html:dev',
        images: 'images',
        templates: 'templates'
    };

    _.forEach(fileTypesToWatch, function (taskToRun, fileType) {
        gulp.watch(paths[fileType].files, function () {
            runSequence(taskToRun, 'reload');
        });
    });
});

/* Reloads the browser */
gulp.task('reload', function () {
    browserSync.reload();
});


/* Static server which rewrites all non static file requests back to index.html */
gulp.task('serve', function () {
    browserSync.init({
        port: 5990,
        open: false,
        server: {
            baseDir: 'dist/'
        }
    });
});

gulp.task('build:dev', ['html:dev', 'templates', 'js:dev', 'css:dev', 'images', 'fonts']);
gulp.task('build:prod', ['html:prod', 'templates', 'js:prod', 'css:prod', 'images', 'fonts']);

gulp.task('prod', function (done) {
    runSequence('clean', 'copy:js_ext', 'build:prod', function (error) {
        done(error && error.err);
    });
});


gulp.task('default', function (done) {
    runSequence('clean', 'copy:js_ext', 'build:dev', 'watch', 'serve', function (error) {
        done(error && error.err);
    });
});