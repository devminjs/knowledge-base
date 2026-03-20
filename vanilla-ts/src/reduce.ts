interface Array<T> {
  myReduce: <A>(
    fn: (acc: A, current: T, index: number, array: Array<T>) => A,
    initialValue?: A,
  ) => A;
}

Array.prototype.myReduce = function (cb, initialValue) {
  let len = this.length;
  let hasInitialValue = initialValue !== undefined;

  if (len === 0 && !hasInitialValue) {
    throw new TypeError("Reduce of empty array with no initial value");
  }

  let acc = hasInitialValue ? initialValue : this[0];
  let startIndex = hasInitialValue ? 0 : 1;

  for (let i = startIndex; i < len; i++) {
    // sparse arrays
    if (Object.hasOwn(this, i)) {
      acc = cb(acc, this[i], i, this);
    }
  }

  return acc;
};
