import gulp from 'gulp';
import gulpClean from 'gulp-clean';
import gulpBabel from 'gulp-babel';
import gulpEslint from 'gulp-eslint';
import gulpSequence from 'gulp-sequence';
import gulpNotify from 'gulp-notify';
import gulpSourcemaps from 'gulp-sourcemaps';
import gulpUtil from 'gulp-util';
import childProcess from 'child_process';

const HOMEDIR = 'dist';
const CHECKSCRIPT = gulpUtil.env.CS;
let app = null;

const server = () => {
  if (CHECKSCRIPT) {
    app = childProcess.fork(CHECKSCRIPT);

    app.on('close', () => {
      server();
    });
  }
};

const wrapPipe = (title, taskFn) => {
  return (done) => {
    let _err = false;

    const onSuccess = () => {
      if (!_err) {
        gulp.src(HOMEDIR).pipe(gulpNotify({
          title: 'Success: ' + title
        }));

        return done();
      }
    };

    const onError = (err) => {
      _err = true;

      gulp.src(HOMEDIR).pipe(gulpNotify({
        title: 'Error: ' + title,
        message: err
      }));

      return done(err);
    };

    const outStream = taskFn(onSuccess, onError);

    if (outStream && typeof outStream.on === 'function') {
      outStream.on('end', onSuccess);
    }
  }
};

gulp.task('clean', () => {
  return gulp.src(HOMEDIR, {
    read: false
  }).pipe(gulpClean());
});

gulp.task('lint', () => {
  let _err = false;

  return gulp.src('src/**/*.js')
    .pipe(gulpEslint())
    .pipe(gulpEslint.result((result) => {
      if (result.errorCount) {
        _err = true;

        gulp.src(HOMEDIR).pipe(gulpNotify({
          title: 'Error: Js lint',
          message: `filePath: ${result.filePath}\r${result.messages[0].message}\rline: ${result.messages[0].line}, column: ${result.messages[0].column}`
        }));
      }
    }).on('end', () => {
      if (!_err) {
        gulp.src(HOMEDIR).pipe(gulpNotify({
          title: 'Success: Js lint'
        }));
      }
    }))
    .pipe(gulpEslint.format())
    .pipe(gulpEslint.failAfterError());
});

gulp.task('babel:dev', wrapPipe('Babel:dev', (success, error) => {
  return gulp.src('src/**/*.js')
    .pipe(gulpSourcemaps.init())
    .pipe(gulpBabel().on('error', error))
    .pipe(gulpSourcemaps.write('.'))
    .pipe(gulp.dest(HOMEDIR)).on('end', () => {
      if (app) {
        app.kill();
      }
    });
}));

gulp.task('babel:prod', wrapPipe('Babel:prod', (success, error) => {
  return gulp.src('src/**/*.js')
    .pipe(gulpBabel().on('error', error))
    .pipe(gulp.dest(HOMEDIR));
}));

gulp.task('watch', () => {
  server();

  gulp.watch('src/**/*.js', ['lint', 'babel:dev']);
});

gulp.task('build:dev', gulpSequence('lint', 'babel:dev'));
gulp.task('build:prod', gulpSequence('lint', 'clean', 'babel:prod'));
gulp.task('default', gulpSequence('lint', 'clean', 'build:dev', 'watch'));