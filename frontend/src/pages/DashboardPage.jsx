import { useEffect, useMemo, useState } from 'react';
import ActionItemModal from '../components/ActionItemModal';
import ActionItemsTable from '../components/ActionItemsTable';
import FiltersBar from '../components/FiltersBar';
import HistoryPanel from '../components/HistoryPanel';
import TemplateBar from '../components/TemplateBar';
import TranscriptPanel from '../components/TranscriptPanel';
import {
  createAction,
  deleteAction,
  getActions,
  getTranscriptHistory,
  processTranscript,
  updateAction,
} from '../services/api';

function DashboardPage() {
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [filters, setFilters] = useState({ status: 'all', stepType: 'all', tag: 'all' });

  const editableItem = editingItem && editingItem._id ? editingItem : null;

  const extractApiError = (err, fallback) => err.response?.data?.message || err.response?.data?.error || fallback;

  const loadActions = async () => {
    const { data } = await getActions();
    setItems(data);
  };

  const loadHistory = async () => {
    const { data } = await getTranscriptHistory();
    setHistory(data);
  };

  const initialize = async () => {
    try {
      setError('');
      await Promise.all([loadActions(), loadHistory()]);
    } catch (err) {
      setError(extractApiError(err, 'Failed to load dashboard data.'));
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const handleProcessTranscript = async (text) => {
    try {
      setLoadingTranscript(true);
      setError('');
      setNotice('');
      const { data } = await processTranscript(text);
      const extractedItems = data.extractedItems || [];
      if (extractedItems.length === 0) {
        setNotice('No action items found');
      }
      setItems((prev) => [...extractedItems, ...prev]);
      await loadHistory();
    } catch (err) {
      setError(extractApiError(err, 'Failed to process transcript.'));
    } finally {
      setLoadingTranscript(false);
    }
  };

  const handleSaveItem = async (payload) => {
    try {
      setError('');
      if (editableItem) {
        const { data } = await updateAction(editableItem._id, payload);
        setItems((prev) => prev.map((item) => (item._id === data._id ? data : item)));
      } else {
        const { data } = await createAction(payload);
        setItems((prev) => [data, ...prev]);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      setError(extractApiError(err, 'Failed to save action item.'));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAction(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(extractApiError(err, 'Failed to delete action item.'));
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const { data } = await updateAction(item._id, {
        status: item.status === 'done' ? 'open' : 'done',
      });
      setItems((prev) => prev.map((entry) => (entry._id === data._id ? data : entry)));
    } catch (err) {
      setError(extractApiError(err, 'Failed to update status.'));
    }
  };

  const handleApplyTemplate = (template) => {
    setEditingItem({
      task: template.task,
      owner: '',
      dueDate: null,
      status: 'open',
      tags: [],
      stepType: template.stepType,
    });
    setIsModalOpen(true);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const statusMatch = filters.status === 'all' || item.status === filters.status;
      const stepTypeMatch = filters.stepType === 'all' || item.stepType === filters.stepType;
      const tagMatch = filters.tag === 'all' || (item.tags || []).includes(filters.tag);
      return statusMatch && stepTypeMatch && tagMatch;
    });
  }, [items, filters]);

  const availableTags = useMemo(
    () => [...new Set(items.flatMap((item) => item.tags || []))].sort((a, b) => a.localeCompare(b)),
    [items]
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Meeting Action Items Tracker</h1>
          <p className="text-slate-600 mt-1">Extract and manage tasks from meeting transcripts.</p>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-3 py-2">{error}</div>}
        {notice && <div className="mb-4 rounded-lg bg-amber-100 text-amber-700 px-3 py-2">{notice}</div>}

        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          <div className="space-y-4">
            <TranscriptPanel onProcess={handleProcessTranscript} loading={loadingTranscript} />
            <TemplateBar onApplyTemplate={handleApplyTemplate} />
            <FiltersBar filters={filters} setFilters={setFilters} availableTags={availableTags} />

            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Action Items</h2>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsModalOpen(true);
                  }}
                  className="rounded-lg bg-slate-900 text-white px-3 py-1.5 text-sm"
                >
                  Add Item
                </button>
              </div>
              <ActionItemsTable
                items={filteredItems}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                onEdit={(item) => {
                  setEditingItem(item);
                  setIsModalOpen(true);
                }}
              />
            </div>
          </div>

          <HistoryPanel
            history={history}
            onLoad={(entry) => {
              setItems(entry.extractedItems || []);
            }}
          />
        </div>
      </div>

      <ActionItemModal
        isOpen={isModalOpen}
        item={editingItem}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        title={editableItem ? 'Edit Action Item' : 'Add Action Item'}
      />
    </main>
  );
}

export default DashboardPage;
