## 2024-05-11 - Zustand performance in Next.js React app
**Learning:** By default `useStore()` from Zustand returns the whole state object in the context of React's equality checking. If you destructure specific pieces of state from `useStore()` (e.g. `const { a, b } = useStore()`), any update to ANY part of the state object will cause the component to re-render, because the reference to the entire state object has changed.
**Action:** Use `useShallow` from `zustand/react/shallow` when selecting multiple properties, e.g. `const { a, b } = useStore(useShallow(s => ({ a: s.a, b: s.b })))` to prevent unnecessary re-renders when unselected state parts change. Or select parts individually.

## 2024-05-11 - React useMemo dependency array issue
**Learning:** `useMemo` dependency arrays need to reflect the variables actually used in the calculation, or else it may not recalculate correctly, or the linter will complain.
**Action:** Always check the dependency array of `useMemo` hooks.
