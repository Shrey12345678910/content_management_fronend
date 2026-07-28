import { useEffect, useState } from 'react';
import { FileText, Sparkles, Activity as ActivityIcon } from 'lucide-react';
import { api } from '../api/api';
import { DashboardStats } from '../types';
import StatCard from '../components/StatCard';
import DraftCard from '../components/DraftCard';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getDashboard()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <p className="text-red-600 text-sm">
        Couldn't load dashboard: {error}. Is the backend running on the expected URL?
      </p>
    );
  }

  if (!stats) return <p className="text-slate-500">Loading dashboard...</p>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Overview of your content workspace</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Generated" value={stats.totalGenerated} icon={Sparkles} />
        <StatCard label="Total Drafts" value={stats.totalDrafts} icon={FileText} />
        <StatCard label="Recent Activity" value={stats.recentActivity.length} icon={ActivityIcon} />
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Recent Drafts</h3>
        <div className="grid grid-cols-3 gap-4">
          {stats.recentDrafts.map((d) => (
            <DraftCard key={d._id} draft={d} />
          ))}
        </div>
        {stats.recentDrafts.length === 0 && (
          <p className="text-slate-400 text-sm">No drafts yet — generate your first one.</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Recent AI Activity</h3>
        <div className="bg-white border border-slate-200 rounded-xl divide-y">
          {stats.recentActivity.map((a) => (
            <div key={a._id} className="p-3 flex justify-between text-sm">
              <span className="text-slate-700">
                <strong>{a.action}</strong> — {a.draftTitle}
              </span>
              <span className="text-slate-400">{new Date(a.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
          {stats.recentActivity.length === 0 && (
            <p className="p-3 text-slate-400 text-sm">No activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
