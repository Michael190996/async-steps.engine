import Middleware from './Middleware';
import Namespace from './Namespace';
import Events from './Events';

const debug = require('debug')('async-steps-engine:AsyncStepsEngine');

export default class AsyncStepsEngine {
  constructor(steps, middleware = new Middleware(), events = new Events()) {
    if (!Array.isArray(steps)) {
      throw new TypeError('steps is not Array');
    }

    this._steps = steps;
    this._events = events;
    this._middleware = middleware;
    this._parentsNamespace = [];
  }

  /**
   * Возвращает экземпляр класса Events
   *
   * @return Events
   */
  get events() {
    return this._events;
  }

  /**
   * Возвращает экземпляр класса Middleware
   *
   * @return Middleware
   */
  get middleware() {
    return this._middleware;
  }

  /**
   * @param {Array.<Namespace>} parentsNamespace
   */
  setParentsNamespace(parentsNamespace) {
    if (!Array.isArray(parentsNamespace)) {
      throw new TypeError('parents is not Array');
    }

    this._parentsNamespace = parentsNamespace;
  }

  /**
   * @param {number} indexStep
   * @return {Namespace}
   */
  createNamespace(indexStep) {
    return new Namespace(indexStep, this._steps, this._parentsNamespace, this.middleware, this.events);
  }

  /**
   * @param {*} data
   * @param namespace - экземпляр класса Namespace
   * @return {Promise}
   */
  async startStep(data, namespace) {
    debug(`start step "${namespace.getScheme()}"`);
    this.events.startStep(data, namespace);

    data = await this.middleware.compose()(data, namespace);

    debug(`end step "${namespace.getScheme()}"`);
    this.events.endStep(data, namespace);

    return data;
  }

  /**
   * Метод запускает последовательно steps
   *
   * @param {*} [data] - данные
   * @return {Promise}
   */
  async run(data) {
    const promises = [];
    let result = data;

    debug('initSteps');
    this.events.initSteps(result, this._parentsNamespace);

    for (let i = 0; i < this._steps.length; i++) {
      const namespace = this.createNamespace(i);
      let response;

      try {
        const startStep = this.startStep(result, namespace);

        if (!namespace.sync) {
          response = await startStep;
          result = response || result;
        }

        promises.push(startStep);
      } catch (err) {
        this.events.error(err, namespace);
        result = await namespace.throwError(err) || result;
      }

      if (namespace.getBreak()) {
        break;
      }
    }

    const RESULTS = await Promise.all(promises);
    this.events.endSteps(RESULTS, this._parentsNamespace);

    debug('endSteps');
    return result;
  }
}