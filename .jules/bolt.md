## 2024-11-20 - [Performance] Cache static data transformations
**Learning:** Calling `Object.entries()` on constant objects inside a React render function causes unnecessary array allocations on every render.
**Action:** Extract these transformations into static constants outside of the component body to reduce memory allocations and improve rendering speed.
