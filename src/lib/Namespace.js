import AsyncStepsEngine from './AsyncStepsEngine';

export default class Namespace {
  constructor(stepIndex, steps, parentsNamespace, middleware, events) {
    this._steps = steps;
    this._parents = parentsNamespace;
    this._stepIndex = stepIndex;
    this._stepDepth = this._parents.length;
    this._name = this.step.name !== undefined ? this.step.name : 'default';
    this._middleware = middleware;
    this._events = events;
    this._break = false;
    this._sync = !!this.step.sync;
    this._throwError = (typeof this.step.throwError === 'function' ? this.step.throwError : (err, ns) => {
      this.events.error(err, ns);
    });
  }

  /**
   * Возвращает имя текущего шага
   *
   * @return {string}
   */
  get name() {
    return this._name;
  }

  /**
   * Возвращает синхронность
   *
   * @return {boolean}
   */
  get sync() {
    return this._sync;
  }

  /**
   * Возвращает позицию глубины вложенности текущего шага
   *
   * @return {number}
   */
  get stepDepth() {
    return this._stepDepth;
  }

  /**
   * Возвращает индекс текущей позиции шага
   *
   * @return {number}
   */
  get stepIndex() {
    return this._stepIndex;
  }

  /**
   * Возвращает текущий шаг
   *
   * @return {object}
   */
  get step() {
    return this._steps[this._stepIndex];
  }

  /**
   * Возвращает все модули из текущей итерации
   *
   * @return {object[]}
   */
  get steps() {
    return this._steps;
  }

  /**
   * Возвращает цепочку родителей
   *
   * @return {Array.<Namespace>} - массив экземпляров класса Namespace
   */
  get parents() {
    return this._parents;
  }

  /**
   * Данный флаг означает, что на текущем шаге нужно прекратить итерацию по массиву steps
   *
   * @param {boolean} $break
   */
  setBreak($break) {
    this._break = $break;
  }

  /**
   * Данный флаг означает, что на текущем шаге нужно прекратить итерацию по массиву steps, в том числе и у родителей
   *
   * @param {boolean} $break
   */
  setBreakAll($break) {
    this._parents.concat(this).forEach((namespace) => {
      namespace.setBreak($break);
    });
  }

  /**
   * @return {boolean}
   */
  getBreak() {
    return this._break;
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
   * Функция исключения
   *
   * @param {Error} err
   * @return {*}
   */
  throwError(err) {
    return this._throwError(err, this);
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
   * Возвращает схему вызовов
   *
   * @return {string}
   */
  getScheme() {
    return this._parents.concat(this).map((namespace) => {
      return `{index: ${namespace.stepIndex}, depth: ${namespace.stepDepth}, name: ${namespace.name}}`;
    }).join(' -> ');
  }

  /**
   * Возвращает новый экземпляр класса AsyncStepsEngine на одну вложенность глубже от начального шага
   *
   * @param {object[]} steps - массив, состоящий из последовательных элементов (модулей)
   * @return AsyncStepsEngine - возвращает новый экземпляр AsyncStepsEngine
   */
  child(steps) {
    const PARENTSNAMESPACE = this.parents.concat(this);
    const asyncStepsEngine = new AsyncStepsEngine(steps, this.middleware, this.events);
    asyncStepsEngine.setParentsNamespace(PARENTSNAMESPACE);

    return asyncStepsEngine;
  }
}