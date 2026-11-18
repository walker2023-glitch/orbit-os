import { setFocusMode } from './rules.mjs';

async function reconcile() {
  const { focusEnabled = true } = await chrome.storage.local.get('focusEnabled');
  await setFocusMode(chrome, focusEnabled);
}

chrome.runtime.onInstalled.addListener(() => {
  void reconcile().catch((error) => console.error('Could not initialize gate:', error));
});

chrome.runtime.onStartup.addListener(() => {
  void reconcile().catch((error) => console.error('Could not restore gate:', error));
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'SET_FOCUS') return false;
  void setFocusMode(chrome, message.enabled)
    .then((enabled) => sendResponse({ enabled }))
    .catch((error) => sendResponse({ error: String(error) }));
  return true;
});
