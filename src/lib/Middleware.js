import utils from '../utils';

export default class Middleware {
  constructor() {
    this._middlewares = [];
  }

  /**
   * Возвращает все middlewares
   *
   * @return {object}
   */
  get middlewares() {
    return this._middlewares;
  }

  /**
   * @param {function} fn
   * @return Middleware
   */
  use(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('"fn" is not a function');
    }

    this._middlewares.push(fn);

    return this;
  }

  /**
   * Запускает middleware
   *
   * @return {Promise}
   */
  compose() {
    return utils.compose(this._middlewares);
  }
}