import Events from 'events';

export default class extends Events {
  /**
   * @param {*} [data] - данные
   * @param {Array.<Namespace>} parentsNamespace
   */
  initSteps(data, parentsNamespace) {
    this.emit('initSteps', data, parentsNamespace);
  }

  /**
   * @param {*} error - ошибка
   * @param namespace - экземпляр класса Namespace
   */
  error(error, namespace) {
    this.emit('error', error, namespace);
  }


  /**
   * @param {*} [data] - данные
   * @param namespace - экземпляр класса Namespace
   */
  startStep(data, namespace) {
    this.emit('startStep', data, namespace);
  }

  /**
   * @param {*} [data] - данные
   * @param namespace - экземпляр класса Namespace
   */
  endStep(data, namespace) {
    this.emit('endStep', data, namespace);
  }
  /**
   * @param {*} [data] - данные
   * @param {Array.<Namespace>} parentsNamespace
   */
  endSteps(data, parentsNamespace) {
    this.emit('endSteps', data, parentsNamespace);
  }
}