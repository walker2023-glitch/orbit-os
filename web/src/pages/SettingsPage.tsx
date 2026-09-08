import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';

interface Child {
  id: string;
  display_name: string;
}

interface Device {
  id: string;
  device_name: string;
  child_id: string | null;
  child_name: string | null;
  extension_token?: string;
  last_seen_at: string | null;
}

interface UnlockRule {
  id?: string;
  trigger_type: 'mustdo_complete' | 'all_complete';
  effect_type: 'unlock_minutes' | 'unlock_full_day';
  effect_minutes: number | null;
}

export function SettingsPage() {
  const [params] = useSearchParams();
  const showDeviceHighlight = params.get('device') === '1';
  const [children, setChildren] = useState<Child[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceName, setDeviceName] = useState('Chromebook');
  const [childId, setChildId] = useState('');
  const [newToken, setNewToken] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');
  const [triggerType, setTriggerType] = useState<'mustdo_complete' | 'all_complete'>(
    'mustdo_complete',
  );
  const [effectType, setEffectType] = useState<'unlock_minutes' | 'unlock_full_day'>(
    'unlock_minutes',
  );
  const [effectMinutes, setEffectMinutes] = useState(60);
  const [bypassMinutes, setBypassMinutes] = useState(30);

  async function load() {
    const [c, d, rules, dash] = await Promise.all([
      api<{ children: Child[] }>('/api/v1/guardian/children'),
      api<{ devices: Device[] }>('/api/v1/guardian/devices'),
      api<{ rules: UnlockRule[] }>('/api/v1/guardian/unlock-rules'),
      api<{
        settings: { bypass_unlock_minutes: number };
      }>('/api/v1/guardian/dashboard'),
    ]);
    setChildren(c.children);
    setDevices(d.devices);
    setBypassMinutes(dash.settings.bypass_unlock_minutes ?? 30);
    if (rules.rules[0]) {
      setTriggerType(rules.rules[0].trigger_type);
      setEffectType(rules.rules[0].effect_type);
      if (rules.rules[0].effect_minutes) {
        setEffectMinutes(rules.rules[0].effect_minutes);
      }
    }
    if (!childId && c.children[0]) setChildId(c.children[0].id);
  }

  useEffect(() => {
    void load();
  }, []);

  async function pairDevice(e: FormEvent) {
    e.preventDefault();
    const created = await api<Device>('/api/v1/guardian/devices', {
      method: 'POST',
      body: JSON.stringify({ deviceName, childId }),
    });
    setNewToken(created.extension_token ?? null);
    await load();
  }

  async function savePin(e: FormEvent) {
    e.preventDefault();
    await api('/api/v1/auth/bypass-pin', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
    setPin('');
    setMessage('Bypass PIN saved.');
  }

  async function saveUnlock(e: FormEvent) {
    e.preventDefault();
    await api('/api/v1/guardian/unlock-rules', {
      method: 'PUT',
      body: JSON.stringify({
        rules: [
          {
            triggerType,
            effectType,
            effectMinutes: effectType === 'unlock_minutes' ? effectMinutes : undefined,
          },
        ],
      }),
    });
    await api('/api/v1/guardian/settings', {
      method: 'PATCH',
      body: JSON.stringify({ bypassUnlockMinutes: bypassMinutes }),
    });
    setMessage('Unlock rules saved.');
  }

  return (
    <div className="space-y-olg max-w-2xl pb-20 md:pb-0">
      <h2 className="text-display-lg">Settings</h2>
      {message && <p className="text-body-md text-secondary">{message}</p>}

      <section
        className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-olg ${
          showDeviceHighlight ? 'ring-2 ring-secondary' : ''
        }`}
      >
        <h3 className="text-headline-md mb-omd">Pair a Chromebook</h3>
        <p className="text-body-md text-on-surface-variant mb-omd">
          Create a device token, then paste it into the Orbit OS extension popup on the
          kid&apos;s Chromebook.
        </p>
        {children.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
            Add a child under Tasks before pairing a device.
          </p>
        ) : (
          <form onSubmit={pairDevice} className="space-y-osm">
            <input
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg"
              placeholder="Device name"
            />
            <select
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="w-full px-3 py-2 border border-outline-variant rounded-lg"
            >
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.display_name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-secondary text-on-secondary rounded-lg text-label-md"
            >
              Generate token
            </button>
          </form>
        )}
        {newToken && (
          <div className="mt-omd p-omd bg-surface-container-low rounded-xl">
            <p className="text-label-md text-on-surface-variant mb-1">
              Copy this token into the extension (shown once):
            </p>
            <code className="text-body-md break-all">{newToken}</code>
          </div>
        )}
        <ul className="mt-olg space-y-osm">
          {devices.map((d) => (
            <li key={d.id} className="text-body-md">
              {d.device_name} → {d.child_name ?? 'unassigned'}
              {d.last_seen_at
                ? ` · last seen ${new Date(d.last_seen_at).toLocaleString()}`
                : ' · never synced'}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-olg">
        <h3 className="text-headline-md mb-omd">Unlock rules</h3>
        <form onSubmit={saveUnlock} className="space-y-osm">
          <label className="block">
            <span className="text-label-md text-on-surface-variant">When</span>
            <select
              value={triggerType}
              onChange={(e) =>
                setTriggerType(e.target.value as typeof triggerType)
              }
              className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg"
            >
              <option value="mustdo_complete">All Must-Dos complete</option>
              <option value="all_complete">All tasks complete</option>
            </select>
          </label>
          <label className="block">
            <span className="text-label-md text-on-surface-variant">Then</span>
            <select
              value={effectType}
              onChange={(e) => setEffectType(e.target.value as typeof effectType)}
              className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg"
            >
              <option value="unlock_minutes">Unlock for N minutes</option>
              <option value="unlock_full_day">Unlock for the rest of the day</option>
            </select>
          </label>
          {effectType === 'unlock_minutes' && (
            <label className="block">
              <span className="text-label-md text-on-surface-variant">Minutes</span>
              <input
                type="number"
                min={5}
                max={480}
                value={effectMinutes}
                onChange={(e) => setEffectMinutes(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg"
              />
            </label>
          )}
          <label className="block">
            <span className="text-label-md text-on-surface-variant">
              Bypass PIN unlock (minutes)
            </span>
            <input
              type="number"
              min={5}
              max={480}
              value={bypassMinutes}
              onChange={(e) => setBypassMinutes(Number(e.target.value))}
              className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg"
            />
          </label>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-on-primary rounded-lg text-label-md"
          >
            Save unlock rules
          </button>
        </form>
      </section>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-olg">
        <h3 className="text-headline-md mb-omd">Bypass PIN</h3>
        <p className="text-body-md text-on-surface-variant mb-omd">
          Parents enter this on the Focus Gate for a temporary unlock. Rate-limited to 5
          attempts / 10 minutes.
        </p>
        <form onSubmit={savePin} className="flex gap-osm">
          <input
            type="password"
            inputMode="numeric"
            pattern="\d{4,8}"
            required
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="4–8 digit PIN"
            className="flex-1 px-3 py-2 border border-outline-variant rounded-lg"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-on-primary rounded-lg text-label-md"
          >
            Save PIN
          </button>
        </form>
      </section>
    </div>
  );
}
