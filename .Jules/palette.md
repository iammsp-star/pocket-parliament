## 2024-05-11 - Accessibility for Icon-Only Buttons
**Learning:** React elements utilizing Lucide icons often omit aria-labels. Components like TopNav and BriefModal relied solely on tooltips or visual context, failing basic screen reader accessibility requirements.
**Action:** Consistently verify `aria-label` inclusion when wrapping `<Icon />` components in interactive wrappers like `<button>` or `<motion.button>`.
