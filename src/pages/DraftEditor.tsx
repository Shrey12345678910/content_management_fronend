import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, Save } from 'lucide-react';
import { api } from '../api/api';
import { Draft } from '../types';

const actions = [
  'Rewrite professionally',
  'Make it shorter',
  'Expand the content',
  'Improve readability',
  'Add stronger CTA',
  'Generate alternative version',
];

export default function DraftEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [content, setContent] = useState('');
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getDraft(id)
      .then((d) => {
        setDraft(d);
        setContent(d.content);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleAction = async (action: string) => {
    if (!id) return;
    setRefining(true);
    setError(null);
    try {
      const updated = await api.refineContent(id, action);
      setDraft(updated);
      setContent(updated.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refine failed');
    } finally {
      setRefining(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      await api.updateDraft(id, { content });
      navigate('/drafts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await api.deleteDraft(id);
      navigate('/drafts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  if (error && !draft) {
    return <p className="text-red-600 text-sm">Couldn't load draft: {error}</p>;
  }

  if (!draft) return <p className="text-slate-500">Loading draft...</p>;

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">{draft.title}</h2>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm"
            >
              <Save size={14} /> Save
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={18}
          className="w-full border border-slate-200 rounded-xl p-4 text-sm bg-white"
        />
      </div>

      <div className="w-72">
        <h3 className="font-semibold text-slate-900 mb-3 text-sm">AI Assistant</h3>
        <div className="flex flex-col gap-2">
          {actions.map((a) => (
            <button
              key={a}
              onClick={() => handleAction(a)}
              disabled={refining}
              className="text-left text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 disabled:opacity-50"
            >
              {a}
            </button>
          ))}
        </div>
        {refining && <p className="text-xs text-slate-400 mt-2">Applying...</p>}
      </div>
    </div>
  );
}
