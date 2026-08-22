# Orbit OS

**A family-first Chromebook productivity harness.**

Orbit OS ties Chromebook recreational access to daily routine completion. Kids finish their chores, the sites unlock — automatically, without a parent having to enforce it every morning. Parents set the rules once through a clean web dashboard, and the Chrome extension handles the rest.

Built as an MVP for one family. Designed to expand.

---

## What it does

When a kid opens their Chromebook, they can use educational sites (Google Classroom, Khan Academy, whatever the parent adds) immediately. If they try to visit YouTube, Discord, or any other recreational site before their tasks are done, they see a **Focus Gate** — a clean page listing exactly which tasks remain.

Once the tasks are done, the gate opens automatically. The parent doesn't have to lift a finger.

**Key behaviors:**
- Blocks non-allowlisted sites during Focus Mode via Chrome's `declarativeNetRequest` API.
- Parent-configurable allowlist (any domain the parent adds is always available).
- Tasks can require a simple checkbox, a countdown timer, a photo the parent approves, or a photo that auto-approves after a timeout if the parent doesn't review it.
- Different blocked-site messages for "finish your tasks" vs. "this site is never allowed."
- Emergency bypass PIN for parents to grant temporary access.
- Full activity log in the Guardian Command dashboard.
- Works offline for up to 8 hours using cached rules.

---

## Project Structure

```
orbit-os/
│
├── extension/              # Chrome Extension (Manifest V3)
│   ├── manifest.json
│   ├── background/
│   │   └── service-worker.js   # Rule sync, alarm polling, bypass PIN logic
│   ├── rules/
│   │   └── ruleset.json        # Static declarativeNetRequest base rules
│   ├── pages/
│   │   └── focus-gate/         # The blocked-site intercept page
│   └── icons/
│
├── web/                    # PWA (React + Vite or Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── board/          # Smart Board (child task view)
│   │   │   ├── guardian/       # Guardian Command (parent admin)
│   │   │   └── auth/           # Login page
│   │   ├── components/         # Shared UI components
│   │   ├── lib/                # API client, hooks, state
│   │   └── styles/             # Tailwind config, global CSS
│   └── public/
│
├── server/                 # Backend API (Node.js + Fastify)
│   ├── src/
│   │   ├── routes/             # REST API routes
│   │   ├── middleware/         # Auth, rate limiting
│   │   ├── services/           # Business logic (task state, unlock rules, etc.)
│   │   └── jobs/               # Scheduled jobs (day rollover, auto-approve)
│   └── migrations/             # SQL migration files (001_init.sql, ...)
│
└── docs/
    ├── architecture.md         # Data flow, extension lifecycle
    ├── parent-guide.md         # How-to for parents
    └── plan/
        └── orbit-os-mvp-plan.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Chrome Extension | Manifest V3, `declarativeNetRequest`, `chrome.storage.local`, `chrome.alarms` |
| Frontend PWA | React + Vite (or Next.js), Tailwind CSS, Inter font, Material Symbols |
| Backend API | Node.js + Fastify (or Express), JWT auth |
| Database | PostgreSQL (Supabase free tier for MVP) |
| File Storage | Supabase Storage or AWS S3 (photo proof) |
| Hosting | Vercel (frontend), Railway or Render (backend), or self-hosted on Proxmox VPS |
| Realtime (optional) | Supabase Realtime subscriptions, or polling every 60 seconds |

---

## Getting Started (Development)

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or a [Supabase](https://supabase.com) project)
- A Chromium-based browser for loading the extension unpacked

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/orbit-os.git
cd orbit-os
```

### 2. Set up environment variables

Copy the example files and fill in your values:

```bash
cp server/.env.example server/.env
cp web/.env.example web/.env
```

**`server/.env`:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/orbitos
JWT_SECRET=your-secret-here
BYPASS_PIN_PEPPER=another-secret-here
STORAGE_BUCKET_URL=https://your-supabase-url.supabase.co/storage/v1
STORAGE_SERVICE_KEY=your-supabase-service-key
```

**`web/.env`:**
```
VITE_API_URL=http://localhost:3001
```

### 3. Run database migrations

```bash
cd server
npm install
npm run migrate
```

This runs all files in `server/migrations/` in order.

### 4. Start the backend

```bash
npm run dev
# Server runs on http://localhost:3001
```

### 5. Start the frontend

```bash
cd ../web
npm install
npm run dev
# App runs on http://localhost:5173
```

### 6. Load the Chrome extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder

The extension icon will appear in your toolbar. On first load, it will check `localStorage` for a paired device token. Until you pair a device from Guardian Command, it runs in "allow all" mode.

### 7. Create your first family account

1. Navigate to `http://localhost:5173/auth/signup`
2. Create a parent account
3. Add a child profile
4. Create your first tasks in Guardian Command (`/guardian/tasks`)
5. Pair your Chromebook: Guardian Command → Add New Device → copy the device token into the extension popup

---

## How the Extension Works

The extension does not run as a persistent background process. Chrome terminates the service worker after ~30 seconds of inactivity. This is normal MV3 behavior.

**Rule enforcement never relies on the worker being alive.** Instead:

1. When the worker runs (on install, on alarm, or when a tab navigates), it fetches the current rule set from the server and writes it to `chrome.storage.local`.
2. The `declarativeNetRequest` engine uses those stored rules to block or allow requests. This runs independently of the worker.
3. `chrome.alarms` wakes the worker every 60 seconds to re-sync rules from the server.

**What happens offline:**
- The last-synced rule set stays in `chrome.storage.local` and keeps enforcing.
- After 8 hours without a sync, the extension fails closed (Focus Mode stays active, no recreational access).
- All block/allow events are queued locally and flushed to the server when connectivity resumes.

**Default-deny allowlist approach:**
The extension uses a default-deny posture during Focus Mode. One ruleset blocks everything (`*`), and individual rules allow each domain on the parent's allowlist. When Focus Mode is off (tasks complete, or an active unlock window), the blocking rules are removed entirely.

---

## Deployment

### Backend (self-hosted Proxmox / VPS)

```bash
cd server
npm run build
npm run start
# Or use PM2:
pm2 start dist/index.js --name orbit-os-server
```

Serve behind Nginx with HTTPS (Let's Encrypt via Certbot).

### Frontend (Vercel)

```bash
cd web
vercel deploy
```

Set `VITE_API_URL` to your deployed server URL in Vercel's environment settings.

### Extension (distribution)

For family use: load unpacked (see setup step 6). No Chrome Web Store publish needed.

For wider distribution (Phase 2+): submit to Chrome Web Store with the paid developer account ($5 one-time).

---

## Open Questions (tracked in MVP Plan)

1. What time does the day roll over? (Midnight? 5 AM?)
2. Does the timer-type task pause if the Smart Board tab is closed?
3. Should bypass PIN attempts be rate-limited?
4. Should the Smart Board require a tap on an avatar to identify which child is using it?
5. Should kids get an in-app notification when their photo is approved or rejected?

See [`docs/plan/orbit-os-mvp-plan.md`](docs/plan/orbit-os-mvp-plan.md) §18 for full details.

---

## Known MVP Limitations

| Limitation | Status |
|---|---|
| Extension does not enforce in Incognito (unless manually granted) | Known, documented. Phase 3 fix via managed device policy. |
| Linux (Crostini) and Android apps bypass Chrome blocking entirely | Known, documented. Disable via `VirtualMachinesAllowed`/`ArcEnabled` policy in Phase 3. |
| Extension can be disabled in `chrome://extensions` on unmanaged devices | Known. Phase 3: force-install via Google Workspace `ExtensionInstallForcelist`. |
| No Google Calendar sync | Deferred to Phase 2. Tasks are created manually. |
| No gamification (streaks, tokens, badges) | Deferred to Phase 2. |
| No AI photo verification | Deferred to Phase 2. |

---

## Design System

All UI follows the Orbit OS design system. Before editing any UI component, read:

📄 [`docs/orbit-os-ui-skill.md`](docs/orbit-os-ui-skill.md)

Key points:
- Color palette: dark navy primary (`#182232`), green secondary (`#006c49`), soft cream background (`#FDFBF7`).
- Typography: Inter, all weights, across all surfaces.
- Border radius: `rounded-xl` for cards, `rounded-lg` for buttons, `rounded-full` for badges.
- Icons: Material Symbols Outlined exclusively.
- No box-shadows on cards. No red backgrounds for blocked states. No confetti in the MVP.

---

## License

Private — for personal/family use. License TBD if the project expands.

---

## Built by

Dallas — CS student, homelab builder, and oldest sibling who just wanted a better morning routine system for the house.
