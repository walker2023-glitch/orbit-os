# Current contract inventory

Everything below is **present in code**, unless marked `PLANNED`. Endpoint definitions currently have only frontend callers; no API implementation exists in this repository.

## Browser extension (`extension/`)

| Contract | Actual behavior |
| --- | --- |
| Manifest | MV3; `declarativeNetRequest` and `storage`; host permissions for `youtube.com` and its subdomains; `pages/focus-gate.html` and stylesheet exposed as web-accessible resources to those sites. |
| Dynamic rule 1001 | `||youtube.com^`, `main_frame`, priority 1, redirect to `/pages/focus-gate.html`; installed at initial install and restored at startup from desired state. No blocking of subresources or other domains. |
| `chrome.storage.local.focusEnabled` | Boolean; defaults to `true` on install/startup when absent. Written after Chrome accepts a dynamic rule update. The popup reads the actual installed rules to display status. |
| Runtime message | `{ type: 'SET_FOCUS', enabled: boolean }` from popup to worker. Response `{ enabled: boolean }` or `{ error: string }`. |
| Unimplemented | No device token, no child identity, no rule sync, no PIN, no audit log, no automatic task unlock. |

## Guardian frontend (`web/src/`)

| Caller | Required route(s); these are client expectations, not server routes |
| --- | --- |
| `lib/auth.tsx` | `GET /api/v1/auth/me`; `POST /api/v1/auth/login` and `/signup` return `{token}`. |
| `pages/DashboardPage.tsx` | `GET /api/v1/guardian/dashboard`; `PATCH /api/v1/guardian/settings`; `POST /api/v1/guardian/allowlist`; `DELETE /api/v1/guardian/allowlist/:id`. |
| `pages/TasksPage.tsx` | `GET, POST /api/v1/guardian/tasks`; `DELETE /api/v1/guardian/tasks/:id`; `GET, POST /api/v1/guardian/children`. |
| `pages/SettingsPage.tsx` | `GET, POST /api/v1/guardian/devices`; `GET, PUT /api/v1/guardian/unlock-rules`; `GET, PATCH /api/v1/guardian/settings`; `POST /api/v1/auth/bypass-pin`; `GET /api/v1/guardian/children`. |
| `pages/MiscPages.tsx` | `GET /api/v1/guardian/allowlist`, `/activity`, `/proof-inbox`; `POST /api/v1/guardian/proof/:id/approve` and `/reject`. |

The API client sends `Authorization: Bearer <orbit_token>` when a token is in localStorage. `VITE_API_URL` is the only current environment variable used by the frontend; `web/.env.example` sets `http://localhost:3001`. API shape details live in each caller's TypeScript types and request body. The list above is an inventory of calls, not a promise that the planned backend will keep every shape unchanged.

## PLANNED server and database

`orbitosMVPplan.md` contains a proposed schema and `/api/v1/device/rules` design. No server, migrations, PostgreSQL schema, storage bucket, deployment, or actual device authentication exist yet. Record the implemented request/response types here when the first server slice lands.
