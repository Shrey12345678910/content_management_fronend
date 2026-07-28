import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../api/api';
import { Draft } from '../types';
import DraftCard from '../components/DraftCard';

export default function Drafts() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Debounce so a real backend call doesn't fire on every keystroke
    const timeout = setTimeout(() => {
      setLoading(true);
      api
        .getDrafts(query)
        .then(setDrafts)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Drafts</h2>
      <p className="text-slate-500 mb-6">All your saved content</p>

      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search drafts..."
          className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm bg-white"
        />
      </div>

      {error && <p className="text-red-600 text-sm mb-4">Couldn't load drafts: {error}</p>}
      {loading && !error && <p className="text-slate-400 text-sm mb-4">Loading...</p>}

      <div className="grid grid-cols-3 gap-4">
        {drafts.map((d) => (
          <DraftCard key={d._id} draft={d} />
        ))}
      </div>
      {!loading && !error && drafts.length === 0 && (
        <p className="text-slate-400 text-sm">No drafts found.</p>
      )}
    </div>
  );
}
