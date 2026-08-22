---
name: orbit-os-ui
description: Design system and component rules for Orbit OS. Read this before writing any UI code for the Smart Board, Guardian Command, Focus Gate, or any other Orbit OS surface. Covers color tokens, typography, spacing, component patterns, and surface-specific rules.
sources: [chat]
aliases: [orbit ui, orbit design, guardian command ui, smart board ui, focus gate ui]
---

# Orbit OS — UI Design Skill

Use this whenever you are writing, editing, or reviewing any UI code for the Orbit OS project. Apply every rule here before touching a component. This is the source of truth for how Orbit OS looks and behaves.

---

## 1. Design Identity

Orbit OS uses a design language called **"The Calm Administrator."** The goal is to feel trustworthy, structured, and warm — not scary, not gamey, not corporate. A kid looking at a blocked-site message should not feel punished; they should feel informed. A parent looking at the dashboard should feel in control, not overwhelmed.

**Key feel words:** structured, legible, calm, warm, purposeful.

**Avoid:** harsh reds as the dominant blocked-state color, playful rounded bubbly shapes (this is not a game), overly dark backgrounds on child-facing screens, decorative animations on enforcement screens.

---

## 2. Color Tokens

Use these exact values. Do not invent new colors without updating this skill.

```css
/* Primary — sidebar, primary text on light surfaces */
--color-primary:                #182232;
--color-primary-container:      #2d3748;   /* hover/elevated states in sidebar */
--color-on-primary:             #ffffff;
--color-on-primary-container:   #96a0b5;   /* secondary text in sidebar */
--color-primary-fixed:          #d9e3f9;
--color-primary-fixed-dim:      #bdc7dc;

/* Secondary — CTAs, toggles, completion indicators, progress bars */
--color-secondary:              #006c49;
--color-secondary-container:    #6cf8bb;
--color-on-secondary:           #ffffff;
--color-secondary-fixed:        #6ffbbe;
--color-secondary-fixed-dim:    #4edea3;
--color-on-secondary-container: #00714d;

/* Tertiary — not used in MVP; reserved for alerts */
--color-tertiary:               #4c0009;
--color-tertiary-container:     #710a16;

/* Background & Surface */
--color-background:             #FDFBF7;   /* main canvas — soft paper cream */
--color-surface:                #fbf9f5;
--color-surface-bright:         #fbf9f5;
--color-surface-dim:            #dbdad6;
--color-surface-container-low:  #f5f3ef;
--color-surface-container:      #efeeea;
--color-surface-container-high: #eae8e4;
--color-surface-container-highest: #e4e2de;
--color-surface-container-lowest:  #ffffff;

/* Text */
--color-on-background:          #1b1c1a;
--color-on-surface:             #1b1c1a;
--color-on-surface-variant:     #45474c;

/* Borders */
--color-outline:                #75777d;
--color-outline-variant:        #c5c6cd;

/* Error — blocked states, rejected proof, hard stops */
--color-error:                  #ba1a1a;
--color-error-container:        #ffdad6;
--color-on-error:               #ffffff;
--color-on-error-container:     #93000a;

/* Inverse */
--color-inverse-surface:        #30312e;
--color-inverse-on-surface:     #f2f0ed;
```

**Tailwind mapping:** These are configured in `tailwind.config.js` under `theme.extend.colors`. Use the Tailwind class names (e.g., `bg-primary`, `text-secondary`, `border-outline-variant`) directly in JSX/HTML.

---

## 3. Typography

All text uses **Inter**. Load it from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

| Role              | Class              | Size  | Line Height | Letter Spacing | Weight |
| ----------------- | ------------------ | ----- | ----------- | -------------- | ------ |
| Display Large     | `text-display-lg`  | 32px  | 40px        | -0.02em        | 700    |
| Headline Medium   | `text-headline-md` | 24px  | 32px        | -0.01em        | 600    |
| Headline Small    | `text-headline-sm` | 20px  | 28px        | —              | 600    |
| Title Large       | `text-title-lg`    | 18px  | 24px        | —              | 600    |
| Body Large        | `text-body-lg`     | 16px  | 24px        | —              | 400    |
| Body Medium       | `text-body-md`     | 14px  | 20px        | —              | 400    |
| Label Medium      | `text-label-md`    | 12px  | 16px        | +0.05em        | 600    |
| Label Small       | `text-label-sm`    | 11px  | 14px        | —              | 500    |

**Rule:** Page titles use `text-display-lg`. Section headings use `text-headline-md`. Card titles use `text-headline-sm` or `text-title-lg`. Table headers use `text-label-md`. Body copy uses `text-body-md`. Status badges use `text-label-sm`.

---

## 4. Spacing

Base unit: **4px**.

| Token              | Value | Tailwind        | Usage                          |
| ------------------ | ----- | --------------- | ------------------------------ |
| `xs`               | 8px   | `p-xs`, `gap-xs`| Icon gaps, chip padding        |
| `sm`               | 12px  | `p-sm`, `py-sm` | Button padding, nav item padding |
| `md`               | 16px  | `p-md`, `gap-md`| Card internal padding          |
| `lg`               | 24px  | `p-lg`          | Section padding, card padding  |
| `xl`               | 32px  | `p-xl`          | Between sections               |
| `gutter`           | 16px  | `px-gutter`     | Mobile page margin             |
| `margin-desktop`   | 40px  | `p-margin-desktop` | Desktop page margin         |
| `sidebar-width`    | 260px | `w-sidebar-width` | Fixed left nav               |

---

## 5. Border Radius

| Scale     | Value   | Tailwind         | Usage                              |
| --------- | ------- | ---------------- | ---------------------------------- |
| `DEFAULT` | 2px     | `rounded`        | Input fields, text areas           |
| `lg`      | 4px     | `rounded-lg`     | Buttons, tags, small chips         |
| `xl`      | 8px     | `rounded-xl`     | Cards, modals, drawers, panels     |
| `full`    | 12px    | `rounded-full`   | Status badges, avatar chips, pills |

Do not use `rounded-2xl`, `rounded-3xl`, or fully circular buttons (those feel too playful for this product). Exception: avatar images always use `rounded-full` (circular).

---

## 6. Icons

Use **Material Symbols Outlined** exclusively.

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

```css
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.material-symbols-outlined[data-weight="fill"] {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

- Default: FILL=0 (outlined). Active/selected: FILL=1 (filled). Use `data-weight="fill"` attribute to switch.
- Standard size: 24px. Small contexts (chips, inline): 18px via `text-[18px]`.
- Always pair an icon with a visible label OR an `aria-label`. Never icon-only without ARIA.

**Common icons used in Orbit OS:**
| Context | Icon name |
|---|---|
| Dashboard nav | `dashboard` |
| Allowlist | `security` |
| Activity history | `history` |
| Settings | `settings` |
| Add | `add` |
| Logout | `logout` |
| Close / remove | `close` |
| Globe / domain | `language` |
| Search | `search` |
| Notifications | `notifications` |
| Help | `help` |
| Lock / Focus Mode | `lock` |
| Camera / photo proof | `photo_camera` |
| Timer task | `timer` |
| Checkbox task | `check_box` |
| Parent key / PIN | `key` |
| Streak / fire | `local_fire_department` |

---

## 7. Component Patterns

### 7.1 Cards

Standard card used for all main sections on the dashboard:

```html
<section class="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant">
  ...
</section>
```

- Always `rounded-xl` (8px).
- Always `border border-outline-variant` (1px, no box-shadow).
- Internal padding: `p-lg` (24px).
- Section heading: `text-headline-md text-on-surface` + optional `text-body-md text-on-surface-variant` description below it.
- Heading row has `mb-lg` before the first content block.

Never use `box-shadow` on cards. The border + off-white surface creates enough separation from the cream background.

### 7.2 Buttons

**Primary (filled):**
```html
<button class="px-6 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary/90 transition-colors">
  Save Changes
</button>
```

**Secondary (outlined):**
```html
<button class="px-6 py-2 border border-primary text-primary font-label-md text-label-md rounded-lg hover:bg-primary-fixed/30 transition-colors bg-transparent flex items-center">
  <span class="material-symbols-outlined mr-xs text-[18px]">add</span> Add
</button>
```

**CTA (green — for positive actions like "Add New Device"):**
```html
<button class="w-full py-sm bg-secondary text-on-secondary rounded-lg font-label-md text-label-md hover:bg-secondary/90 transition-colors flex items-center justify-center">
  <span class="material-symbols-outlined mr-xs text-[18px]">add</span> Add New Device
</button>
```

**Icon-only:**
```html
<button class="text-on-surface-variant hover:text-secondary transition-colors" aria-label="Notifications">
  <span class="material-symbols-outlined">notifications</span>
</button>
```

Rules:
- All buttons: `rounded-lg` (4px radius). Never fully rounded buttons in the admin interface.
- All interactive elements: `transition-colors`. Hover states are mandatory.
- Use `active:opacity-80` for tap feedback on icon buttons.

### 7.3 Chips / Tags (Allowlist entries, Status badges)

**Allowlist chip (removable):**
```html
<div class="inline-flex items-center bg-secondary-fixed/20 border border-secondary text-secondary-fixed-dim px-sm py-1 rounded-DEFAULT font-label-md text-label-md">
  Google Classroom
  <button class="ml-2 text-secondary hover:text-secondary-fixed-dim focus:outline-none" aria-label="Remove Google Classroom">
    <span class="material-symbols-outlined text-[16px]">close</span>
  </button>
</div>
```

**Status badge — Allowed:**
```html
<span class="inline-flex items-center bg-secondary-fixed/20 text-secondary-fixed-dim px-2 py-1 rounded-full font-label-sm text-label-sm border border-secondary/30">
  <span class="w-1.5 h-1.5 rounded-full bg-secondary mr-1"></span> Allowed
</span>
```

**Status badge — Blocked:**
```html
<span class="inline-flex items-center bg-error-container/40 text-on-error-container px-2 py-1 rounded-full font-label-sm text-label-sm border border-error/30">
  <span class="w-1.5 h-1.5 rounded-full bg-error mr-1"></span> Blocked
</span>
```

**Status badge — Pending Approval:**
```html
<span class="inline-flex items-center bg-primary-fixed/40 text-on-primary-fixed-variant px-2 py-1 rounded-full font-label-sm text-label-sm border border-primary-fixed-dim/50">
  <span class="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim mr-1 animate-pulse"></span> Pending
</span>
```

### 7.4 Toggle Switch

Used for "Enable Strict Focus Mode" and similar binary settings.

```html
<div class="flex items-center">
  <span class="font-label-md text-label-md text-on-surface mr-sm">Enable Strict Focus Mode</span>
  <div class="relative inline-block w-12 align-middle select-none">
    <input id="toggle-focus" name="toggle-focus" type="checkbox"
      class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none shadow-sm" />
    <label for="toggle-focus" class="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer"></label>
  </div>
</div>
```

CSS (include in global styles):
```css
.toggle-checkbox { right: 0; z-index: 1; border-color: #c5c6cd; transition: all 0.3s; }
.toggle-checkbox:checked { right: 0; border-color: #006c49; }
.toggle-label { width: 3rem; height: 1.5rem; background-color: #c5c6cd; border-radius: 9999px; transition: all 0.3s; }
.toggle-checkbox:checked + .toggle-label { background-color: #006c49; }
```

### 7.5 Input Fields

**Text input with icon prefix:**
```html
<div class="relative">
  <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <span class="material-symbols-outlined text-outline">language</span>
  </span>
  <input type="text"
    placeholder="Add website (e.g., scholar.google.com)"
    class="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-colors" />
</div>
```

**Search bar (top bar variant):**
```html
<div class="relative w-full">
  <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <span class="material-symbols-outlined text-outline">search</span>
  </span>
  <input type="text" placeholder="Search..."
    class="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
</div>
```

Note: search bar is `rounded-full`; regular inputs are `rounded-lg`.

### 7.6 Tables (Activity History)

```html
<div class="overflow-x-auto">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-[#F8FAFC] border-b border-outline-variant">
        <th class="py-sm px-lg font-label-md text-label-md text-on-surface-variant">Timestamp</th>
        ...
      </tr>
    </thead>
    <tbody class="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/50">
      <tr class="hover:bg-surface-container-low/50 transition-colors">
        <td class="py-md px-lg whitespace-nowrap">...</td>
        ...
      </tr>
    </tbody>
  </table>
</div>
```

Rules:
- Table always sits inside a card with `p-0 overflow-hidden` (no double padding).
- Card heading has `p-lg border-b border-outline-variant` as its own row before the table.
- `whitespace-nowrap` on timestamp cells.
- URL column: `hidden md:table-cell` (hidden on mobile).
- Row hover: `hover:bg-surface-container-low/50 transition-colors`.

### 7.7 Sidebar Navigation

```html
<nav class="hidden md:flex flex-col h-full py-lg bg-primary w-sidebar-width fixed left-0 top-0 border-r border-outline-variant z-20">
  <!-- Logo -->
  <div class="px-md mb-xl">
    <h1 class="font-display-lg text-display-lg text-on-primary">Orbit OS</h1>
    <p class="font-label-md text-label-md text-on-primary-container mt-xs">The Calm Administrator</p>
  </div>

  <!-- Nav links -->
  <div class="flex-1 px-sm space-y-base overflow-y-auto">
    <!-- Active link -->
    <a href="#" class="flex items-center px-md py-sm rounded-lg text-on-primary font-bold border-l-4 border-secondary-fixed bg-on-primary-fixed-variant/10">
      <span class="material-symbols-outlined mr-sm" data-weight="fill">dashboard</span>
      <span class="font-title-lg text-title-lg">Dashboard</span>
    </a>
    <!-- Inactive link -->
    <a href="#" class="flex items-center px-md py-sm rounded-lg text-on-primary-container hover:bg-primary-container/50 hover:text-on-primary transition-all duration-200">
      <span class="material-symbols-outlined mr-sm">security</span>
      <span class="font-title-lg text-title-lg">Allowlist Rules</span>
    </a>
  </div>

  <!-- Bottom actions -->
  <div class="px-md mt-auto pt-lg border-t border-outline-variant/20">
    <button class="w-full py-sm bg-secondary text-on-secondary rounded-lg font-label-md text-label-md hover:bg-secondary/90 transition-colors mb-md flex items-center justify-center">
      <span class="material-symbols-outlined mr-xs text-[18px]">add</span> Add New Device
    </button>
    <a href="#" class="flex items-center px-md py-sm rounded-lg text-on-primary-container hover:bg-primary-container/50 hover:text-on-primary transition-all">
      <span class="material-symbols-outlined mr-sm">logout</span>
      <span class="font-title-lg text-title-lg">Logout</span>
    </a>
  </div>
</nav>
```

Active state: `border-l-4 border-secondary-fixed bg-on-primary-fixed-variant/10 text-on-primary font-bold` and filled icon variant.
Inactive state: `text-on-primary-container` + hover to `hover:text-on-primary hover:bg-primary-container/50`.

### 7.8 Top App Bar

```html
<header class="bg-surface flex justify-between items-center w-full px-margin-desktop md:pl-lg h-16 border-b border-outline-variant z-10 shrink-0">
  <!-- Mobile brand (hidden desktop) -->
  <div class="md:hidden">
    <span class="font-headline-md text-headline-md font-bold text-on-background">Orbit OS</span>
  </div>
  <!-- Search (desktop) -->
  <div class="hidden md:flex items-center flex-1 max-w-md">
    <!-- search input here -->
  </div>
  <!-- Trailing actions -->
  <div class="flex items-center space-x-md">
    <!-- icon buttons, Save button, avatar -->
  </div>
</header>
```

Height: always `h-16` (64px). Background: `bg-surface`. Bottom border: `border-b border-outline-variant`.

---

## 8. Surface-Specific Rules

### Guardian Command (Admin)
- Uses the full sidebar + top bar layout.
- Main canvas: `bg-[#FDFBF7]`, left margin `md:ml-[260px]` to clear sidebar.
- Cards use `bg-surface-container-lowest` (white).
- All destructive actions (delete task, reject photo) use `text-error` or `bg-error-container` — never `bg-error` as a background for a button (too harsh).

### Smart Board (Child Task View)
- No sidebar. Full-width, single column. Touch-first (min 44px tap targets on all interactive elements).
- Background same cream `#FDFBF7`.
- Task rows are taller (min `py-md`) and use larger type (`text-title-lg` for task name).
- Completed tasks: title gets `line-through text-on-surface/60`. Do not hide/remove completed items.
- Progress bar: full-width, `h-2`, `bg-outline-variant` track, `bg-secondary` fill, `rounded-full`.

### Focus Gate (Chrome Extension Intercept Page)
- Full viewport. No sidebar. No navigation chrome.
- Background: `#FDFBF7` — same warm cream. Never a red background.
- Lock/stop icon: `text-on-surface-variant`, medium size (48px). Not large or alarming.
- Message hierarchy: large status heading (`text-headline-md`), child name + date (`text-body-lg text-on-surface-variant`), task list below.
- Task list: same row style as Smart Board but read-only (no tap to complete from the gate).
- "Open allowed sites" section: collapsible, shows chip-links to whitelisted domains.
- PIN field: `text-label-md text-on-surface-variant`. Small, right-aligned, unobtrusive. Never suggest the PIN as the primary action.
- Bypass button ("Ask parent"): `text-secondary underline` text link, not a full button.

---

## 9. Motion & Animation

Use motion sparingly. Rules:

- **Progress bars:** transition width with `transition-all duration-500 ease-out`. No bounce.
- **Sidebar hover:** `transition-all duration-200 ease-in-out`.
- **Button hover/active:** `transition-colors` only (no scaling on desktop buttons).
- **Pending badge:** `animate-pulse` on the status dot only.
- **Toast notifications:** slide in from top-right, auto-dismiss after 4 seconds. Use `transition-transform` and `transition-opacity`.
- **No confetti, no splash screens, no particle effects.** The gamification vault (Phase 2) can add them — not the MVP.
- Always respect `prefers-reduced-motion`. Wrap any non-essential animation in:
  ```css
  @media (prefers-reduced-motion: reduce) { .animate-pulse { animation: none; } }
  ```

---

## 10. Empty, Loading, and Error States

| State   | Pattern                                                                                        |
| ------- | ---------------------------------------------------------------------------------------------- |
| Loading | Skeleton shimmer blocks in the same shape as the content. `bg-surface-container animate-pulse`.|
| Empty   | Centered icon (`text-outline`, 48px) + one-line `text-body-md text-on-surface-variant` label + optional CTA button. |
| Error   | Inline banner below card heading: `bg-error-container text-on-error-container rounded-lg p-sm` with a [Retry] link. |
| Offline | Top banner: `bg-primary-fixed text-on-primary-fixed` — "Working offline. Changes sync when you're back online." |

Never use a full-page spinner. Never use a modal for an error message.

---

## 11. Accessibility Rules

- All interactive elements: visible `focus:ring-2 focus:ring-primary focus:ring-offset-1` keyboard focus ring.
- Color is never the only indicator of status. Always pair a color with an icon or text label (the status badges already do this with the dot + text).
- Form inputs always have an associated `<label>` (even if visually hidden).
- All icon-only buttons: `aria-label` required.
- Tab order follows visual reading order (left to right, top to bottom).
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text and UI components (WCAG AA).
- The Focus Gate must be fully navigable by keyboard — a kid should be able to tab through the task list and reach "Open allowed sites" without a mouse.

---

## 12. Do / Don't Checklist

**Do:**
- ✅ Use `rounded-xl` for cards, `rounded-lg` for buttons, `rounded-full` for badges and avatars.
- ✅ Keep status badges small (`text-label-sm`) with a colored dot + text.
- ✅ Use `border border-outline-variant` instead of box-shadow on cards.
- ✅ Use `transition-colors` on every hoverable element.
- ✅ Match the sidebar active state: left border + filled icon + bold weight.
- ✅ Show a skeleton loader for any content that takes more than 200ms to load.
- ✅ Use the cream background `#FDFBF7` on all main canvas surfaces.

**Don't:**
- ❌ Don't use a bright red background for blocked-state screens — use `text-error` on the icon only.
- ❌ Don't add box-shadows to cards.
- ❌ Don't use `rounded-2xl` or larger — too soft for this product's identity.
- ❌ Don't use confetti, bouncing elements, or particle effects in the MVP.
- ❌ Don't hide completed tasks — strike them through and fade them instead.
- ❌ Don't use a modal dialog for simple confirmations — use inline confirmation (double-tap/click pattern) for destructive actions on cards.
- ❌ Don't use any color outside the token system without adding it to this skill first.
