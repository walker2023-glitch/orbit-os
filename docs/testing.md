# Verification

## Automated

Run `node --test extension/tests/*.test.mjs`. These tests cover the rule's shape, repeated enable/disable, and state preservation if Chrome rejects a rule update. They mock the Chrome API and do **not** prove that a browser will redirect or allow navigation.

For the existing frontend, run `npm ci --prefix web`, `npm run build --prefix web`, and `npm run lint --prefix web`. The frontend currently requires a server for login and authenticated screens.

## Browser acceptance check (still required)

Use a separate test browser profile. Open `chrome://extensions`, turn on Developer mode, load the `extension/` folder unpacked, and check for extension errors. Open `https://www.youtube.com/` and `https://m.youtube.com/`; each should show the local Focus Gate. An unrelated site such as `https://www.google.com/` should still load. In the Orbit OS popup, turn the gate off, reload YouTube, and check it loads; turn it on, reload YouTube, and check the gate returns. Restart Chrome and confirm the gate is still active. Repeat on the intended Chromebook and record whether its managed profile permits the extension.

Do not claim the family MVP is validated from this check: tasks, authentication, offline expiration, and managed-device restrictions remain untested.
