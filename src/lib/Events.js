import Events from 'events';

const debug = require('debug')('async-steps-engine');

export default class extends Events {
  /**
   * @param {*} [data] - данные
   * @param {Array.<Namespace>} parentsNamespace
   */
  initSteps(data, parentsNamespace) {
    debug('initSteps', parentsNamespace.map((ns) => {
      return `{index: ${ns.stepIndex}, depth: ${ns.stepDepth}, name: ${ns.name}}`
    }).join(' -> '));

    this.emit('initSteps', data, parentsNamespace);
  }

  /**
   * @param {*} error - ошибка
   * @param namespace - экземпляр класса Namespace
   */
  error(error, namespace) {
    debug(namespace.getScheme(), error);

    this.emit('error', error, namespace);
  }


  /**
   * @param {*} [data] - данные
   * @param namespace - экземпляр класса Namespace
   */
  startStep(data, namespace) {
    debug('start step', namespace.getScheme());

    this.emit('startStep', data, namespace);
  }

  /**
   * @param {*} [data] - данные
   * @param namespace - экземпляр класса Namespace
   */
  endStep(data, namespace) {
    debug('end step', namespace.getScheme());

    this.emit('endStep', data, namespace);
  }
  /**
   * @param {*} [data] - данные
   * @param {Array.<Namespace>} parentsNamespace
   */
  endSteps(data, parentsNamespace) {
    debug('endSteps', parentsNamespace.map((ns) => {
      return `{index: ${ns.stepIndex}, depth: ${ns.stepDepth}, name: ${ns.name}}`
    }).join(' -> '));

    this.emit('endSteps', data, parentsNamespace);
  }
}