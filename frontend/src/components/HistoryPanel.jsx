function HistoryPanel({ history, onLoad }) {
  return (
    <aside className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
      <h2 className="font-semibold text-lg mb-3">Transcript History</h2>
      <div className="space-y-2">
        {history.length === 0 && <p className="text-sm text-slate-500">No transcript history yet.</p>}
        {history.map((item) => (
          <button
            key={item._id}
            onClick={() => onLoad(item)}
            className="text-left w-full rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
          >
            <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
            <p className="line-clamp-3 text-sm mt-1">{item.text}</p>
            <p className="text-xs text-blue-600 mt-1">{item.extractedItems.length} items</p>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default HistoryPanel;
