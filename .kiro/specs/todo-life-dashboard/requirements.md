# Requirements — To-Do List Life Dashboard

## 1. Overview

A single-page personal dashboard that runs entirely in the browser.  
It shows the current time and a personalised greeting, provides a Pomodoro-style focus timer, manages a to-do list, and holds a user-curated set of quick-launch website links.  
All data is stored in the browser's Local Storage — no backend is required.

---

## 2. Functional Requirements

### FR-1 · Greeting Card

| ID | Requirement |
|----|-------------|
| FR-1.1 | The dashboard **must** display a live digital clock (HH:MM:SS) that updates every second. |
| FR-1.2 | The dashboard **must** display the full date (weekday, month, day, year). |
| FR-1.3 | The greeting text **must** change based on the current hour: "Good Morning" (05:00–11:59), "Good Afternoon" (12:00–17:59), "Good Evening" (18:00–21:59), "Good Night" (22:00–04:59). |
| FR-1.4 | When a custom name is set, the greeting **must** append it (e.g. "Good Morning, Alex"). |
| FR-1.5 | An edit button next to the greeting **must** let the user set or change their display name via a prompt dialog. |
| FR-1.6 | The display name **must** be persisted in Local Storage under the key `dashboard_username`. |

### FR-2 · Focus Timer

| ID | Requirement |
|----|-------------|
| FR-2.1 | The timer **must** count down from 25 minutes (1 500 seconds). |
| FR-2.2 | A **Start** button begins the countdown; pressing Start while the timer is already running **must** have no effect. |
| FR-2.3 | A **Stop** button pauses the countdown without resetting it. |
| FR-2.4 | A **Reset** button stops the countdown and restores the display to 25:00. |
| FR-2.5 | When the countdown reaches 00:00 the timer **must** stop automatically and display an alert notifying the user. |
| FR-2.6 | The timer **must not** drift significantly; it **must** derive remaining time from wall-clock difference rather than pure counter increments. |

### FR-3 · To-Do List

| ID | Requirement |
|----|-------------|
| FR-3.1 | A text input and "Add" button **must** let the user create a new task. |
| FR-3.2 | Submitting an empty input **must** be ignored (no task is created). |
| FR-3.3 | Adding a task whose text matches an existing task (case-insensitive) **must** be rejected and display the message "That task already exists." |
| FR-3.4 | Each task **must** have a checkbox; checking it marks the task as done and applies a strikethrough style. |
| FR-3.5 | Each task **must** have an **Edit** button that replaces the task text with an inline input. Pressing Enter or blurring the input commits the edit; pressing Escape cancels it. |
| FR-3.6 | Editing a task to match another existing task (case-insensitive) **must** be rejected and display the message "That task already exists." |
| FR-3.7 | Each task **must** have a **Delete** button that removes it immediately. |
| FR-3.8 | The task list **must** be persisted in Local Storage under the key `dashboard_tasks` as a JSON array. |
| FR-3.9 | Tasks **must** be restored from Local Storage on page load. |

### FR-4 · Quick Links

| ID | Requirement |
|----|-------------|
| FR-4.1 | A form with a "Link name" field and a "URL" field **must** let the user add a new quick link. |
| FR-4.2 | The URL field **must** accept bare hostnames (e.g. `google.com`) and prepend `https://` automatically. |
| FR-4.3 | An invalid URL **must** be rejected with an alert. |
| FR-4.4 | Each link **must** render as a button that opens the URL in a new tab (`target="_blank"` with `rel="noopener noreferrer"`). |
| FR-4.5 | Each link **must** have an ✕ button that removes it. |
| FR-4.6 | Links **must** be persisted in Local Storage under the key `dashboard_links`. |
| FR-4.7 | On first load (no saved links) the dashboard **must** seed three default links: Google, Gmail, and Calendar. |

---

## 3. Challenge Requirements

### CR-1 · Light / Dark Mode

| ID | Requirement |
|----|-------------|
| CR-1.1 | A theme-toggle button **must** switch between light and dark visual modes. |
| CR-1.2 | Dark mode **must** use a distinct colour palette (dark backgrounds, lighter text, adjusted accents). |
| CR-1.3 | The selected theme **must** be persisted in Local Storage under the key `dashboard_theme` and restored on next visit. |
| CR-1.4 | The toggle button icon **must** reflect the current mode (🌙 in light mode, ☀️ in dark mode). |

### CR-2 · Custom Name in Greeting

Covered by FR-1.4 – FR-1.6 above.

### CR-3 · Prevent Duplicate Tasks

Covered by FR-3.3 and FR-3.6 above.

---

## 4. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | The app **must** work as a standalone HTML file opened directly in the browser (no build step, no server). |
| NFR-2 | The app **must** work in current stable versions of Chrome, Firefox, Edge, and Safari. |
| NFR-3 | All interactions (add, edit, delete, toggle, timer tick) **must** feel instantaneous — no perceptible rendering lag. |
| NFR-4 | The layout **must** be responsive: a two-column grid on wide screens collapses to a single column on viewports ≤ 700 px. |
| NFR-5 | Exactly one CSS file (`css/style.css`) and one JavaScript file (`js/script.js`) may exist in their respective folders. |
| NFR-6 | JavaScript **must** run in strict mode and be wrapped in an IIFE to avoid polluting the global scope. |
| NFR-7 | Local Storage failures (e.g. private browsing quota) **must** be caught silently and not crash the app. |

---

## 5. Constraints

- Technology: HTML, CSS, Vanilla JavaScript only (no frameworks, no build tools).
- Data: Browser Local Storage only (no network requests, no cookies, no IndexedDB).
- Files: `index.html`, `css/style.css`, `js/script.js` — no additional source files.
