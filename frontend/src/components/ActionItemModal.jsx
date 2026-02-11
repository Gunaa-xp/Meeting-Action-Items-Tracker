import { useEffect, useState } from 'react';
import { STEP_TYPES } from '../services/constants';

const defaultForm = {
  task: '',
  owner: '',
  dueDate: '',
  status: 'open',
  tags: '',
  stepType: 'Other',
};

function ActionItemModal({ isOpen, item, onClose, onSave, title }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!isOpen) return;
    if (!item) {
      setForm(defaultForm);
      return;
    }

    setForm({
      task: item.task || '',
      owner: item.owner || '',
      dueDate: item.dueDate ? item.dueDate.slice(0, 10) : '',
      status: item.status || 'open',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      stepType: item.stepType || 'Other',
    });
  }, [isOpen, item]);

  if (!isOpen) return null;

  const submit = async (event) => {
    event.preventDefault();
    await onSave({
      ...form,
      owner: form.owner || null,
      dueDate: form.dueDate || null,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-5 border border-slate-200 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        <form onSubmit={submit} className="space-y-3">
          <input
            required
            value={form.task}
            onChange={(event) => setForm((prev) => ({ ...prev, task: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Task"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={form.owner}
              onChange={(event) => setForm((prev) => ({ ...prev, owner: event.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Owner"
            />
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="open">Open</option>
              <option value="done">Done</option>
            </select>
            <select
              value={form.stepType}
              onChange={(event) => setForm((prev) => ({ ...prev, stepType: event.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              {STEP_TYPES.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <input
            value={form.tags}
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Tags (comma separated)"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActionItemModal;
