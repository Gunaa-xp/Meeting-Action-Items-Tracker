import { useEffect, useState } from 'react';
import { getStatus } from '../services/api';

const statusConfig = {
  healthy: { label: 'Healthy', dot: 'bg-emerald-500', text: 'text-emerald-700' },
  connected: { label: 'Connected', dot: 'bg-emerald-500', text: 'text-emerald-700' },
  disconnected: { label: 'Down', dot: 'bg-red-500', text: 'text-red-700' },
  configured: { label: 'Configured', dot: 'bg-emerald-500', text: 'text-emerald-700' },
  not_configured: { label: 'Not configured', dot: 'bg-amber-400', text: 'text-amber-700' },
};

const getStatusStyles = (value) => statusConfig[value] || { label: 'Unknown', dot: 'bg-red-500', text: 'text-red-700' };

function Status() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStatus = async () => {
      try {
        setError('');
        const { data } = await getStatus();
        setStatus(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load system status.');
      }
    };

    loadStatus();
  }, []);

  const cards = [
    { key: 'backend', title: 'Backend API status', value: status?.backend },
    { key: 'database', title: 'MongoDB connection status', value: status?.database },
    { key: 'llm', title: 'LLM status', value: status?.llm },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900">System Status</h1>
        <p className="mt-2 text-slate-600">Live health of backend services and integrations.</p>

        {error && <div className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-red-700">{error}</div>}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const styles = getStatusStyles(card.value);
            return (
              <div key={card.key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">{card.title}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${styles.dot}`} />
                  <span className={`font-semibold ${styles.text}`}>{styles.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default Status;
