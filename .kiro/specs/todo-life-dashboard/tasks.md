# Tasks — To-Do List Life Dashboard 

> Status legend: ✅ Done · 🔲 Pending

---

## Milestone 1 · Project Scaffold

| # | Task | Requirement(s) | Status |
|---|------|----------------|--------|
| 1.1 | Create `index.html` with correct `<meta charset>`, viewport tag, page title, link to `css/style.css`, and script tag for `js/script.js`. | NFR-1, NFR-5 | ✅ |
| 1.2 | Create `css/style.css` with CSS custom-property tokens for the light theme and all base resets (`*, body`). | NFR-5 | ✅ |
| 1.3 | Create `js/script.js` as a strict-mode IIFE with the four Local Storage key constants. | NFR-6, NFR-7 | ✅ |

---

## Milestone 2 · Greeting Card

| # | Task | Requirement(s) | Status |
|---|------|----------------|--------|
| 2.1 | Add greeting-card HTML section: `#clock`, `#date`, `#greeting-text`, and `#edit-name` button. | FR-1.1 – FR-1.5 | ✅ |
| 2.2 | Implement `updateClock()`: read `new Date()`, format HH:MM:SS, write full locale date, and derive greeting from hour. | FR-1.1 – FR-1.3 | ✅ |
| 2.3 | Append the stored username to the greeting when present. | FR-1.4 | ✅ |
| 2.4 | Wire `#edit-name` click to `window.prompt`, trim result, persist to `dashboard_username`, call `updateClock()`. | FR-1.5, FR-1.6 | ✅ |
| 2.5 | Style the greeting card: centred layout, large `--accent`-coloured clock, muted date, bold greeting. | NFR-3 | ✅ |
| 2.6 | Start `setInterval(updateClock, 1000)` on page load. | FR-1.1 | ✅ |

---

## Milestone 3 · Focus Timer

| # | Task | Requirement(s) | Status |
|---|------|----------------|--------|
| 3.1 | Add Focus Timer HTML: `#timer-display`, `#timer-start`, `#timer-stop`, `#timer-reset`. | FR-2.1 – FR-2.4 | ✅ |
| 3.2 | Implement `renderTimer()` to format remaining seconds as MM:SS. | FR-2.1 | ✅ |
| 3.3 | Implement drift-free `tick()`: compute `remaining = Math.round((endTime - Date.now()) / 1000)`, call `renderTimer()`, auto-stop and alert at zero. | FR-2.5, FR-2.6 | ✅ |
| 3.4 | Wire Start button: guard against double-start; set `endTime`; launch `setInterval(tick, 250)`. | FR-2.2 | ✅ |
| 3.5 | Wire Stop button: `clearInterval`. | FR-2.3 | ✅ |
| 3.6 | Wire Reset button: stop, restore `remaining = 1500`, call `renderTimer()`. | FR-2.4 | ✅ |
| 3.7 | Style timer card: large tabular-numeral display in `--accent`, centred controls. | NFR-3 | ✅ |

---

## Milestone 4 · To-Do List

| # | Task | Requirement(s) | Status |
|---|------|----------------|--------|
| 4.1 | Add Tasks HTML: `#task-form`, `#task-input`, submit button, `#task-message`, `#task-list`. | FR-3.1 | ✅ |
| 4.2 | Implement `load`/`save` helpers with try/catch; initialise `tasks` array from `dashboard_tasks`. | FR-3.8, FR-3.9, NFR-7 | ✅ |
| 4.3 | Implement `isDuplicate(text, ignoreId)` for case-insensitive deduplication. | FR-3.3, FR-3.6 | ✅ |
| 4.4 | Implement `renderTasks()`: build `<li>` nodes dynamically with checkbox, text span, Edit button, and Delete button; apply `.done` class when `task.done` is true. | FR-3.4, FR-3.5, FR-3.7 | ✅ |
| 4.5 | Wire task form submit: validate non-empty, check duplicate, push new task object `{ id, text, done: false }`, save, re-render. | FR-3.1 – FR-3.3 | ✅ |
| 4.6 | Implement `startEdit(task, li)`: replace text span with `<input>`, commit on Enter/blur, cancel on Escape, re-check duplicates before saving. | FR-3.5, FR-3.6 | ✅ |
| 4.7 | Wire Delete button: filter task out of array, save, re-render. | FR-3.7 | ✅ |
| 4.8 | Clear `#task-message` on each `task-input` input event. | FR-3.3 | ✅ |
| 4.9 | Style task items: flex row, checkbox, text, action buttons; strikethrough + muted colour for done items. | NFR-3 | ✅ |

---

## Milestone 5 · Quick Links

| # | Task | Requirement(s) | Status |
|---|------|----------------|--------|
| 5.1 | Add Quick Links HTML: `#link-form` with `#link-name` and `#link-url` inputs, submit button, `#link-list` container. | FR-4.1 | ✅ |
| 5.2 | Seed default links (Google, Gmail, Calendar) on first load when `dashboard_links` is absent. | FR-4.7 | ✅ |
| 5.3 | Implement `normalizeUrl(raw)`: prepend `https://` if no protocol; validate with `new URL()`; return `null` on failure. | FR-4.2, FR-4.3 | ✅ |
| 5.4 | Implement `renderLinks()`: build link tiles as `<a class="link-btn">` with an overlaid ✕ remove button. | FR-4.4, FR-4.5 | ✅ |
| 5.5 | All `<a>` links must open in `target="_blank"` with `rel="noopener noreferrer"`. | FR-4.4 | ✅ |
| 5.6 | Wire link form submit: validate name and URL, push to links array, save to `dashboard_links`, re-render. | FR-4.1 – FR-4.3, FR-4.6 | ✅ |
| 5.7 | Wire ✕ remove button: splice link from array, save, re-render. | FR-4.5 | ✅ |
| 5.8 | Style link grid: 3-column CSS Grid, accent-coloured tiles, ellipsis overflow. | NFR-3 | ✅ |

---

## Milestone 6 · Light / Dark Mode (Challenge CR-1)

| # | Task | Requirement(s) | Status |
|---|------|----------------|--------|
| 6.1 | Add dark-mode token overrides under `[data-theme="dark"]` in `style.css`. | CR-1.2 | ✅ |
| 6.2 | Add `#theme-toggle` fixed button to `index.html`. | CR-1.1 | ✅ |
| 6.3 | Implement `applyTheme(theme)`: set `data-theme` on `<html>`, update button icon (🌙 / ☀️). | CR-1.1, CR-1.4 | ✅ |
| 6.4 | On page load, call `applyTheme(load(KEYS.theme, 'light'))` to restore saved preference. | CR-1.3 | ✅ |
| 6.5 | Wire toggle click: flip theme, call `applyTheme`, persist to `dashboard_theme`. | CR-1.3 | ✅ |

---

## Milestone 7 · Responsive Layout & Polish

| # | Task | Requirement(s) | Status |
|---|------|----------------|--------|
| 7.1 | Implement 2-column CSS Grid (`.grid`) for the middle section; stack to 1 column at ≤ 700 px. | NFR-4 | ✅ |
| 7.2 | Narrow Quick Links grid from 3 columns to 2 at ≤ 700 px. | NFR-4 | ✅ |
| 7.3 | Verify system font stack and readable font sizes across all cards. | NFR-3 | ✅ |
| 7.4 | Add `aria-label` to theme toggle button and link remove buttons. | Design §8 | ✅ |
| 7.5 | Add `role="alert"` to `#task-message` for screen-reader announcements. | Design §8 | ✅ |

---

## Summary

| Milestone | Tasks | Done |
|-----------|-------|------|
| 1 · Scaffold | 3 | 3 |
| 2 · Greeting | 6 | 6 |
| 3 · Timer | 7 | 7 |
| 4 · To-Do | 9 | 9 |
| 5 · Quick Links | 8 | 8 |
| 6 · Dark Mode | 5 | 5 |
| 7 · Layout & Polish | 5 | 5 |
| **Total** | **43** | **43** |

All tasks are complete. The implementation in `index.html`, `css/style.css`, and `js/script.js` satisfies every requirement listed in `requirements.md`.
