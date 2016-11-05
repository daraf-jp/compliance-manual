var gulp = require("gulp");
var sass = require("gulp-sass");
var slim = require("gulp-slim");
var babel = require("gulp-babel");
var plumber = require("gulp-plumber");
var extender = require('gulp-html-extend');
var autoprefixer = require("gulp-autoprefixer");
var concat = require("gulp-concat");
var rename = require('gulp-rename');
var less = require('gulp-less');
var uglify = require("gulp-uglify");
var gulpFilter = require('gulp-filter');
var bower = require('main-bower-files');
var changed  = require('gulp-changed');
var imagemin = require("gulp-imagemin");
var watch = require("gulp-watch");
var browserSync = require('browser-sync');
var slimpath = "";

var exec = require('child_process').exec;
var fs = require('fs');
var tap = require("gulp-tap");
var path = require("path");
var array = []

gulp.task('sketch-task', function(cb){
  gulp.src('./*.sketch')
    .pipe(tap(function(file, t) {
        exec('sketchtool list artboards ' + path.basename(file.path), function(error, stdout, stderr) {
          var json = JSON.parse(stdout);
          json.pages[0].artboards.forEach(function(val,index,ar){
            array.push(val.name);
            fs.writeFile('./app/views/'+val.name+'.slim', val.name+'.slim', function(){});
          });
          console.log(array);
        });
     }))
})

gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: './public/'
    },
    port: 8000
  });
});

// slim
gulp.task('slim', function() {
  gulp.src("./app/views/**/*.slim")
    .pipe(plumber())
    .pipe(slim({
      pretty: true,
      require: 'slim/include',
      options: 'include_dirs=["./app/views/partial"]'
    }))
    .pipe(gulp.dest('./public/'))
});

// sass
gulp.task("sass", function() {
  gulp.src("./app/stylesheets/application.sass")
    .pipe(plumber())
    .pipe(sass({pretty: true}))
    .pipe(autoprefixer())
    .pipe(gulp.dest("./public/css/"));
});

// image
gulp.task("imagemin", function() {
  gulp.src("./app/images/**/*.+(jpg|jpeg|png|gif|svg|ico)")
    .pipe(changed( './public/img/' ))
    .pipe(imagemin())
    .pipe(gulp.dest("./public/img/"));
});

// javascript
gulp.task("jsmin", function() {
  gulp.src("./app/javascript/*.js")
    .pipe(changed( 'jsmin' ))
    .pipe(plumber())
    .pipe(uglify())
    .pipe( rename({
      extname: '.min.js'
    }) )
    .pipe(gulp.dest("./public/js/"))
});

// bower
gulp.task('bower', function() {
  var jsDir = './app/javascript/', // jsを出力するディレクトリ
      jsFilter = gulpFilter('**/*.js', {restore: true}); // jsファイルを抽出するフィルター
  return gulp.src( bower({
      paths: {
        bowerJson: 'bower.json'
      }
    }) )
    .pipe( jsFilter )
    .pipe( concat('_bundle.js') )
    // jsを1つにしたものを出力
    .pipe( gulp.dest(jsDir) )
    .pipe( uglify({
      // !から始まるコメントを残す
      preserveComments: 'some'
    }) )
    .pipe( rename({
      extname: '.min.js'
    }) )
    // jsを1つにしてmin化したものを出力
    .pipe( gulp.dest('./public/js/') )
    .pipe( jsFilter.restore );
});

// default
gulp.task('default', ['watch', 'bower', 'imagemin', 'slim', 'sass','browser-sync'] );

// watch
gulp.task('watch', function() {
  gulp.watch(['./app/views/*.slim', './app/views/partial/*.slim'],['slim']);
  gulp.watch(['./app/stylesheets/*.sass', './app/stylesheets/**/*.sass'], ['sass']);
  gulp.watch("./app/javascript/*.js", ['jsmin']);
});
