export default {
  /**
   * Асинхронная труба
   * Если результат функции неопределен, то результат не сохраняется
   *
   * @param {function[]} fns
   * @return {function} - composition
   */
  compose(fns) {
    return (res, ...args) => {
      return new Promise((resolve, reject) => {
        fns.reverse().reduce((prevFn, nextFn) => {
          const next = async (value) => {
            res = value !== undefined ? value : res;
            return await prevFn(res, ...args);
          };

          return async (value) => {
            try {
              res = value !== undefined ? value : res;
              return await nextFn(res, ...args, next);
            } catch (err) {
              reject(err);
            }
          }
        }, value => resolve(value))(res);
      });
    }
  }
}