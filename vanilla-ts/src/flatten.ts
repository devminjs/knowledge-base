type ArrayValue = any | Array<ArrayValue>;

export function flatten(values: ArrayValue[]): unknown[] {
  let results = values.slice();

  while (results.some(Array.isArray)) {
    results = [].concat(...results);
  }

  return results;
}

export function* flatten2(values: ArrayValue[]): Generator<unknown> {
  for (const item of values) {
    if (Array.isArray(item)) {
      yield flatten2(item);
    } else {
      yield item;
    }
  }
}
