import assert from 'node:assert/strict';
import test from 'node:test';
import { GATE_RULE_ID, setFocusMode, youtubeGateRule } from '../background/rules.mjs';

function fakeChrome(initial = []) {
  let rules = initial;
  let saved = {};
  return {
    declarativeNetRequest: {
      async getDynamicRules() { return rules; },
      async updateDynamicRules({ removeRuleIds, addRules }) {
        rules = rules.filter((rule) => !removeRuleIds.includes(rule.id)).concat(addRules);
      },
    },
    storage: { local: { async set(value) { saved = { ...saved, ...value }; } } },
    state() { return { rules, saved }; },
  };
}

test('rule redirects only top-level navigation to the local gate', () => {
  assert.deepEqual(youtubeGateRule(), {
    id: GATE_RULE_ID,
    priority: 1,
    action: { type: 'redirect', redirect: { extensionPath: '/pages/focus-gate.html' } },
    condition: { urlFilter: '||youtube.com^', resourceTypes: ['main_frame'] },
  });
});

test('enabling twice preserves one rule; disabling removes it', async () => {
  const unrelated = { id: 2002, action: { type: 'block' } };
  const chrome = fakeChrome([unrelated]);
  await setFocusMode(chrome, true);
  await setFocusMode(chrome, true);
  assert.equal(chrome.state().rules.length, 2);
  await setFocusMode(chrome, false);
  assert.deepEqual(chrome.state(), { rules: [unrelated], saved: { focusEnabled: false } });
});

test('failed Chrome update leaves persisted desired state untouched', async () => {
  const chrome = fakeChrome();
  chrome.declarativeNetRequest.updateDynamicRules = async () => {
    throw new Error('Chrome refused rules');
  };
  await assert.rejects(setFocusMode(chrome, true), /Chrome refused rules/);
  assert.deepEqual(chrome.state().saved, {});
});
