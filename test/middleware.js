import assert from 'assert';
import {Middleware} from '../dist';

describe('Проверка класса Middleware', () => {
  it('use', (done) => {
    const middleware = new Middleware();

    const fn = (data, next) => {};

    middleware.use(fn);

    done(assert.deepStrictEqual(middleware.middlewares, [fn]));
  });

  it('go:count', (done) => {
    const middleware = new Middleware();
    const ARR = ['use1', 'use2', 'use3'];
    const newArr = [];

    middleware.use((arr, next) => {
      newArr.push(arr[0]);
      next();
    });

    middleware.use((arr, next) => {
      newArr.push(arr[1]);
      next();
    });

    middleware.use((arr, next) => {
      newArr.push(arr[2]);
      next();
    });

    middleware.compose()(ARR)
      .then(() => done(assert.deepStrictEqual(ARR, newArr)))
      .catch(err => done(err));
  });

  it('go:result', (done) => {
    const DATA = 'data';
    const RESULT = 'result';
    const middleware = new Middleware();

    middleware
      .use((data, next) => next(data))
      .use((data, next) => next())
      .use((data, next) => next(RESULT + data));

    middleware.compose()(DATA)
      .then(data => done(assert.ok(data === RESULT + DATA)))
      .catch(err => done(err));
  });

  it('go:data', (done) => {
    const DATA = 'data';
    const middleware = new Middleware();

    middleware.use((data, next) => next(data))

    middleware.compose()(DATA)
      .then(data => done(assert.ok(data === DATA)))
      .catch(err => done(err));
  });

  it('go:arguments', (done) => {
    const ARG = 'ARG';
    const middleware = new Middleware();

    middleware.use((data, arg, next) => next(arg));

    middleware.compose()('data', ARG)
      .then(data => done(assert.ok(data === ARG)))
      .catch(err => done(err));
  });

  it('go:catch', (done) => {
    const ERROR = new Error('test');
    const middleware = new Middleware();

    middleware
      .use((data, next) => next(ERROR))
      .use((err) => {
        throw err;
      });

    middleware.compose()()
      .then(() => done('catch not working'))
      .catch(err => done(assert.ok(err === ERROR)));
  });
});