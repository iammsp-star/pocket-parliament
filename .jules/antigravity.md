## 2026-05-11 - Zustand Selector Anti-Pattern
**Learning:** Default `useGameStore()` without selectors was being used in heavy 3D canvas components (`IsometricMap` and `IsometricScene`), causing the entire WebGL scene to re-render on *any* store change (e.g. GDP incrementing).
**Action:** Always extract individual state properties using selectors like `useGameStore(s => s.property)` to prevent unrelated state changes from triggering expensive React Three Fiber re-renders.
