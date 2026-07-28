import { Link } from 'react-router-dom';
import { Draft } from '../types';

const typeColors: Record<string, string> = {
  linkedin: 'bg-blue-50 text-blue-700',
  blog: 'bg-purple-50 text-purple-700',
  email: 'bg-amber-50 text-amber-700',
  newsletter: 'bg-emerald-50 text-emerald-700',
};

export default function DraftCard({ draft }: { draft: Draft }) {
  return (
    <Link
      to={`/drafts/${draft._id}`}
      className="block bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium px-2 py-1 rounded ${typeColors[draft.type]}`}>
          {draft.type}
        </span>
        <span className="text-xs text-slate-400">
          {new Date(draft.updatedAt).toLocaleDateString()}
        </span>
      </div>
      <h3 className="font-semibold text-slate-900 mb-1 truncate">{draft.title}</h3>
      <p className="text-sm text-slate-500 line-clamp-2">{draft.content}</p>
    </Link>
  );
}
