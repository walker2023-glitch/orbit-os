# Orbit OS

Orbit OS is an early family Chromebook routine project. Its intended flow is: a parent creates daily tasks, a child sees why recreational browsing is gated, and completing the required tasks changes browser access. The [MVP plan](orbitosMVPplan.md) and [UI design reference](orbitosUIskill.md) describe the proposed product; they are not a list of finished features.

## What works in this repository

- `web/` contains a React/Vite Guardian interface. Its login and data screens expect an API at `/api/v1`, but this repository does **not** include that server or a database. You can build the frontend; you cannot complete a family signup or task flow from this repo alone.
- `extension/` contains a **local Chrome extension prototype**. It gates YouTube and shows a local Focus Gate. A popup lets the tester turn the gate on and off. It has no login, tasks, pairing, server sync, or protection against disabling the extension.
- `docs/` inventories what exists; `tasks/` tracks work. [T-002](tasks/T-002.md) outlines the next end-to-end slice.

## Try the extension prototype

1. Use a separate Chrome test profile. At `chrome://extensions`, enable **Developer mode**, select **Load unpacked**, and choose the `extension/` directory.
2. Open `https://www.youtube.com/`. You should see the Orbit OS Focus Gate. An unrelated site should work normally.
3. Use the Orbit OS toolbar popup to disable the gate; reload YouTube to confirm it works. Enable it and reload again.
4. Follow the [full browser acceptance check](docs/testing.md), including a restart and a check on the intended Chromebook. A managed school device may restrict extension installation.

This popup is a local test control accessible to anyone using the browser. **Do not use this version as parental enforcement.**

## Run the existing frontend

Node.js 24 is used by CI. From the repository root:

```sh
npm ci --prefix web
npm run dev --prefix web
```

`web/.env.example` sets `VITE_API_URL=http://localhost:3001`. The API it points to has not been implemented here. To run checks:

```sh
node --test extension/tests/*.test.mjs
npm run build --prefix web
npm run lint --prefix web
```

The [architecture](docs/architecture.md) and [contracts](docs/contracts.md) distinguish current code from the backend, child view, and policy decisions that remain to be built. Pull requests should keep those documents accurate.
