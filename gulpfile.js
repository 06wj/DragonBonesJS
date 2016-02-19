var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var vinylPaths = require('vinyl-paths');
var runSequence = require('run-sequence');
var gulpif = require('gulp-if');
var tsclark = require('./lib/typescript/tsclark');

var isWatch = false;

gulp.task('clean', function(cb) {
    del(['build', 'src/core/**/*.js'], cb);
});

gulp.task('build:typescript', function(){
    var vp = vinylPaths();
    return gulp.src('src/**/*.ts')
        .pipe(vp).on('end', function(){
            var compileResult = tsclark.Compiler.executeWithOption({
                fileNames: vp.paths,
                options: {
                    target: 1,
                    removeComments: true,
                    out: 'build/dragonbones.temp.js'
                },
                errors: []
            });

            if (compileResult.messages) {
                compileResult.messages.forEach(function (m) { return console.log(m); });
            }
        });
});

gulp.task('build:dragonbones', function(){
    return gulp.src([
            'src/egret-shim.js',
            'build/dragonbones.temp.js',
            'src/textureAtlas.js'
        ])
        .pipe(concat('dragonbones-alone.js'))
        .pipe(gulp.dest('build'))
        .pipe(gulpif(!isWatch, uglify()))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('build'))
        .on('end', function(){
            del('build/dragonbones.temp.js');
        });
});

var factoryNames = ['dom', 'pixi'];
factoryNames.forEach(function(factoryName){
    gulp.task('build:factory-' + factoryName, function(){
        return gulp.src(['build/dragonbones-alone.js', 'src/factory/' + factoryName + 'Factory.js'])
            .pipe(concat('dragonbones-' + factoryName + '.js'))
            .pipe(gulp.dest('build/'))
            .pipe(gulpif(!isWatch, uglify()))
            .pipe(rename({extname: '.min.js'}))
            .pipe(gulp.dest('build/'));
    });
});

gulp.task('build:factory', factoryNames.map(function(factoryName){
    return 'build:factory-' + factoryName;
}));

gulp.task('build', function(cb){
    runSequence('clean', 'build:typescript', 'build:dragonbones', 'build:factory', cb);
});

gulp.task('default', ['build']);

gulp.task('setIsWatch', function(cb){
    isWatch = true;
    cb();
});
gulp.task('watch', ['setIsWatch', 'build'], function(){
    isWatch = true;
    gulp.watch(['src/factory/**/*.js'], ['build:factory']);

    gulp.watch([
        'src/**/*.ts',
        'src/textureAtlas.js',
        'src/egret-shim.js'
    ], ['build']);
});


