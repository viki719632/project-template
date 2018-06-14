const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const cleanCSS = require('gulp-clean-css');
const spritesmith = require('gulp.spritesmith');
const webpack = require('webpack');
const gulpWebpack = require('webpack-stream');
plugins.cleanCSS = cleanCSS;

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
    return gulp.src('src/js/index.js')//可以传递任意一个文件
        .pipe(plugins.plumber())
        .pipe(gulpWebpack({
            config : require('./webpack.config.js')
        }, webpack))//建议用自己安装的webpack
        .pipe(gulp.dest('dist/'));
})

gulp.task('less',function (){
	return gulp.src('src/css/style.less')
		.pipe(plugins.plumber())
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.less())
        .pipe(plugins.autoprefixer({
            browsers: ['since 2015','iOS 7','ie 8-11'],
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

var allTask = ['copy-component','copy-lib','less','sprite','copy-img','webpack'];

gulp.task('build',allTask);

allTask.push('server');

gulp.task('reload',allTask,function (){  
    gulp.watch('src/component/**/*.*',['copy-component']);
    gulp.watch('src/img/**/*.*',['sprite','copy-img']);
    gulp.watch('lib/**/*.*',['copy-lib']);
    gulp.watch('src/css/*.less',['less']);
    gulp.watch(['src/**/*.(html|js)','src/*.html'],['webpack']);


    gulp.watch('dist/**/*.js',['webpack']).on('change',reload);
    gulp.watch(['dist/img/**/*.(gif|jpg|jpeg)','dist/img/*.(gif|jpg|jpeg)']).on('change',reload);
    gulp.watch(['dist/**/*.html','dist/*.html']).on('change',reload);
    gulp.watch('dist/**/*.css').on('change',stream);
});

