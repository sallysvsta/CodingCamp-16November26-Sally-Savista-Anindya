# Design — To-Do List Life Dashboard

## 1. File Structure

```
software-engineering/
├── index.html          ← single HTML page (all markup)
├── css/
│   └── style.css       ← all styles (theme variables, layout, components)
└── js/
    └── script.js       ← all logic (wrapped in a strict-mode IIFE)
```

No build step, no package manager, no additional files.

---

## 2. Visual Layout

```
┌─────────────────────────────────────────────────────┐
│  [🌙 / ☀️]  ← fixed theme toggle (top-right)        │
│                                                     │
│  ╔═══════════════════════════════════════════════╗  │
│  ║         Greeting Card  (full width)           ║  │
│  ║   HH:MM:SS   |  Weekday, Month DD YYYY        ║  │
│  ║      Good Morning, <Name> ✎                   ║  │
│  ╚═══════════════════════════════════════════════╝  │
│                                                     │
│  ╔══════════════════╗  ╔════════════════════════╗   │
│  ║  Focus Timer     ║  ║  Tasks                 ║   │
│  ║    25:00         ║  ║  [input field] [Add]   ║   │
│  ║ [Start][Stop][R] ║  ║  ☐ Task 1  [Edit][Del] ║   │
│  ╠══════════════════╣  ║  ✓ Task 2  [Edit][Del] ║   │
│  ║  Quick Links     ║  ║  ☐ Task 3  [Edit][Del] ║   │
│  ║ [Name][URL][Add] ║  ╚════════════════════════╝   │
│  ║ [Google][Gmail]… ║                               │
│  ╚══════════════════╝                               │
└─────────────────────────────────────────────────────┘
```

- **Outer page**: fixed-attachment gradient background (purple → dark purple).
- **Cards**: white rounded rectangles (`border-radius: 10px`) with a soft box-shadow.
- **Grid**: CSS Grid, `1fr 1fr` on wide screens; single column on ≤ 700 px.
- Left column stacks Focus Timer on top of Quick Links.
- Right column is the Tasks card (taller, occupies full left-column height).

---

## 3. Colour System (CSS Custom Properties)

| Token | Light value | Dark value |
|-------|-------------|------------|
| `--bg-start` | `#667eea` | `#1c1f3a` |
| `--bg-end` | `#764ba2` | `#2b1a45` |
| `--card-bg` | `#ffffff` | `#23263d` |
| `--text` | `#2d3142` | `#eceefa` |
| `--text-muted` | `#6b7280` | `#9aa0b8` |
| `--accent` | `#667eea` | `#7f93f5` |
| `--accent-hover` | `#5568d3` | `#93a4f8` |
| `--secondary-bg` | `#e9ecef` | `#343853` |
| `--secondary-text` | `#495057` | `#d5d9ee` |
| `--border` | `#eceef3` | `#343853` |
| `--input-border` | `#d5d9e2` | `#44496a` |
| `--danger` | `#e0605e` | `#d9534f` |
| `--shadow` | `0 4px 14px rgba(0,0,0,.12)` | `0 4px 14px rgba(0,0,0,.4)` |

Theme is applied via `data-theme="dark"` on `<html>`.  
Active theme name is stored in Local Storage (`dashboard_theme`).

---

## 4. HTML Structure

```html
<html data-theme="light|dark">
<head>
  <!-- charset, viewport, title, style.css link -->
</head>
<body>
  <button id="theme-toggle" class="theme-toggle">🌙</button>

  <main class="container">

    <!-- Greeting -->
    <section class="card greeting-card">
      <div id="clock">00:00:00</div>
      <div id="date"></div>
      <h2><span id="greeting-text">Good Morning</span>
          <button id="edit-name">✎</button></h2>
    </section>

    <div class="grid">
      <div class="column">

        <!-- Focus Timer -->
        <section class="card">
          <h3>Focus Timer</h3>
          <div id="timer-display">25:00</div>
          <div class="timer-controls">
            <button id="timer-start">Start</button>
            <button id="timer-stop">Stop</button>
            <button id="timer-reset">Reset</button>
          </div>
        </section>

        <!-- Quick Links -->
        <section class="card">
          <h3>Quick Links</h3>
          <form id="link-form">
            <input id="link-name" placeholder="Link name">
            <input id="link-url"  placeholder="URL">
            <button type="submit">Add Link</button>
          </form>
          <div id="link-list"></div>
        </section>

      </div>

      <!-- Tasks -->
      <section class="card tasks-card">
        <h3>Tasks</h3>
        <form id="task-form">
          <input id="task-input" placeholder="Add a new task...">
          <button type="submit">Add</button>
        </form>
        <p id="task-message" role="alert"></p>
        <ul id="task-list"></ul>
      </section>
    </div>

  </main>
  <script src="js/script.js"></script>
</body>
```

---

## 5. JavaScript Architecture

The entire script is a single IIFE in strict mode.  
No classes — plain functions and variables in the closure.

### 5.1 Module Sections (in order)

```
① Storage helpers          load(key, fallback) / save(key, value)
② Greeting & Clock         updateClock(), getGreeting(hour), edit-name handler
③ Focus Timer              tick(), stopTimer(), renderTimer(), button handlers
④ To-Do List               renderTasks(), startEdit(), isDuplicate(), form handler
⑤ Quick Links              renderLinks(), normalizeUrl(), form handler
⑥ Theme Toggle             applyTheme(theme), toggle handler
```

### 5.2 Data Shapes (Local Storage)

**Tasks** — `dashboard_tasks` → `Array<Task>`
```json
[
  { "id": 1700000000000.4, "text": "Buy milk", "done": false },
  { "id": 1700000001234.7, "text": "Read chapter 3", "done": true }
]
```
`id` is `Date.now() + Math.random()` to avoid collisions.

**Links** — `dashboard_links` → `Array<Link>`
```json
[
  { "name": "Google",   "url": "https://www.google.com" },
  { "name": "Gmail",    "url": "https://mail.google.com" },
  { "name": "Calendar", "url": "https://calendar.google.com" }
]
```

**Theme** — `dashboard_theme` → `"light"` | `"dark"`

**Username** — `dashboard_username` → `string`

### 5.3 Key Algorithms

**Clock (drift-free)**  
`setInterval(updateClock, 1000)` reads `new Date()` each tick — no accumulated counter.

**Timer (drift-free)**  
On Start: `endTime = Date.now() + remaining * 1000`.  
On each `setInterval` tick (250 ms): `remaining = Math.round((endTime - Date.now()) / 1000)`.  
This corrects for any JS event-loop delay automatically.

**Duplicate detection**  
`tasks.some(t => t.id !== ignoreId && t.text.toLowerCase() === input.toLowerCase())`  
`ignoreId` is `null` on add and the task's own id on edit, so a task may be "re-saved" with the same text without a false positive.

**URL normalisation**  
If the raw input does not start with `http://` or `https://`, prepend `https://`.  
Then attempt `new URL(normalised)` — catch any exception and treat as invalid.

---

## 6. Component Styling Notes

| Component | Key rules |
|-----------|-----------|
| `.greeting-card` | `text-align: center`, large clock in `--accent` colour |
| `.timer-display` | `font-size: 44px`, `font-variant-numeric: tabular-nums` |
| `.task-item.done .task-text` | `text-decoration: line-through; color: var(--text-muted)` |
| `.link-list` | `display: grid; grid-template-columns: repeat(3, 1fr)` |
| `.link-remove` | Absolutely positioned `✕` circle in top-right of each link tile |
| `.theme-toggle` | `position: fixed; top: 14px; right: 14px` — always visible |

---

## 7. Responsive Breakpoint

```css
@media (max-width: 700px) {
  .grid        { grid-template-columns: 1fr; }
  .link-list   { grid-template-columns: repeat(2, 1fr); }
}
```

On narrow viewports the two-column grid stacks vertically, and the Quick Links grid narrows from 3 columns to 2.

---

## 8. Accessibility Considerations

- Theme toggle has `aria-label="Toggle light/dark mode"`.
- Task message paragraph has `role="alert"` for screen-reader announcements.
- Link remove buttons have `aria-label="Remove <link name>"`.
- All interactive elements are keyboard-reachable native HTML elements.
