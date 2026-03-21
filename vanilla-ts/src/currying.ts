type Curried<Args extends unknown[], Return> = Args extends []
  ? Return
  : Args extends [infer First, ...infer Rest]
    ? Rest extends []
      ? (a: First) => Return
      : ((...args: Args) => Return) &
          ((a: First) => Curried<Rest, Return>) &
          SplitCalls<[First], Rest, Return>
    : never;

type SplitCalls<Done extends unknown[], Remaining extends unknown[], Return> = Remaining extends []
  ? unknown
  : Remaining extends [infer First, ...infer Rest]
    ? ((...args: [...Done, First]) => Curried<Rest, Return>) &
        SplitCalls<[...Done, First], Rest, Return>
    : unknown;

type TFunc = (...args: never[]) => unknown;

type CurriedReturnFn<F extends TFunc> = Curried<Parameters<F>, ReturnType<F>>;

export function curry<F extends TFunc>(fn: F): CurriedReturnFn<F> {
  function curried(this: unknown, ...args: unknown[]): unknown {
    if (args.length >= fn.length) {
      return (fn as unknown as (...args: unknown[]) => unknown).apply(this, args);
    }
    // Arrow function — captures `this` from the curried call above
    return (...next: unknown[]) => curried.apply(this, [...args, ...next]);
  }
  return curried as CurriedReturnFn<F>;
}
