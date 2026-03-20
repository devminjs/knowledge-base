export function debounce<F extends (...args: never[]) => unknown>(
  fn: F,
  wait: number,
): (this: ThisParameterType<F>, ...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function debounced(this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}
