# Architecture and boundaries

## Exists in this repository

- `web/`: React, TypeScript, Vite Guardian pages. They call `/api/v1` routes through `web/src/lib/api.ts`; the server those calls require is not in this repository yet. Login stores its parent JWT in browser localStorage. This is a current implementation fact, not an endorsement for use on a child's browser.
- `extension/`: a local Manifest V3 proof of concept. It redirects main-frame navigation to `youtube.com` and subdomains to a local Focus Gate using a persistent Chrome dynamic rule. Its popup turns the gate on/off without authentication; it has no server, tasks, pairing, or offline family rule sync. The service worker reconciles the persisted desired state on install and startup.
- There is no `server/`, migration, child Smart Board, deployed API, or end-to-end family flow in this repository.

## Planned integration, not implemented

Parent dashboard → authenticated family API → database → scoped device rules endpoint → extension. Child Smart Board → limited child-scoped API → task state → device rules endpoint. Parent approval and photo proof are later slices. Design the API and credentials so the extension cannot access parent routes and a child browser never holds a parent token.

## Decisions to resolve before the family rollout

1. Specify what changes when Must-Dos are complete: unrestricted browsing, a time-limited unlock, or a separate permanent denylist. The MVP plan currently mixes these states.
2. Choose a child-scoped credential and pairing flow, day rollover/time zone, and what happens on expired offline rules. Test the intended school-managed Chromebook before promising installability.
3. Keep this proof of concept limited to a test profile until parental controls, abuse resistance, and recovery are designed and verified.
