## 2024-05-18 - [Fix O(N^2) mapping issues]
**Learning:** Using `.findIndex()` inside a `.map()` callback to find the index of the current element creates an O(N^2) complexity, leading to unnecessary performance overhead.
**Action:** Use the `index` parameter provided by the `.map()` callback to avoid the nested loop.
