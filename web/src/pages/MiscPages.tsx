import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function AllowlistPage() {
  const [items, setItems] = useState<{ id: string; domain: string }[]>([]);

  useEffect(() => {
    void api<{ allowlist: { id: string; domain: string }[] }>(
      '/api/v1/guardian/allowlist',
    ).then((d) => setItems(d.allowlist));
  }, []);

  return (
    <div className="space-y-olg">
      <h2 className="text-display-lg">Allowlist Rules</h2>
      <p className="text-body-md text-on-surface-variant">
        Manage the full list here, or add quickly from the Dashboard.
      </p>
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-olg">
        {items.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">No domains yet.</p>
        ) : (
          <ul className="divide-y divide-outline-variant/50">
            {items.map((i) => (
              <li key={i.id} className="py-omd text-body-lg">
                {i.domain}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export function ActivityPage() {
  const [rows, setRows] = useState<
    { id: number; event_type: string; target: string | null; created_at: string }[]
  >([]);

  useEffect(() => {
    void api<{ activity: typeof rows }>('/api/v1/guardian/activity').then((d) =>
      setRows(d.activity),
    );
  }, []);

  return (
    <div className="space-y-olg">
      <h2 className="text-display-lg">Activity History</h2>
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        {rows.length === 0 ? (
          <p className="p-olg text-body-md text-on-surface-variant">No events logged yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-outline-variant">
                <th className="py-osm px-olg text-label-md text-on-surface-variant">When</th>
                <th className="py-osm px-olg text-label-md text-on-surface-variant">Event</th>
                <th className="py-osm px-olg text-label-md text-on-surface-variant">Target</th>
              </tr>
            </thead>
            <tbody className="text-body-md divide-y divide-outline-variant/50">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="py-omd px-olg whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="py-omd px-olg">{r.event_type}</td>
                  <td className="py-omd px-olg">{r.target ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export function ProofInboxPage() {
  const [pending, setPending] = useState<
    { id: string; title: string; child_name: string; proof_url: string | null }[]
  >([]);

  async function load() {
    const d = await api<{ pending: typeof pending }>('/api/v1/guardian/proof-inbox');
    setPending(d.pending);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-olg">
      <div className="flex items-center justify-between">
        <h2 className="text-display-lg">Photo Approval Inbox</h2>
        <span className="text-label-md text-on-surface-variant">
          {pending.length} Pending
        </span>
      </div>
      {pending.length === 0 ? (
        <p className="text-body-md text-on-surface-variant">
          No photos waiting for approval.
        </p>
      ) : (
        <div className="space-y-omd">
          {pending.map((item) => (
            <section
              key={item.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-olg"
            >
              <div className="text-title-lg">
                {item.child_name} · {item.title}
              </div>
              {item.proof_url && (
                <img
                  src={
                    item.proof_url.startsWith('http')
                      ? item.proof_url
                      : `${import.meta.env.VITE_API_URL ?? ''}${item.proof_url}`
                  }
                  alt="Proof"
                  className="mt-omd max-h-48 rounded-xl border border-outline-variant"
                />
              )}
              <div className="mt-omd flex gap-osm">
                <button
                  type="button"
                  className="px-4 py-2 bg-secondary text-on-secondary rounded-lg text-label-md"
                  onClick={async () => {
                    await api(`/api/v1/guardian/proof/${item.id}/approve`, {
                      method: 'POST',
                      body: JSON.stringify({}),
                    });
                    await load();
                  }}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-error-container text-on-error-container rounded-lg text-label-md"
                  onClick={async () => {
                    const note = prompt('Note for child') ?? 'Needs redo';
                    await api(`/api/v1/guardian/proof/${item.id}/reject`, {
                      method: 'POST',
                      body: JSON.stringify({ note }),
                    });
                    await load();
                  }}
                >
                  Reject
                </button>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
