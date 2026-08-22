# 1.0 — Orbit OS MVP

> Implementation plan for the Orbit OS v1 family release. Covers the Focus Gatekeeper Chrome extension, Smart Board PWA, and Guardian Command admin panel as a single cohesive MVP.

## Project Tech Stack
- Frontend: React + Vite, /web/src/
- Backend: Node.js + Fastify, /server/src/
- Extension: MV3, /extension/
- Styles: Tailwind CSS (config in /web/tailwind.config.js)
- Database: Supabase (PostgreSQL)
---

## Metadata

| Field                | Value                                                      |
| -------------------- | ---------------------------------------------------------- |
| **Feature ID**       | 1.0                                                        |
| **Section**          | Core Product — MVP Release                                 |
| **Severity**         | BLOCKER                                                    |
| **Markets**          | Family / K12 (home deployment, eventually district-scale)  |
| **Status (today)**   | MISSING                                                    |
| **Estimated effort** | L (1–2 months solo dev)                                    |
| **Owner**            | Dallas (solo)                                              |
| **Depends on**       | None — this is the foundation                              |
| **Unblocks**         | 2.0 Streak & Gamification Vault, 3.0 AI Photo Proof       |

---

## 1. Problem Statement

School districts issue Chromebooks to students but only apply basic default policies that are not sufficient for most families' boundaries at home. Parents have no easy way to tie device access to the completion of daily routines and chores, leaving children free to use entertainment sites before homework or household responsibilities are done. Orbit OS fills that gap by gating recreational browsing behind a parent-configured checklist, giving families a simple, visible system that motivates kids through structure rather than conflict.

---

## 2. Goals

- A parent can configure a daily Must-Do task list that blocks recreational web access until complete.
- A kid sees exactly what tasks remain when they try to visit a blocked site — not just a generic "blocked" message.
- Completing all Must-Dos unlocks a parent-defined window of recreational access (time-based or token-based).
- The system works offline for at least 8 hours using cached rules.
- The MVP runs in a single-family workspace with one parent account and up to four child profiles.

---

## 3. Non-Goals

- Multi-tenant (school district / classroom) support — deferred to Phase 2.
- AI-powered photo verification — deferred to Phase 2 (manual parent approval is sufficient for MVP).
- Native Android or iOS apps — companion mobile access is web-only for MVP.
- Gamification Vault (streaks, tokens, badges) — deferred to Phase 2.
- ChromeOS-level kiosk mode or Google Workspace policy enforcement — MVP targets the Chrome extension layer only; managed-device hardening is Phase 3.

---

## 4. Personas & User Stories

- **As a parent**, I want to set a list of daily chores my child must complete before using YouTube, so that I don't have to enforce it myself every day.
- **As a parent**, I want to choose whether a task just needs a checkbox or needs me to approve a photo, so I can decide how much I trust my child for each task type.
- **As a parent**, I want to see a log of what sites were blocked and when, so I can spot patterns or verify the system is working.
- **As a child**, I want to see exactly which tasks I still need to finish when a site is blocked, so I know what to do to unlock access.
- **As a child**, I want to know whether a site is blocked because I haven't done my chores yet, or because the site is never allowed, so the message makes sense.
- **As a child**, I want tasks with a countdown timer (e.g., "Read for 20 minutes") to track my progress automatically, so I don't have to guess when I'm done.
- **As a parent**, I want an emergency bypass PIN I can type in front of my child for exceptions, without removing any settings permanently.

---

## 5. Functional Requirements

**Gatekeeper (Chrome Extension)**

- **FR-1.** The extension MUST intercept any navigation to a non-allowlisted domain during Focus Mode and redirect the tab to the Focus Gate page.
- **FR-2.** The Focus Gate page MUST display the remaining Must-Do tasks with their current completion status, synced from the backend (or local cache if offline).
- **FR-3.** The Focus Gate page MUST display two distinct messages: "Finish your tasks first" (tasks incomplete) vs. "This site isn't on your approved list" (tasks complete, site still blocked).
- **FR-4.** The extension MUST re-fetch and apply updated rules from the backend whenever the service worker wakes, and on a maximum 60-second polling interval.
- **FR-5.** The extension MUST cache the current rule set and task state in `chrome.storage.local` to enforce blocking for up to 8 hours without a server connection.
- **FR-6.** The extension MUST accept an admin bypass PIN entered on the Focus Gate page, log the bypass event to the backend, and grant a time-boxed unlock (duration set by parent, default 30 minutes).
- **FR-7.** The extension MUST use `declarativeNetRequest` with a default-deny (allowlist-only) rule set during Focus Mode. Every domain NOT on the parent's allowlist is blocked.
- **FR-8.** When a parent remotely approves a photo task, the extension MUST detect the state change within 60 seconds and update the Focus Gate accordingly.

**Smart Board (PWA — child-facing)**

- **FR-9.** The Smart Board MUST show today's task list grouped into Must-Do, Should-Do, and Optional sections with color-coded status (incomplete / in-progress / done).
- **FR-10.** Each task MUST display its proof type icon (checkbox, camera, timer, parent-key).
- **FR-11.** A timer-type task MUST display an in-app countdown that the child starts manually; the task is auto-marked complete when the timer reaches zero.
- **FR-12.** A photo-type task MUST allow the child to upload an image or video directly from the Smart Board, which immediately enters "pending approval" state.
- **FR-13.** The Smart Board MUST reflect task state changes made by the parent in Guardian Command within 60 seconds.

**Guardian Command (PWA — parent-facing)**

- **FR-14.** Guardian Command MUST be accessible only after parent login (email + password, JWT-based session).
- **FR-15.** A parent MUST be able to create, edit, and delete tasks, assigning each a proof type, deadline offset, and one or more children.
- **FR-16.** Proof type options MUST include: Checkbox Only, Timed (duration in minutes), Photo → Parent Approval, Photo → Auto-Approve After [N] minutes.
- **FR-17.** A parent MUST be able to set the allowlist (one domain per chip) from the Dashboard.
- **FR-18.** Guardian Command MUST display an Activity History table showing timestamp, site, duration, and Allowed / Blocked status for each child's Chromebook.
- **FR-19.** Guardian Command MUST display a Photo Approval inbox where the parent can Accept or Reject pending photo submissions, optionally leaving a text note.
- **FR-20.** A parent SHOULD be able to configure the bypass PIN in Settings.
- **FR-21.** A parent SHOULD be able to define the unlock rule: "Must-Dos complete → N minutes of recreational access" or "All tasks complete → full day unlock."

---

## 6. Non-Functional Requirements

- **Performance** — Focus Gate page MUST load in under 1 second from the cached local state. Backend API p95 response SHOULD be under 400ms.
- **Security** — All API routes are authenticated. Child accounts are read-only for rules and can only write task completions. Parent JWT tokens expire after 7 days. Bypass PIN is hashed server-side; never stored in plaintext.
- **Privacy & Compliance** — Photo proof images are stored in a private, family-scoped bucket. No image is shared outside the family workspace. Images auto-delete after 30 days. COPPA-aware: no email or PII is collected from child profiles (child accounts are created by the parent and identified by a display name and avatar only).
- **Accessibility** — WCAG 2.1 AA for all screens. Focus Gate MUST be keyboard-navigable. All interactive elements have visible focus rings and ARIA labels.
- **Scalability** — MVP is single-family; backend MUST be designed with a `familyId` namespace on every data entity so multi-tenant can be added in Phase 2 without a migration.
- **Reliability** — Extension enforces rules offline for 8 hours using `chrome.storage.local`. If the cache is older than 8 hours and the backend is unreachable, the extension MUST fail closed (Focus Mode stays active, no recreational access).
- **Observability** — Every block/allow event, bypass use, and task state change is written to an `audit_log` table with a UTC server timestamp (not the client clock).
- **Backward Compatibility** — Chrome extension updates MUST be backward-compatible with the cached rule schema. A version field on the schema enables graceful migration.

---

## 7. Acceptance Criteria

- **AC-1.** *Given* a child's Must-Do list has 3 tasks and 0 are complete, *when* they navigate to youtube.com, *then* they see the Focus Gate with "Finish your tasks first" and a list of all 3 remaining tasks.
- **AC-2.** *Given* all Must-Do tasks are complete, *when* they navigate to a non-allowlisted site, *then* they see "This site isn't on your approved list" (not the task list).
- **AC-3.** *Given* all Must-Do tasks are complete, *when* they navigate to classroom.google.com (on the allowlist), *then* the page loads normally with no interception.
- **AC-4.** *Given* the Chromebook has no internet connection, *when* the child tries to visit a blocked site, *then* the extension uses the cached rule set and enforces blocking correctly.
- **AC-5.** *Given* a task has proof type "Photo → Parent Approval" and the child uploads a photo, *when* the parent approves it in Guardian Command, *then* the task is marked complete on the Smart Board and the extension re-evaluates the unlock state within 60 seconds.
- **AC-6.** *Given* a task has proof type "Photo → Auto-Approve After 60 minutes" and no parent action is taken, *when* 60 minutes elapses, *then* the task is automatically marked complete.
- **AC-7.** *Given* the parent enters the bypass PIN on the Focus Gate, *when* the PIN matches, *then* a 30-minute (configurable) unlock is granted and the event is written to the audit log.
- **AC-8.** *Given* a timer task set to 20 minutes, *when* the child taps Start and the timer reaches zero, *then* the task is marked complete without any additional parent action.

---

## 8. Data Model

All tables are scoped by `family_id`. Timestamps are stored as UTC.

```sql
-- families
CREATE TABLE families (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- accounts (parents only — children are profiles, not auth accounts)
CREATE TABLE accounts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   UUID REFERENCES families(id) ON DELETE CASCADE,
  email       TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  bypass_pin_hash TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- child profiles (no login credentials)
CREATE TABLE child_profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   UUID REFERENCES families(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_seed  TEXT,          -- used to generate avatar deterministically
  color_hex    TEXT DEFAULT '#006c49'
);

-- devices (paired Chromebooks)
CREATE TABLE devices (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id    UUID REFERENCES families(id) ON DELETE CASCADE,
  child_id     UUID REFERENCES child_profiles(id),
  device_name  TEXT,
  extension_token TEXT UNIQUE NOT NULL,  -- secret the extension uses to authenticate
  last_seen_at TIMESTAMPTZ
);

-- tasks (templates / recurring definitions)
CREATE TABLE tasks (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id      UUID REFERENCES families(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  task_type      TEXT CHECK (task_type IN ('mustdo', 'shoulddo', 'optional')),
  proof_type     TEXT CHECK (proof_type IN ('checkbox', 'timer', 'photo_parent', 'photo_auto')),
  timer_minutes  INT,                           -- only for proof_type = timer
  auto_approve_after_minutes INT,               -- only for proof_type = photo_auto
  deadline_offset_minutes INT,                  -- minutes after day start (e.g. 480 = 8:00 AM)
  assigned_child_ids UUID[],
  recurrence     TEXT DEFAULT 'daily',          -- daily | weekday | weekend | custom
  active         BOOLEAN DEFAULT true
);

-- task instances (one per child per day)
CREATE TABLE task_instances (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id      UUID REFERENCES tasks(id),
  child_id     UUID REFERENCES child_profiles(id),
  family_id    UUID REFERENCES families(id),
  date         DATE NOT NULL,
  status       TEXT CHECK (status IN ('pending', 'in_progress', 'awaiting_approval', 'complete', 'rejected')) DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  proof_url    TEXT,                            -- S3/storage URL for photo/video proof
  parent_note  TEXT,
  UNIQUE (task_id, child_id, date)
);

-- allowlist (domains allowed during Focus Mode)
CREATE TABLE allowlist_rules (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id  UUID REFERENCES families(id) ON DELETE CASCADE,
  child_id   UUID REFERENCES child_profiles(id),  -- NULL = applies to all children
  domain     TEXT NOT NULL,
  added_at   TIMESTAMPTZ DEFAULT now()
);

-- unlock rules
CREATE TABLE unlock_rules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id       UUID REFERENCES families(id) ON DELETE CASCADE,
  child_id        UUID REFERENCES child_profiles(id),
  trigger_type    TEXT CHECK (trigger_type IN ('mustdo_complete', 'all_complete')),
  effect_type     TEXT CHECK (effect_type IN ('unlock_minutes', 'unlock_full_day')),
  effect_minutes  INT                           -- only for unlock_minutes
);

-- audit log (server-stamped, never trust client time)
CREATE TABLE audit_log (
  id         BIGSERIAL PRIMARY KEY,
  family_id  UUID REFERENCES families(id),
  child_id   UUID REFERENCES child_profiles(id),
  device_id  UUID REFERENCES devices(id),
  event_type TEXT NOT NULL,                     -- e.g. blocked, allowed, bypass_used, task_complete
  target     TEXT,                              -- URL or task ID
  metadata   JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Indexes:**
```sql
CREATE INDEX ON task_instances (child_id, date);
CREATE INDEX ON audit_log (family_id, created_at DESC);
CREATE INDEX ON allowlist_rules (family_id, child_id);
```

**Migrations:** Named `001_init.sql`, `002_*.sql`, etc. in `/server/migrations/`.

---

## 9. API Surface

All routes prefixed with `/api/v1`. Auth via `Authorization: Bearer <jwt>` for parent routes; `Authorization: Bearer <extension_token>` for extension routes.

### Extension-facing routes
```
GET  /api/v1/device/rules
  → { allowlist: string[], task_instances: TaskInstance[], unlock_rules: UnlockRule[], schema_version: number }
  Auth: extension_token
  Called on: wake, then every 60 seconds via chrome.alarms

POST /api/v1/device/events
  Body: { events: AuditEvent[] }   (batched block/allow events)
  Auth: extension_token
```

### Smart Board / child-facing routes (authenticated as parent, child_id scoped)
```
GET  /api/v1/tasks/today?child_id=
  → { tasks: TaskInstance[] }

POST /api/v1/tasks/:instanceId/complete
  Body: { proof_type: 'checkbox' | 'timer' }

POST /api/v1/tasks/:instanceId/proof
  Body: multipart/form-data (image or video file)
  → { status: 'awaiting_approval' | 'complete', proof_url: string }
```

### Guardian Command routes (parent JWT required)
```
GET    /api/v1/guardian/dashboard?child_id=&date=
POST   /api/v1/guardian/tasks              (create task)
PATCH  /api/v1/guardian/tasks/:id          (edit task)
DELETE /api/v1/guardian/tasks/:id

GET    /api/v1/guardian/activity?child_id=&from=&to=
GET    /api/v1/guardian/proof-inbox?child_id=
POST   /api/v1/guardian/proof/:instanceId/approve  Body: { note?: string }
POST   /api/v1/guardian/proof/:instanceId/reject   Body: { note: string }

GET    /api/v1/guardian/allowlist
POST   /api/v1/guardian/allowlist          Body: { domain: string, child_id?: string }
DELETE /api/v1/guardian/allowlist/:id

GET    /api/v1/guardian/unlock-rules
PUT    /api/v1/guardian/unlock-rules       Body: UnlockRule[]

POST   /api/v1/auth/login                 Body: { email, password } → { token }
POST   /api/v1/auth/verify-pin            Body: { device_id, pin } → { granted: bool, unlock_until: ISO8601 }
```

**WebSocket (optional for MVP, polling fallback acceptable):** `/ws/family/:familyId` — pushes `task_state_changed` events so the Smart Board and extension update in near-real-time without waiting for the 60-second poll.

---

## 10. UI / UX

### Design System

The Orbit OS UI uses a consistent design language across all surfaces. Every component follows the token system below.

**Color Tokens**

| Token                      | Hex       | Usage                                           |
| -------------------------- | --------- | ----------------------------------------------- |
| `--color-primary`          | `#182232` | Sidebar background, primary text on light       |
| `--color-primary-container`| `#2d3748` | Sidebar hover states, elevated primary surfaces |
| `--color-secondary`        | `#006c49` | CTA buttons, active indicators, toggles         |
| `--color-secondary-fixed`  | `#6ffbbe` | Chip/badge text for allowed items               |
| `--color-background`       | `#FDFBF7` | Main canvas background (soft paper cream)       |
| `--color-surface`          | `#fbf9f5` | Card backgrounds, table headers                 |
| `--color-surface-low`      | `#f5f3ef` | Table striping, input fields                    |
| `--color-on-surface`       | `#1b1c1a` | Body text                                       |
| `--color-on-surface-var`   | `#45474c` | Secondary text, placeholders                    |
| `--color-outline`          | `#75777d` | Borders, dividers                               |
| `--color-outline-variant`  | `#c5c6cd` | Subtle borders, disabled states                 |
| `--color-error`            | `#ba1a1a` | Blocked status badges, error states             |
| `--color-error-container`  | `#ffdad6` | Blocked status badge backgrounds                |

**Typography — all Inter**

| Role            | Size  | Weight | Line Height |
| --------------- | ----- | ------ | ----------- |
| Display         | 32px  | 700    | 40px        |
| Headline MD     | 24px  | 600    | 32px        |
| Headline SM     | 20px  | 600    | 28px        |
| Title LG        | 18px  | 600    | 24px        |
| Body LG         | 16px  | 400    | 24px        |
| Body MD         | 14px  | 400    | 20px        |
| Label MD        | 12px  | 600    | 16px        |

**Border Radius**

| Scale     | Value   | Usage                        |
| --------- | ------- | ---------------------------- |
| `DEFAULT` | 2px     | Input fields, table cells    |
| `lg`      | 4px     | Buttons, small chips         |
| `xl`      | 8px     | Cards, modals                |
| `full`    | 12px    | Status badges, avatar chips  |

**Spacing Scale:** 4px base unit. Common: xs=8px, sm=12px, md=16px, lg=24px, xl=32px.

**Icons:** Material Symbols Outlined, 24px, wght=400, FILL=0 by default. Filled variant used only for active/selected states.

---

### Screen Inventory

#### Screen 1: Guardian Command — Dashboard

The primary admin view. Fixed sidebar nav on the left, scrollable main canvas on the right.

**Layout:**
```
┌───────────────────────────────────────────────────────────────┐
│ SIDEBAR (260px, bg: #182232)    │ TOP BAR (64px, bg: surface)  │
│                                 │  [Search ___________] [🔔][?] [Save] [Avatar] │
│  Orbit OS                       ├─────────────────────────────────────────────  │
│  The Calm Administrator         │                                               │
│  ─────────────────              │  MAIN CANVAS (bg: #FDFBF7, scrollable)       │
│  ● Dashboard          ←active   │                                               │
│  ○ Allowlist Rules              │  ┌────────────────────────────────────┐       │
│  ○ Activity History             │  │ Focus Mode Allowlist     [Toggle]   │       │
│  ○ Settings                     │  │ [🌐 Add website...   ] [+ Add]     │       │
│  ─────────────────              │  │ [Google Classroom ×] [Canvas ×]    │       │
│  [+ Add New Device]             │  │ [Wikipedia ×] [Khan Academy ×]     │       │
│  Logout                         │  └────────────────────────────────────┘       │
│                                 │                                               │
│                                 │  ┌────────────────────────────────────┐       │
│                                 │  │ Activity History                    │       │
│                                 │  │ Timestamp │ Site │ URL │ Duration │ Status │
│                                 │  │ ...       │ ...  │ ... │ ...      │ ●●●    │
│                                 │  └────────────────────────────────────┘       │
└───────────────────────────────────────────────────────────────┘
```

**Components:**
- **Sidebar:** Fixed left column, `#182232` background. Logo at top. Nav links with icon + label; active link has a left border-l-4 in `--color-secondary-fixed` and lighter background. "Add New Device" CTA button in `--color-secondary` at bottom. Logout below divider.
- **Top Bar:** White/surface background, bottom border in `--color-outline-variant`. Search bar with globe icon (desktop only). Notification bell, help icon, Save Changes button (desktop only), avatar circle.
- **Focus Mode Allowlist Card:** White card, `--border-outline-variant` 1px border, `rounded-xl`. Headline MD title, Body MD description. Input field with globe icon prefix. "+ Add" outlined button. Chips in `--color-secondary-fixed/20` background, `--color-secondary` border.
- **Activity History Table:** White card, thead in `#F8FAFC`, rows divided by subtle border. Allowed badge: green background, green dot. Blocked badge: red/error background, red dot.
- **Toggle:** Custom pill toggle, `#006c49` when checked.

**States to design:**
- Empty allowlist (0 chips) → "No sites added yet. Add your first educational site above."
- Empty activity history → "No activity yet for this child today."
- Focus Mode disabled (toggle off) → entire allowlist section dims to 50% opacity with a "Focus Mode is off" label.

---

#### Screen 2: Guardian Command — Task Manager

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Task Manager for: [Ava ▼]        [+ New Task]  [Template ▼]│
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │  MUST-DO (2)      │  │  SHOULD-DO (1)    │  │ OPTIONAL   │ │
│  │ ─────────────── │  │ ─────────────── │  │ (0)        │ │
│  │ ☐ Make bed       │  │ ☐ Tidy desk      │  │            │ │
│  │   checkbox · 8AM │  │   checkbox · 5PM │  │  + Add     │ │
│  │   [Edit] [×]     │  │   [Edit] [×]     │  │            │ │
│  │                  │  │                  │  │            │ │
│  │ ☐ Read 20 min   │  └──────────────────┘  └────────────┘ │
│  │   timer · 8AM    │                                       │
│  │   [Edit] [×]     │                                       │
│  │                  │                                       │
│  │ + Add task        │                                       │
│  └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
```

**Task Card (within column):**
- Title in Title LG, proof type icon (checkbox / timer / camera / key) + label in Label MD below.
- Deadline offset displayed as "by 8:00 AM."
- Edit button (outlined, xs) and delete (icon-only, text-on-surface-variant).
- Color-coded left border: red for Must-Do, amber for Should-Do, blue-grey for Optional.

**Task Edit Drawer (right-side panel):**
```
┌──────────────────────────────────┐
│  Edit Task                  [×]  │
│  ──────────────────────────────  │
│  Title: [Make bed          ]     │
│  Type:  ● Must-Do ○ Should ○ Opt │
│  Proof: ○ Checkbox               │
│         ○ Timer [__ min]         │
│         ○ Photo → Parent approval│
│         ○ Photo → Auto-approve   │
│             after [__] minutes   │
│  Deadline: [8] : [00] [AM]       │
│  Days: [M] [T] [W] [T] [F] [S][S]│
│  Assign to: [Ava ✓] [Sam ✓]      │
│                                  │
│  [Cancel]             [Save Task]│
└──────────────────────────────────┘
```

---

#### Screen 3: Smart Board — Child Task View

Designed for a shared wall tablet or the child's Chromebook tab. Touch-first, large targets.

**Layout:**
```
┌───────────────────────────────────────────────────────┐
│  👋 Good morning, Ava          Tuesday, Aug 21 · 8:02  │
│  ───────────────────────────────────────────────────── │
│  🔥 Streak: 12 days            🔒 Focus Mode active     │
│  ───────────────────────────────────────────────────── │
│                                                       │
│  MUST-DO                              1 of 3 done     │
│  ┌───────────────────────────────────────────────┐    │
│  │ ✓ Feed the dog                     ✓ Done     │    │
│  ├───────────────────────────────────────────────┤    │
│  │ ☐ Make bed                       [ Mark Done ]│    │
│  ├───────────────────────────────────────────────┤    │
│  │ ☐ Read 20 minutes           [ ▶ Start Timer ] │    │
│  │   ████████░░░░░░░░ 12:34 left                 │    │
│  └───────────────────────────────────────────────┘    │
│                                                       │
│  SHOULD-DO                                            │
│  ┌───────────────────────────────────────────────┐    │
│  │ ☐ Tidy desk                      [ Mark Done ]│    │
│  └───────────────────────────────────────────────┘    │
│                                                       │
└───────────────────────────────────────────────────────┘
```

**Task Row variants:**
- **Checkbox:** Large 44px tap target, strikes through title on completion.
- **Timer:** "Start Timer" CTA. When active: shows progress bar + time remaining. On complete: auto-marks done.
- **Photo:** "Upload Photo" button opens native file picker. On submit: row shows "⏳ Waiting for parent approval" with pulsing indicator.

---

#### Screen 4: Focus Gate — Chrome Extension Intercept Page

Full-tab replacement when a blocked domain is intercepted.

**Layout (tasks incomplete):**
```
┌──────────────────────────────────────────────────┐
│                                                    │
│              🔒  Focus Time                        │
│          Ava — Tuesday, Aug 21                     │
│                                                    │
│  Finish these to unlock free time:                 │
│                                                    │
│  ☑  Feed the dog                                   │
│  ☐  Make bed                                       │
│  ☐  Read 20 minutes                                │
│                                                    │
│  ▓▓▓▓▓░░░░░░░░░░░░  1 of 3 done                   │
│                                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │  Open allowed sites ▼                        │  │
│  │  [Google Classroom] [Canvas] [Khan Academy]  │  │
│  └─────────────────────────────────────────────┘  │
│                                                    │
│  Ask parent for access →        PIN: · · · ·       │
│                                                    │
└──────────────────────────────────────────────────┘
```

**Layout (tasks done, site not on allowlist):**
```
┌──────────────────────────────────────────────────┐
│                                                    │
│              ⛔  Not on Approved List               │
│          Ava — Tuesday, Aug 21                     │
│                                                    │
│  Your chores are all done — nice work!             │
│  But this site isn't on your approved list.        │
│  Ask your parent if you need access.               │
│                                                    │
│  [← Go back]          [Open allowed sites ▼]      │
│                                                    │
│  PIN: · · · ·                                      │
│                                                    │
└──────────────────────────────────────────────────┘
```

**Design notes:**
- Background: `#FDFBF7` (matches dashboard, not harsh). No red background for the locked state — only the icon and badge carry the status color.
- PIN field: small, low-emphasis, always present but never the first thing the eye lands on.
- "Open allowed sites" expands to show chip-style links to every whitelisted domain.
- Completed tasks get a checkmark and fade to 60% opacity; they don't disappear.
- Progress bar fills in `--color-secondary` (#006c49).

---

#### Screen 5: Guardian Command — Proof Inbox

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  Photo Approval Inbox           [3 Pending]          │
│  ─────────────────────────────────────────────────── │
│  ┌──────────────────────────────────────────────┐   │
│  │ Ava · Make bed · Today 8:04 AM               │   │
│  │ ┌──────────┐  "Looks done to me."            │   │
│  │ │  [photo]  │                                │   │
│  │ └──────────┘  [Note for Ava: _________ ]     │   │
│  │               [✓ Approve]   [✗ Reject]       │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │ Ava · Clean room · Today 7:55 AM             │   │
│  │ ...                                          │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

### Loading, Error, and Empty States

Every screen has three non-happy-path states defined:

| State   | Behavior                                                                                     |
| ------- | -------------------------------------------------------------------------------------------- |
| Loading | Skeleton shimmer cards in the same shape as the loaded content. No spinner overlays.         |
| Error   | Inline error bar below the header: "Couldn't load tasks — [Retry]". Never a full-page error. |
| Empty   | Illustrated empty state with one-line label and a clear CTA ("Add your first task →").      |
| Offline | Extension: uses cached rules silently. Smart Board: banner at top: "Working offline — changes will sync when you're back online." |

---

### Responsive Behaviour

- **Sidebar:** Collapses to a bottom tab bar on screens narrower than 768px.
- **Task Manager columns:** Stacks vertically below 900px (Must-Do on top, others below).
- **Activity History table:** URL column hidden on mobile (`hidden md:table-cell`).
- **Focus Gate:** Full-viewport, single column on all screen sizes. Minimum touch target 44×44px.
- **Smart Board:** Designed mobile-first, scales to fill a wall display (32"+ TV) with larger type and bigger tap targets.

---

## 11. AI / ML Considerations

Deferred to Phase 2. The Photo → Auto-Approve flow in MVP uses only a timeout (no image analysis). The MVP "AI" is simply: "If a photo was submitted and N minutes passed without parent action, approve it."

---

## 12. Integration Points

- **Google Calendar (Phase 2):** Not in MVP. Tasks are created manually.
- **Chrome Extensions API (MV3):** `chrome.declarativeNetRequest`, `chrome.storage.local`, `chrome.alarms`, `chrome.identity`, `chrome.tabs`, `chrome.runtime`.
- **Storage for photo proof:** AWS S3 or Supabase Storage. Pre-signed upload URLs generated server-side; the client uploads directly. Server never proxies the file.
- **Backend framework:** Node.js + Fastify (or Express), PostgreSQL, JWT via `jsonwebtoken`. Supabase is an acceptable all-in-one for MVP (auth + DB + storage + realtime subscriptions).

---

## 13. Dependencies & Sequencing

- Must ship first (Phase 1 — this document):
  1. Backend API + database schema
  2. Guardian Command PWA (parent can create tasks and set allowlist)
  3. Chrome Extension (enforces rules, shows Focus Gate)
  4. Smart Board PWA (child checks off tasks)
- Must ship after this:
  - 2.0 Streak & Gamification Vault (needs a stable task completion event stream)
  - 3.0 AI Photo Verification (needs the photo proof pipeline from FR-15/16)

**Shared infra needed:**
- PostgreSQL instance (Supabase free tier sufficient for MVP)
- S3-compatible object storage for photo proof
- A deployed backend (Railway, Render, or self-hosted Proxmox VPS — well within Dallas's skill set)

---

## 14. Risks & Mitigations

| Risk                                                         | Likelihood | Impact | Mitigation                                                                              |
| ------------------------------------------------------------ | ---------- | ------ | --------------------------------------------------------------------------------------- |
| `declarativeNetRequest` rule count ceiling hit               | M          | H      | Audit allowlist size early; test with 50+ domains. Wildcard rules reduce count.        |
| MV3 service worker dying mid-session breaks enforcement      | L          | M      | Enforcement is rule-based, not worker-based. Rules persist in `chrome.storage.local`.  |
| Child opens a Linux/Android app to bypass Chrome blocking    | M          | H      | Document this as a known MVP limitation; Phase 3 adds managed-device policy layer.     |
| Parent is slow to approve photos, child is locked out unfairly | H         | M      | Default proof type is "Photo → Auto-Approve After 60 min." Parent opt-in to stricter. |
| Clock manipulation bypasses deadline validation              | M          | M      | All timestamps written server-side on receipt. Client-provided time is ignored.         |
| Photo storage costs grow unexpectedly                        | L          | L      | 30-day auto-delete. Supabase free tier: 1 GB. More than sufficient for family MVP.     |
| Solo dev underestimates MV3 extension complexity             | H          | H      | Build and test the extension's block/allow cycle first, before any UI work.             |

---

## 15. Rollout Plan

**MVP is not feature-flagged** — it ships as a private build for one family.

1. **Schema migration** (`001_init.sql`) runs on first deploy.
2. **Extension** loaded as an unpacked extension (Developer Mode) for initial testing on Dallas's family's Chromebook.
3. **Smart Board PWA** deployed to a Vercel/Railway URL, bookmarked/pinned on the wall tablet.
4. **Guardian Command** accessible at the same URL under `/admin`, behind parent login.
5. **GA criteria:** All 8 acceptance criteria pass for at least 7 consecutive days in real household use.
6. **Rollback:** Extension can be disabled from the parent account in Guardian Command, which sets the cached rules to "allow all" on the next sync.

---

## 16. Test Plan

- **Unit:** Task state machine (pending → in_progress → awaiting_approval → complete), unlock rule evaluation logic, bypass PIN hashing/verification.
- **Integration:** API routes for task completion, proof submission, parent approval, rule fetch. Postgres constraint validation.
- **End-to-end:** Playwright — happy path (complete all tasks, access unlocks), photo proof flow (submit → approve → unlock), bypass PIN flow.
- **Security:** Verify child cannot call parent-only API routes (authz). Verify extension_token cannot access parent routes. Verify proof images are not publicly accessible without a signed URL.
- **Manual red-team checklist:**
  - [ ] Open Incognito — is the extension active? (MVP: document if not; Phase 3 fix.)
  - [ ] Change system clock — does the server reject the completion timestamp?
  - [ ] Disable extension in `chrome://extensions` — is it re-enabled on reload? (Only if managed; MVP: document gap.)
  - [ ] Navigate to `chrome://extensions` — is the attempt logged in audit_log?
  - [ ] Submit a blank photo — does the backend reject it?
  - [ ] Try bypass PIN 10 times wrong — is there a lockout?

---

## 17. Documentation & Training

- **Parent onboarding guide** (`docs/parent-guide.md`): How to create tasks, set the allowlist, pair a Chromebook, and use the bypass PIN.
- **Child onboarding guide** (printed, one page): What Focus Mode means, what to do when a site is blocked, how to submit photo proof.
- **README** (`README.md`): Developer setup, environment variables, local dev with Docker Compose, extension loading instructions.
- **Architecture overview** (`docs/architecture.md`): Data flow diagram, extension lifecycle, sync mechanism.

---

## 18. Open Questions

1. Should the Smart Board auto-detect which child is using it (e.g., by requiring a tap on their avatar), or does it always show a combined family view?
2. Should bypass PIN attempts be rate-limited (e.g., 5 attempts then 10-minute lockout) to prevent brute-forcing?
3. What is the day-rollover time? (Midnight? 3 AM? 5 AM?) Task instances need to be created for the new day at some point.
4. Should the child receive any in-app notification when a parent approves or rejects their photo proof, or is the status change on the Smart Board sufficient?
5. For the "timer" proof type, does leaving the Smart Board tab close the timer (losing progress), or does the timer run server-side?

---

## 19. References

- [Mozilla Web Docs — declarativeNetRequest](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest)
- [Chrome for Developers — MV3 service worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)
- [Supabase Docs — Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- Previous spec: `harness-calendar-product-spec.md`
- Related plans: `orbit-os-ui-skill.md`, `README.md`
