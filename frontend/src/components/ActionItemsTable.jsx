function ActionItemsTable({ items, onToggleStatus, onDelete, onEdit }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">No action items found.</p>;
  }

  const isOverdue = (item) => item.dueDate && item.status === 'open' && new Date(item.dueDate) < new Date();

  return (
    <div className="overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="text-left px-3 py-2">Done</th>
            <th className="text-left px-3 py-2">Task</th>
            <th className="text-left px-3 py-2">Owner</th>
            <th className="text-left px-3 py-2">Due Date</th>
            <th className="text-left px-3 py-2">Step Type</th>
            <th className="text-left px-3 py-2">Tags</th>
            <th className="text-left px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="border-t border-slate-200 align-top">
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={item.status === 'done'}
                  onChange={() => onToggleStatus(item)}
                  className="h-4 w-4"
                />
              </td>
              <td className="px-3 py-2 font-medium">{item.task}</td>
              <td className="px-3 py-2">{item.owner || '-'}</td>
              <td className={`px-3 py-2 ${isOverdue(item) ? 'text-red-600 font-medium' : ''}`}>
                {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'}
              </td>
              <td className="px-3 py-2">{item.stepType}</td>
              <td className="px-3 py-2">
                <div className="flex flex-wrap gap-1">
                  {(item.tags || []).map((tag) => (
                    <span key={`${item._id}-${tag}`} className="px-2 py-0.5 text-xs rounded-full bg-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="flex gap-2 items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {item.status}
                  </span>
                  <button onClick={() => onEdit(item)} className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => onDelete(item._id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ActionItemsTable;
