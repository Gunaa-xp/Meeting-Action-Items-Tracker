import { STEP_TYPES } from '../services/constants';

function FiltersBar({ filters, setFilters, availableTags }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200 grid gap-3 md:grid-cols-3">
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={filters.status}
          onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
        >
          <option value="all">Show All</option>
          <option value="open">Show Open</option>
          <option value="done">Show Done</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Step Type</label>
        <select
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={filters.stepType}
          onChange={(event) => setFilters((prev) => ({ ...prev, stepType: event.target.value }))}
        >
          <option value="all">All Step Types</option>
          {STEP_TYPES.map((stepType) => (
            <option value={stepType} key={stepType}>
              {stepType}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tag</label>
        <select
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={filters.tag}
          onChange={(event) => setFilters((prev) => ({ ...prev, tag: event.target.value }))}
        >
          <option value="all">All Tags</option>
          {availableTags.map((tag) => (
            <option value={tag} key={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FiltersBar;
