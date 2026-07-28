import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { api } from '../api/api';
import { ContentType } from '../types';

const contentTypes: { value: ContentType; label: string }[] = [
  { value: 'linkedin', label: 'LinkedIn Post' },
  { value: 'blog', label: 'Blog Article' },
  { value: 'email', label: 'Marketing Email' },
  { value: 'newsletter', label: 'Newsletter' },
];

export default function Generate() {
  const navigate = useNavigate();
  const [type, setType] = useState<ContentType>('linkedin');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Professional');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic || !audience) return;
    setLoading(true);
    setError(null);
    try {
      const draft = await api.generateContent({ type, topic, audience, tone, instructions });
      navigate(`/drafts/${draft._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Generate Content</h2>
      <p className="text-slate-500 mb-6">Create AI-powered marketing content</p>

      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Content Type</label>
          <div className="grid grid-cols-4 gap-2">
            {contentTypes.map((ct) => (
              <button
                key={ct.value}
                onClick={() => setType(ct.value)}
                className={`text-sm py-2 rounded-lg border ${
                  type === ct.value
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {ct.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Topic</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Launch of our new AI feature"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Target Audience</label>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g. B2B SaaS founders"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <option>Professional</option>
            <option>Casual</option>
            <option>Persuasive</option>
            <option>Friendly</option>
            <option>Bold</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Additional Instructions
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            placeholder="Any specific requirements..."
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading || !topic || !audience}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-medium disabled:opacity-50"
        >
          <Sparkles size={16} />
          {loading ? 'Generating...' : 'Generate Content'}
        </button>
      </div>
    </div>
  );
}
