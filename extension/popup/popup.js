const checkbox = document.querySelector('#focus');
const status = document.querySelector('#status');

async function load() {
  try {
    // The installed rule is authoritative if a previous write was interrupted.
    const rules = await chrome.declarativeNetRequest.getDynamicRules();
    checkbox.checked = rules.some((rule) => rule.id === 1001);
    status.textContent = checkbox.checked ? 'Gate active' : 'Gate off';
    checkbox.disabled = false;
  } catch {
    status.textContent = 'Could not read gate state. Reload the extension.';
  }
}

checkbox.addEventListener('change', async () => {
  checkbox.disabled = true;
  status.textContent = 'Applying…';
  let failure = false;
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'SET_FOCUS',
      enabled: checkbox.checked,
    });
    if (!response || response.error) throw new Error(response?.error ?? 'No response');
    status.textContent = response.enabled ? 'Gate active' : 'Gate off';
  } catch {
    failure = true;
  } finally {
    await load();
    if (failure) status.textContent = 'Change failed. Check extension errors.';
  }
});

void load();
