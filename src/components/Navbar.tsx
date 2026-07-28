import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sparkles, FileText, Settings } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/generate', label: 'Generate', icon: Sparkles },
  { to: '/drafts', label: 'Drafts', icon: FileText },
  { to: '/preferences', label: 'Preferences', icon: Settings },
];

export default function Navbar() {
  return (
    <nav className="w-60 min-h-screen bg-white border-r border-slate-200 p-4 flex flex-col gap-1">
      <div className="px-3 py-4 mb-2">
        <h1 className="text-lg font-bold text-slate-900">Content Workspace</h1>
        <p className="text-xs text-slate-500">AI Marketing Assistant</p>
      </div>
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
