# Typing a Curry Function in TypeScript

This guide builds up the full type for a `curry` function from first principles. Each step is small and concrete — by the end you will understand every line of the final implementation.

---

## What is currying?

Currying is the technique of transforming a function that takes multiple arguments into a chain of functions that each take one (or more) arguments at a time. Instead of calling `add(3, 4, 10)` all at once, a curried version lets you call `add(3)(4)(10)` — feeding in arguments one by one. This is useful when you want to partially apply a function: lock in some arguments now and supply the rest later.

---

## Step 1: Typing a simple 2-arg curry

Before reaching for generics or conditional types, write the type by hand. Suppose you have a function that adds two numbers:

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

A curried version of this has the type:

```ts
type CurriedAdd = (a: number) => (b: number) => number;
```

Read it from left to right: call it with a `number`, and you get back a function. Call that function with another `number`, and you finally get a `number`. This is just a function that returns a function — nothing magical yet.

A simple runtime implementation:

```ts
const curriedAdd: CurriedAdd = (a) => (b) => a + b;

curriedAdd(3)(4); // 7
```

This works perfectly but the type `CurriedAdd` is hand-written for one specific function signature. You would have to write a new type for every function you want to curry. The goal is to build a generic type that computes this automatically.

---

## Step 2: Introduce conditional types

TypeScript lets you branch on types using the same `condition ? then : else` syntax as JavaScript, but at the type level:

```ts
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"
type C = IsString<"hello">; // "yes"  — "hello" extends string
```

`T extends string ? X : Y` means: "if type `T` is assignable to `string`, resolve to `X`; otherwise resolve to `Y`." The word `extends` here does not mean inheritance — it means "is assignable to" or "fits inside".

You can put any types in place of `string`, `X`, and `Y`, including other generic types or even recursive references to the type you are defining.

---

## Step 3: Introduce `infer`

`infer` is used inside a conditional type to capture (extract) part of the type you are matching against. Think of it as a pattern-match variable.

Here is a concrete example: extracting the first element of a tuple type.

```ts
type Head<T extends unknown[]> =
  T extends [infer First, ...unknown[]]
    ? First
    : never;

type A = Head<[string, number, boolean]>; // string
type B = Head<[42]>;                      // 42  (literal type)
type C = Head<[]>;                        // never
```

The line `T extends [infer First, ...unknown[]]` says: "Try to match `T` against a tuple that has at least one element. If it matches, bind the type of that first element to the name `First`." You can then use `First` in the `true` branch.

`infer` only works inside a conditional type's `extends` clause. You can use it as many times as you need in one pattern:

```ts
type HeadAndTail<T extends unknown[]> =
  T extends [infer H, ...infer Tail]
    ? { head: H; tail: Tail }
    : never;

type R = HeadAndTail<[string, number, boolean]>;
// { head: string; tail: [number, boolean] }
```

`...infer Tail` captures everything after the first element as a new tuple type. A type alias can also refer to itself — TypeScript resolves recursive types lazily, only expanding branches as needed. Combining `infer` with recursion gives you the core pattern: **peel the first element, do something with it, recurse on the rest**. That is exactly how `Curried` is built.

---

## Step 4: Build `Curried` — one arg at a time

The simplest version of `Curried` only supports calling one argument at a time: `f(a)(b)(c)`. Here is how to build it.

Start with the base case: if there are no parameters left, the curried function is just the return value `R` itself.

```ts
type Curried<P extends unknown[], R> =
  P extends []
    ? R
    : P extends [infer Head, ...infer Tail]
      ? (a: Head) => Curried<Tail, R>
      : never;
```

Walk through each line:

- `P extends unknown[]` — `P` is a tuple of parameter types (e.g. `[number, number, number]`).
- `P extends [] ? R` — base case: no more parameters, so the result is just `R`.
- `P extends [infer Head, ...infer Tail]` — peel the first parameter type into `Head`, and the rest into `Tail`.
- `(a: Head) => Curried<Tail, R>` — build a function that takes `Head` and returns a recursively curried version of the remaining parameters.
- `never` — the fallback branch; it is only reached if `P` is not a known tuple, which should not happen in practice.

Let us trace through `Curried<[number, number, number], number>`:

1. `P = [number, number, number]` — not empty, so go to second branch.
2. `Head = number`, `Tail = [number, number]`.
3. Result so far: `(a: number) => Curried<[number, number], number>`.
4. Expand `Curried<[number, number], number>` the same way: `(a: number) => Curried<[number], number>`.
5. Expand `Curried<[number], number>`: `Tail = []`, so result is `(a: number) => Curried<[], number>`.
6. `Curried<[], number>` = `number`.

Final resolved type: `(a: number) => (a: number) => (a: number) => number`.

This makes `curriedAdd(3)(4)(10)` type-check correctly. But `curriedAdd(3, 4, 10)` does not work yet — that needs the next step.

---

## Step 5: Add all-args-at-once with intersection types

You want the curried function to also accept all arguments in one call: `curriedAdd(3, 4, 10)`. You can express "this type satisfies both A and B" using an intersection: `A & B`.

For function types, an intersection creates an **overload**: the value must be callable in either of the ways described by `A` and `B`.

Extend `Curried` by intersecting the one-at-a-time type with a full-call type:

```ts
type Curried<P extends unknown[], R> =
  P extends []
    ? R
    : P extends [infer Head, ...infer Tail]
      ? Tail extends []
        ? (a: Head) => R
        : ((...args: P) => R) & ((a: Head) => Curried<Tail, R>)
      : never;
```

Two new things here:

- `Tail extends []` — special-case the last parameter. When only one parameter remains, the function type is simply `(a: Head) => R`. No need to intersect with a full-call variant since they are the same thing.
- `((...args: P) => R) & ((a: Head) => Curried<Tail, R>)` — when more than one parameter remains, intersect the full-call signature with the one-at-a-time signature.

The `&` operator on function types produces a type that TypeScript treats as having multiple call signatures (overloads). A value of type `((a: number, b: number, c: number) => number) & ((a: number) => ...)` can be called as either `f(1, 2, 3)` or `f(1)`.

Now `curriedAdd(3, 4, 10)` type-checks. But `curriedAdd(3, 4)(10)` still does not — that is the next problem.

---

## Step 6: The gap — mixed splits

With the type from Step 6, TypeScript only knows two ways to call `curriedAdd`:

1. All three arguments at once: `curriedAdd(3, 4, 10)`.
2. One argument at a time: `curriedAdd(3)(4)(10)`.

But `curriedAdd(3, 4)(10)` is a third calling convention: two arguments first, then one. TypeScript will reject it with an error like:

```
Expected 3 arguments, but got 2.
```

Why? Because the only two-argument overload it knows about is `(...args: [number, number, number]) => number`, which requires exactly three arguments. The partial call `curriedAdd(3, 4)` does not match any signature TypeScript has been given — it does not know that passing two arguments should return a `(c: number) => number`.

To fix this, you need to add overload signatures for every possible prefix split:

- `(a: number, b: number) => (c: number) => number`
- `(a: number, b: number, c: number) => number` (already present)
- `(a: number) => (b: number) => (c: number) => number` (already present)

For a 3-argument function there are only a few cases, but for larger functions this list grows. You need a type that generates all of them automatically. That is `SplitCalls`.

---

## Step 7: Introduce `SplitCalls`

`SplitCalls` generates one overload signature for every way you can split the parameter list into a "prefix you pass now" and a "suffix you pass later". It works by walking through the remaining parameters one by one, building up a growing prefix.

```ts
type SplitCalls<Prefix extends unknown[], Rest extends unknown[], R> =
  Rest extends []
    ? unknown
    : Rest extends [infer Next, ...infer Tail]
      ? ((...args: [...Prefix, Next]) => Curried<Tail, R>) & SplitCalls<[...Prefix, Next], Tail, R>
      : unknown;
```

The three type parameters:

- `Prefix` — the parameters already accumulated into this prefix (starts as `[Head]` from `Curried`).
- `Rest` — the parameters not yet included in the prefix.
- `R` — the final return type.

Walk through each line:

- `Rest extends [] ? unknown` — no more parameters to add to the prefix, so there are no more overloads to generate. Return `unknown`, which is the identity element for `&` (intersecting with `unknown` changes nothing).
- `Rest extends [infer Next, ...infer Tail]` — peel the next parameter off `Rest`.
- `((...args: [...Prefix, Next]) => Curried<Tail, R>)` — generate one overload: a function taking all of `Prefix` plus `Next`, returning a curried version of whatever is left (`Tail`).
- `& SplitCalls<[...Prefix, Next], Tail, R>` — recurse: grow the prefix by `Next` and shrink `Rest` to `Tail`, generating the next overload.

Trace through `SplitCalls<[number], [number, number], number>` (as called from `Curried` for `add(a,b,c)`, where `Head = number` is already in the prefix):

**Iteration 1:**
- `Prefix = [number]`, `Rest = [number, number]`
- `Next = number`, `Tail = [number]`
- Generates: `(a: number, b: number) => Curried<[number], number>`
- Which resolves to: `(a: number, b: number) => (c: number) => number`
- Recurses with `SplitCalls<[number, number], [number], number>`

**Iteration 2:**
- `Prefix = [number, number]`, `Rest = [number]`
- `Next = number`, `Tail = []`
- Generates: `(a: number, b: number, c: number) => Curried<[], number>`
- Which resolves to: `(a: number, b: number, c: number) => number`
- Recurses with `SplitCalls<[number, number, number], [], number>`

**Iteration 3:**
- `Rest = []` — base case, returns `unknown`.

The full result of `SplitCalls<[number], [number, number], number>` is:

```ts
  ((a: number, b: number) => (c: number) => number)
& ((a: number, b: number, c: number) => number)
& unknown
```

Which simplifies to:

```ts
  ((a: number, b: number) => (c: number) => number)
& ((a: number, b: number, c: number) => number)
```

Now plug `SplitCalls` into `Curried`:

```ts
type Curried<P extends unknown[], R> =
  P extends []
    ? R
    : P extends [infer Head, ...infer Tail]
      ? Tail extends []
        ? (a: Head) => R
        : ((...args: P) => R) & ((a: Head) => Curried<Tail, R>) & SplitCalls<[Head], Tail, R>
      : never;
```

The `SplitCalls<[Head], Tail, R>` term adds every intermediate-prefix overload to the intersection. Combined with the full-call overload `(...args: P) => R` and the one-at-a-time overload `(a: Head) => Curried<Tail, R>`, TypeScript now knows about every valid way to split the argument list.

All three of these now type-check:

```ts
curriedAdd(3, 4, 10);  // full call
curriedAdd(3, 4)(10);  // 2 then 1
curriedAdd(3)(4)(10);  // 1 then 1 then 1
```

---

## Final result

```ts
type Curried<Args extends unknown[], Return> =
  Args extends []
    ? Return
    : Args extends [infer First, ...infer Rest]
      ? Rest extends []
        ? (a: First) => Return
        : ((...args: Args) => Return) & ((a: First) => Curried<Rest, Return>) & SplitCalls<[First], Rest, Return>
      : never;

type SplitCalls<Done extends unknown[], Remaining extends unknown[], Return> =
  Remaining extends []
    ? unknown
    : Remaining extends [infer First, ...infer Rest]
      ? ((...args: [...Done, First]) => Curried<Rest, Return>) & SplitCalls<[...Done, First], Rest, Return>
      : unknown;

type TFunc = (...args: never[]) => unknown;

function curry<F extends TFunc>(fn: F): Curried<Parameters<F>, ReturnType<F>> {
  function curried(...args: unknown[]): unknown {
    if (args.length >= fn.length) {
      return (fn as unknown as (...args: unknown[]) => unknown)(...args);
    }
    return (...next: unknown[]) => curried(...args, ...next);
  }
  return curried as Curried<Parameters<F>, ReturnType<F>>;
}

function add(a: number, b: number, c: number) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(3, 4, 10));
console.log(curriedAdd(3, 4)(10));
console.log(curriedAdd(3)(4)(10));
```

A few notes on the runtime `curry` function itself:

- `F extends (...args: never[]) => unknown` — a permissive constraint that accepts any function. `never[]` works here because function parameter types are contravariant: a function that accepts `never` is assignable to a function that accepts anything.
- `Parameters<F>` and `ReturnType<F>` are built-in TypeScript utility types that extract the parameter tuple and return type from a function type. They are what feeds the parameter list into `Curried`.
- The runtime logic is simple: if enough arguments have been accumulated (at least `fn.length`), call the original function. Otherwise, return a new function that concatenates the new arguments and tries again.
- The `as Curried<...>` cast at the end is necessary because TypeScript cannot verify that the dynamically accumulated `unknown[]` arguments satisfy the complex intersection type — the type is only enforced at the call sites.
