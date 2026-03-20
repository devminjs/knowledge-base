interface Array<T> {
  myFilter(
    callbackFn: (value: T, index: number, array: Array<T>) => boolean,
    thisArg?: any,
  ): Array<T>;
}

Array.prototype.myFilter = function (callbackFn, thisArg) {
  let len = this.length;
  let results = [];

  for (let k = 0; k < len; k++) {
    const value = this[k];
    if (
      // sparse array's
      Object.hasOwn(this, k) &&
      callbackFn.call(thisArg, value, k, this)
    ) {
      results.push(value);
    }
  }

  return results;
};
