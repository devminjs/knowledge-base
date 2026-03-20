# moduleDetection: "auto" & Global Type Augmentation

## The Problem
When augmenting global types (like `Array<T>`), TypeScript must determine whether your file is a **module** or a **script**.

## The Mechanism

### Script Context (with `moduleDetection: "auto"`)
- Files **without** `import`/`export` → treated as scripts
- Global scope declarations merge with ambient types (e.g., `lib.es5.d.ts`)
- Your `interface Array<T>` augmentation applies globally ✓

### Module Context (default behavior)
- Files treated as isolated modules
- `interface Array<T>` declarations are **local** to that file only
- Augmentation doesn't work → "Property 'myFilter' does not exist" error ✗

## Why `"moduleDetection": "auto"` Works

```json
"moduleDetection": "auto"
```

TypeScript **auto-detects** each file's context:
- Has `import`/`export` → module
- No `import`/`export` → script (ambient declarations enabled)

Your `filter.ts` has no imports, so it's treated as a script → global augmentation works.

## The Alternative Fixes

| Approach | How | Tradeoff |
|----------|-----|----------|
| `"moduleDetection": "auto"` | Auto-detect based on imports | ✓ Cleanest (current) |
| Add `export {}` | Explicitly mark as module | Make it a module, loses ambient context |
| `"moduleDetection": "force"` | Treat all as modules | More explicit, less flexible |

## Key Insight
Module detection is about **scope isolation**. Scripts share the global namespace; modules don't. Type augmentation requires the script context.
