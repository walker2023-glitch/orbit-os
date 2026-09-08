import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { api } from '../lib/api';

interface Child {
  id: string;
  display_name: string;
  color_hex: string;
}

interface Task {
  id: string;
  title: string;
  task_type: 'mustdo' | 'shoulddo' | 'optional';
  proof_type: string;
  timer_minutes: number | null;
  assigned_child_ids: string[];
}

const columns: { key: Task['task_type']; label: string; border: string }[] = [
  { key: 'mustdo', label: 'Must-Do', border: 'border-l-error' },
  { key: 'shoulddo', label: 'Should-Do', border: 'border-l-amber-600' },
  { key: 'optional', label: 'Optional', border: 'border-l-outline' },
];

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [childId, setChildId] = useState('');
  const [title, setTitle] = useState('');
  const [taskType, setTaskType] = useState<Task['task_type']>('mustdo');
  const [proofType, setProofType] = useState('checkbox');
  const [error, setError] = useState('');

  async function load() {
    try {
      const [t, c] = await Promise.all([
        api<{ tasks: Task[] }>('/api/v1/guardian/tasks'),
        api<{ children: Child[] }>('/api/v1/guardian/children'),
      ]);
      setTasks(t.tasks);
      setChildren(c.children);
      if (!childId && c.children[0]) setChildId(c.children[0].id);
    } catch {
      setError("Couldn't load tasks");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () =>
      childId
        ? tasks.filter((t) => t.assigned_child_ids.includes(childId))
        : tasks,
    [tasks, childId],
  );

  async function addChild(e: FormEvent) {
    e.preventDefault();
    const name = prompt('Child display name');
    if (!name) return;
    await api('/api/v1/guardian/children', {
      method: 'POST',
      body: JSON.stringify({ displayName: name }),
    });
    await load();
  }

  async function createTask(e: FormEvent) {
    e.preventDefault();
    if (!childId) {
      setError('Add a child profile first');
      return;
    }
    await api('/api/v1/guardian/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title,
        taskType,
        proofType,
        assignedChildIds: [childId],
        timerMinutes: proofType === 'timer' ? 20 : undefined,
        autoApproveAfterMinutes: proofType === 'photo_auto' ? 60 : undefined,
      }),
    });
    setTitle('');
    await load();
  }

  async function removeTask(id: string) {
    await api(`/api/v1/guardian/tasks/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="space-y-olg pb-20 md:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-omd">
        <div>
          <h2 className="text-display-lg text-on-surface">Task Manager</h2>
          <p className="text-body-md text-on-surface-variant mt-oxs">
            Daily Must-Dos gate recreational browsing on Chromebooks.
          </p>
        </div>
        <div className="flex gap-osm items-center">
          <select
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            className="border border-outline-variant rounded-lg px-3 py-2 text-body-md bg-white"
          >
            {children.length === 0 && <option value="">No children</option>}
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.display_name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addChild}
            className="px-4 py-2 border border-primary text-primary rounded-lg text-label-md hover:bg-primary-fixed/30 transition-colors"
          >
            + Child
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container rounded-lg p-osm">
          {error}
        </div>
      )}

      <form
        onSubmit={createTask}
        className="bg-surface-container-lowest border border-outline-variant rounded-xl p-olg flex flex-wrap gap-osm items-end"
      >
        <label className="flex-1 min-w-[200px]">
          <span className="text-label-md text-on-surface-variant">New task</span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Make bed"
            className="mt-1 w-full px-3 py-2 border border-outline-variant rounded-lg text-body-md"
          />
        </label>
        <label>
          <span className="text-label-md text-on-surface-variant">Type</span>
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value as Task['task_type'])}
            className="mt-1 block border border-outline-variant rounded-lg px-3 py-2 text-body-md"
          >
            <option value="mustdo">Must-Do</option>
            <option value="shoulddo">Should-Do</option>
            <option value="optional">Optional</option>
          </select>
        </label>
        <label>
          <span className="text-label-md text-on-surface-variant">Proof</span>
          <select
            value={proofType}
            onChange={(e) => setProofType(e.target.value)}
            className="mt-1 block border border-outline-variant rounded-lg px-3 py-2 text-body-md"
          >
            <option value="checkbox">Checkbox</option>
            <option value="timer">Timer</option>
            <option value="photo_auto">Photo → Auto-approve</option>
            <option value="photo_parent">Photo → Parent approval</option>
          </select>
        </label>
        <button
          type="submit"
          className="px-6 py-2 bg-secondary text-on-secondary rounded-lg text-label-md hover:bg-secondary/90 transition-colors"
        >
          Add task
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-olg">
        {columns.map((col) => {
          const list = filtered.filter((t) => t.task_type === col.key);
          return (
            <section
              key={col.key}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-olg"
            >
              <h3 className="text-headline-sm text-on-surface mb-omd">
                {col.label} ({list.length})
              </h3>
              <div className="space-y-osm">
                {list.map((task) => (
                  <div
                    key={task.id}
                    className={`border border-outline-variant border-l-4 ${col.border} rounded-xl p-omd`}
                  >
                    <div className="text-title-lg text-on-surface">{task.title}</div>
                    <div className="text-label-md text-on-surface-variant mt-1">
                      {task.proof_type}
                      {task.timer_minutes ? ` · ${task.timer_minutes} min` : ''}
                    </div>
                    <button
                      type="button"
                      onClick={() => void removeTask(task.id)}
                      className="mt-2 text-on-surface-variant hover:text-error text-label-md transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {list.length === 0 && (
                  <p className="text-body-md text-on-surface-variant">No tasks yet.</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
