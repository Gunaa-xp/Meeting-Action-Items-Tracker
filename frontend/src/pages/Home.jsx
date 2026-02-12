import { Link } from 'react-router-dom';

const steps = [
  'Paste meeting transcript',
  'Extract action items',
  'Edit and manage tasks',
  'Track progress and history',
];

function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <section className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-sm p-8 md:p-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Productivity Workspace</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">Meeting Action Items Tracker</h1>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
          Turn raw meeting transcripts into clear, trackable action items in a focused workflow.
        </p>

        <ol className="mt-8 space-y-3 text-left max-w-xl mx-auto">
          {steps.map((step, index) => (
            <li key={step} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="font-semibold text-slate-800">Step {index + 1}:</span>{' '}
              <span className="text-slate-700">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Go to Workspace
          </Link>
          <Link
            to="/status"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-100"
          >
            View System Status
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
