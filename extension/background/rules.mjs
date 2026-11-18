export const GATE_RULE_ID = 1001;

export function youtubeGateRule() {
  return {
    id: GATE_RULE_ID,
    priority: 1,
    action: {
      type: 'redirect',
      redirect: { extensionPath: '/pages/focus-gate.html' },
    },
    condition: {
      urlFilter: '||youtube.com^',
      resourceTypes: ['main_frame'],
    },
  };
}

// Update Chrome's persistent rules first, then record the desired state. If the
// update fails, the popup must not report that the new state was applied.
export async function setFocusMode(chromeApi, enabled) {
  if (typeof enabled !== 'boolean') throw new TypeError('enabled must be boolean');
  const existing = await chromeApi.declarativeNetRequest.getDynamicRules();
  await chromeApi.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.some((rule) => rule.id === GATE_RULE_ID)
      ? [GATE_RULE_ID]
      : [],
    addRules: enabled ? [youtubeGateRule()] : [],
  });
  await chromeApi.storage.local.set({ focusEnabled: enabled });
  return enabled;
}
