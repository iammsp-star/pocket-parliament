## 2024-05-18 - Missing ARIA labels pattern in modals
**Learning:** Found a recurring pattern where icon-only buttons in modals (like SetupModal emojis and BriefModal close buttons) lacked `aria-label`s, which is critical for screen reader users trying to navigate modal interfaces.
**Action:** Always verify icon-only interactive elements in modals include descriptive `aria-label`s, and ensure form inputs are properly associated with their labels using `htmlFor` and `id`.
