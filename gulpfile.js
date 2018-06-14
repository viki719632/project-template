const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
var cleanCSS = require('gulp-clean-css');
var spritesmith = require('gulp.spritesmith');
const webpack = require('webpack-stream');
// var uglify = require('gulp-uglify');
plugins.cleanCSS = cleanCSS;
// plugins.uglify = uglify;

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const stream = browserSync.stream;

gulp.task('sprite', function () {
    var spriteData = gulp.src('src/img/icon/*.png').pipe(spritesmith({
        imgName: 'img/sprite.png',
        cssName: 'css/sprite.css',
        padding: 3
    }));
    return spriteData.pipe(gulp.dest('src'));
});

// gulp.task('webpack',function (){
//     return gulp.src('src/entry.js')
//         .pipe(webpack(require('./webpack.config.js')))
//         .pipe(gulp.dest('dist/'));;
// })

gulp.task('copy-component',function (){
    return gulp.src('src/component/**/*.*')
        .pipe(plugins.plumber())
        .pipe(plugins.copy('dist/component',{prefix: 2}))
        .pipe(gulp.dest('dist/component'));
});

gulp.task('copy-img',function (){
    return gulp.src('src/img/**/*.*')
        .pipe(plugins.plumber())
        .pipe(plugins.copy('dist/img',{prefix: 2}))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('copy-lib',function (){
    return gulp.src(['lib/**/*.*'])
        .pipe(plugins.plumber())
        .pipe(plugins.copy('dist'))
        .pipe(gulp.dest('dist'));
});

gulp.task('webpack',function (){
    return gulp.src('src/js/index.js')
        .pipe(plugins.plumber())
        .pipe(webpack({
          config : require('./webpack.config.js')
        }))
        .pipe(gulp.dest('dist/'));
})

// gulp.task('concat-js',function (){
// 	return gulp.src([
// 			'./lib/**/*.js',
// 			'!./lib/createjs/preload.min.js'
// 		])
// 		.pipe(plugins.plumber())
// 		.pipe(plugins.concat('vendor.js'))
// 		// .pipe(plugins.uglify())
// 		.pipe(gulp.dest('./dist/lib/vendor/'));
// });

gulp.task('less',function (){
	return gulp.src('src/css/style.less')
		.pipe(plugins.plumber())
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.less())
        .pipe(plugins.autoprefixer({
            browsers: ['since 2015','iOS 7'],
        }))
		.pipe(plugins.sourcemaps.write('.'))
        // .pipe(plugins.cleanCSS())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(stream());
});

// 静态服务器
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('build',['copy-component','copy-img','copy-lib','less']);

gulp.task('watch',['copy-component','copy-lib','sprite','copy-img','less'],function (){  
    gulp.watch('src/component/**/*.*',['copy-component']);
    gulp.watch('src/img/**/*.*',['copy-img','sprite']);
    gulp.watch('lib/**/*.*',['copy-lib']);
    gulp.watch('src/css/*.less',['less']);

    gulp.watch('src/**/*.*');
});

gulp.task('reload',['copy-component','copy-lib','less','sprite','copy-img','server'],function (){  
    gulp.watch('src/component/**/*.*',['copy-component']);
    gulp.watch('src/img/**/*.*',['sprite','copy-img']);
    gulp.watch('lib/**/*.*',['copy-lib']);
    gulp.watch('src/css/*.less',['less']);

    gulp.watch(['dist/**/*.(js|gif|jpg|jpeg)','dist/*.html']).on('change',reload);
    // gulp.watch('dist/**/*.css').on('change',stream);
});
