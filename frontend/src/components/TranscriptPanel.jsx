import { useState } from 'react';

function TranscriptPanel({ onProcess, loading }) {
  const [text, setText] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    await onProcess(text);
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-3">Transcript Processing</h2>
      <form onSubmit={submit} className="space-y-3">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste transcript here..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 min-h-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? 'Extracting...' : 'Extract Action Items'}
        </button>
      </form>
    </div>
  );
}

export default TranscriptPanel;
