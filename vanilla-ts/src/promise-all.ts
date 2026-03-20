type Tuple = readonly unknown[] | [];

type AwaitedTuple<T> = {
  -readonly [K in keyof T]: Awaited<T[K]>;
};

export function promiseAll<T extends Tuple>(iterable: T): Promise<AwaitedTuple<T>> {
  return new Promise((resolve, reject) => {
    let resolved = iterable.length;
    let results = new Array(resolved) as AwaitedTuple<T>;

    if (resolved === 0) {
      return resolve(results);
    }

    iterable.forEach(async (value, index) => {
      try {
        results[index] = await value;
        resolved--;

        if (resolved === 0) {
          return resolve(results);
        }
      } catch (error) {
        return reject(error);
      }
    });
  });
}
