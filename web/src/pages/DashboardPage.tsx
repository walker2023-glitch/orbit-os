import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../lib/api';

interface DashboardData {
  settings: { focus_mode_enabled: boolean; bypass_unlock_minutes: number };
  allowlist: { id: string; domain: string }[];
  activity: {
    id: number;
    event_type: string;
    target: string | null;
    created_at: string;
  }[];
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const d = await api<DashboardData>('/api/v1/guardian/dashboard');
      setData(d);
    } catch {
      setError("Couldn't load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function toggleFocus(enabled: boolean) {
    await api('/api/v1/guardian/settings', {
      method: 'PATCH',
      body: JSON.stringify({ focusModeEnabled: enabled }),
    });
    await load();
  }

  async function addDomain(e: FormEvent) {
    e.preventDefault();
    if (!domain.trim()) return;
    await api('/api/v1/guardian/allowlist', {
      method: 'POST',
      body: JSON.stringify({ domain }),
    });
    setDomain('');
    await load();
  }

  async function removeDomain(id: string) {
    await api(`/api/v1/guardian/allowlist/${id}`, { method: 'DELETE' });
    await load();
  }

  if (loading && !data) {
    return (
      <div className="space-y-olg">
        <div className="h-40 bg-surface-container animate-pulse rounded-xl" />
        <div className="h-64 bg-surface-container animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-olg pb-20 md:pb-0">
      <div>
        <h2 className="text-display-lg text-on-surface">Dashboard</h2>
        <p className="text-body-md text-on-surface-variant mt-oxs">
          Focus Mode allowlist and recent Chromebook activity.
        </p>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container rounded-lg p-osm text-body-md">
          {error}{' '}
          <button type="button" className="underline" onClick={() => void load()}>
            Retry
          </button>
        </div>
      )}

      <section
        className={`bg-surface-container-lowest rounded-xl p-olg border border-outline-variant ${
          data?.settings.focus_mode_enabled ? '' : 'opacity-50'
        }`}
      >
        <div className="flex items-center justify-between mb-olg gap-omd">
          <div>
            <h3 className="text-headline-md text-on-surface">Focus Mode Allowlist</h3>
            <p className="text-body-md text-on-surface-variant mt-1">
              Domains kids can always open. Everything else is gated until tasks are done.
            </p>
            {!data?.settings.focus_mode_enabled && (
              <p className="text-label-md text-on-surface-variant mt-2">Focus Mode is off</p>
            )}
          </div>
          <label className="flex items-center gap-osm cursor-pointer shrink-0">
            <span className="text-label-md text-on-surface">Enable</span>
            <input
              type="checkbox"
              className="accent-secondary w-5 h-5"
              checked={data?.settings.focus_mode_enabled ?? true}
              onChange={(e) => void toggleFocus(e.target.checked)}
            />
          </label>
        </div>

        <form onSubmit={addDomain} className="flex gap-osm mb-omd">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline">language</span>
            </span>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Add website (e.g., classroom.google.com)"
              className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 border border-primary text-primary rounded-lg text-label-md hover:bg-primary-fixed/30 transition-colors flex items-center"
          >
            <span className="material-symbols-outlined mr-oxs text-[18px]">add</span>
            Add
          </button>
        </form>

        <div className="flex flex-wrap gap-osm">
          {(data?.allowlist.length ?? 0) === 0 ? (
            <p className="text-body-md text-on-surface-variant">
              No sites added yet. Add your first educational site above.
            </p>
          ) : (
            data?.allowlist.map((item) => (
              <div
                key={item.id}
                className="inline-flex items-center bg-secondary-fixed/20 border border-secondary text-secondary-fixed-dim px-osm py-1 rounded text-label-md"
              >
                {item.domain}
                <button
                  type="button"
                  className="ml-2 text-secondary hover:text-secondary-fixed-dim"
                  aria-label={`Remove ${item.domain}`}
                  onClick={() => void removeDomain(item.id)}
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
        <div className="p-olg border-b border-outline-variant">
          <h3 className="text-headline-md text-on-surface">Activity History</h3>
        </div>
        {(data?.activity.length ?? 0) === 0 ? (
          <p className="p-olg text-body-md text-on-surface-variant">
            No activity yet for this child today.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-outline-variant">
                  <th className="py-osm px-olg text-label-md text-on-surface-variant">Timestamp</th>
                  <th className="py-osm px-olg text-label-md text-on-surface-variant">Event</th>
                  <th className="py-osm px-olg text-label-md text-on-surface-variant hidden md:table-cell">
                    Target
                  </th>
                </tr>
              </thead>
              <tbody className="text-body-md divide-y divide-outline-variant/50">
                {data?.activity.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-omd px-olg whitespace-nowrap">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="py-omd px-olg">{row.event_type}</td>
                    <td className="py-omd px-olg hidden md:table-cell">{row.target ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
