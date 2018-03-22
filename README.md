[![NPM Version](https://img.shields.io/npm/v/async-steps.engine.svg?style=flat)](https://www.npmjs.com/package/async-steps.engine)
[![NPM Downloads](https://img.shields.io/npm/dm/async-steps.engine.svg?style=flat)](https://www.npmjs.com/package/async-steps.engine)
[![Node.js Version](https://img.shields.io/node/v/async-steps.engine.svg?style=flat)](http://nodejs.org/download/)
  [![stable](https://img.shields.io/badge/stablity-beta-green.svg?style=flat)](https://www.npmjs.com/package/async-steps.engine)
[![NPM](https://nodei.co/npm/async-steps.engine.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/async-steps.engine)

# Async-steps.engine (0.0.2) **BETA**
## Что это?
**Async-steps.engine** - реализация движка последовательных блоков иструкций.
* [Установка](#setup)
* [Пример](#example)
* [API](#api)
  - [Контроллеры](#classes-controllers)
    - [AsyncStepsEngine](#asyncstepsengine)
    - [Namespace](#namespace)
    - [Middleware](#middleware)
    - [Events](#events)
  - [Параметры](#params)
    - [steps](#steps)
    - [step](#step)
## Setup
- **Npm**:
```sh
npm install --save async-steps.engine
```
- **Source git**:
```sh
git clone https://github.com/Michael190996/async-steps.engine && \
cd async-steps.engine && \
npm i && \
npm run build # npm run prepublish
```

## Example
```javascript
import AsyncStepsEngine from 'async-steps.engine';

const steps = [{
  name: 'test'
}];

const ase = new AsyncStepsEngine(steps);

ase.middleware.use(async(data, ns, next) => {
  next(ns.step.name);
});

ase.run('data')
  .then(response => console.info(response))
  .catch(err => console.error(err));
````

## API
### Classes-controllers
#### AsyncStepsEngine
- import AsyncStepsEngine from 'async-steps.engine'
* AsyncStepsEngine(steps[, middleware][, events])
  - [steps](#steps)
  - [[events] - экземпляр класса Events](#events)
  - [[middleware] - экземпляр класса Middleware](#middleware)

  * .[events - ссылка на экземпляр класса Events](#events)

  * .[middleware - ссылка на экземпляр класса Middleware](#middleware)

  * .setParentsNamespace(parentsNamespace)
    - {Array.<[Namespace](#namespace)>} parentsNamespace

  * .createNamespace(indexStep)
    - {number} indexStep

  * startStep(data, namespace)
    - [data] - данные
    - [namespace - экземпляр класса Namespace](#namespace)

  * .run([data])
    - {*} [data] - данные

#### Namespace
- import {Namespace} from 'async-steps.engine'
* Namespace(stepIndex, steps, parentsNamespace, middleware, events)
  - stepIndex - индекс текущей позиции шага в steps
  - [steps](#steps)
  - {Array.<[Namespace](#namespace)>} parentsNamespace
  - [[events] - экземпляр класса Events](#events)
  - [[middleware] - экземпляр класса Middleware](#middleware)

  * .name - имя текущего модуля

  * .step - [step](#step) - текущий шаг

  * .steps - [steps](#steps)

  * .[middleware - ссылка на экземпляр класса Middleware](#middleware)

  * .[events - ссылка на экземпляр класса Events](#events)

  * .parents - возвращает цепочку родителей - {Array.<[Namespace](#namespace)>}

  * .stepIndex - индекс текущей позиции в [steps](#steps)

  * .stepDepth - позиция глубины вложенности в [steps](#steps)

  * .getScheme() - возвращает схему вызовов

  * .setBreak($break)
    - {boolean} $break - Данный флаг означает, что на текущем шаге нужно прекратить итерацию по массиву steps

  * .setBreakAll($break)
    - {boolean} $break - Данный флаг означает, что на текущем шаге нужно прекратить итерацию по массиву steps, в том числе и у родителей

  * .getBreak() - возвращает булевое значение

  * .child(steps) - метод возвращает новый экземпляр класса [AsyncStepsEngine](#asyncstepsengine) со заданной позицией
    - [steps](#steps)

#### Middleware
Класс, управляющий промежуточными результатами
- import {Middleware} from 'async-steps.engine'
* Middleware()
  * .middlewares - Возвращает все middlewares

  * .use(fn)
    - {function} fn

  * .compose() - compose
    * Примечание: Если результат промежуточной функции неопределен, то результат не сохраняется

#### Events
Класс событий, расширенный от нативного класса [Events](https://nodejs.org/api/events.html#events_events)
- import {Events} from 'async-steps.engine'
* Events()
  * .initSteps([data, ]parentsNamespace)
    - {*} [data]
    - {Array.<[Namespace](#namespace)>} parentsNamespace
  * .on('initSteps', function(data, namespace))

  * .startStep([data, ]namespace)
    - {*} [data]
    - [namespace - экземпляр класса Namespace](#namespace)
  * .on('startStep', function(data, namespace))

  * .endSteps([data, ]parentsNamespace)
    - {*} [data]
    - {Array.<[Namespace](#namespace)>} parentsNamespace
  * .on('end', function(data, namespace))

  * .endStep([data, ]namespace)
    - {*} [data]
    - namespace - [экземпляр класса Namespace](#namespace)
  * .on('endStep', function(data, namespace))

  * .error(error, namespace)
    - {Error} error - ошибка
    - namespace - [экземпляр класса Namespace](#namespace)
  * .on('error', function(error, namespace))

### Params
##### steps
- {object[[step](#step)]} steps

##### step
- {object} step
  - {string} [name] - имя шага
  - {boolean} [sync] - синхронность шага
  - {function} [throwError] - функция, обрабатывающая исключения
    - function throwError(error, namespace)
      - {Error} error
      - [namespace - экземпляр класса Namespace](#namespace)
    - результат функции при истинном значении записывается в data
  * Примечание: Если результат шага неопределен, то результат не сохраняется