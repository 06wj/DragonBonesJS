var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var vinylPaths = require('vinyl-paths');
var sequence = require('gulp-sequence');
var tsclark = require('./lib/typescript/tsclark');


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
                    out: 'build/dragonbones.alone.js'
                },
                errors: []
            });

            if (compileResult.messages) {
                compileResult.messages.forEach(function (m) { return console.log(m); });
            }
        });
});

gulp.task('build:dragonbones', function(){
    return gulp.src(['src/egret-shim.js', 'build/dragonbones.alone.js', 'src/textureAtlas.js'])
        .pipe(concat('dragonbones.js'))
        .pipe(gulp.dest('build'))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('build'))
        .on('end', function(){
            del('')
        });
});

gulp.task('build', sequence('clean', 'build:typescript', 'build:dragonbones'));

gulp.task('default', ['build']);


