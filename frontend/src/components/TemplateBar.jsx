import { TEMPLATES } from '../services/constants';

function TemplateBar({ onApplyTemplate }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-3">Templates</h2>
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((template) => (
          <button
            key={template.name}
            onClick={() => onApplyTemplate(template)}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TemplateBar;
