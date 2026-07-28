import { useEffect, useState } from "react";
import type { AIPreferences } from "../types";
import { api } from "../api/api";

export default function Preferences() {
  const [prefs, setPrefs] = useState<AIPreferences | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getPreferences().then(setPrefs);
  }, []);

  const handleSave = async () => {
    if (!prefs) return;
    await api.updatePreferences(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  if (!prefs) return <p className="text-slate-500">Loading...</p>;

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-1">AI Preferences</h2>
      <p className="text-slate-500 mb-6">
        Customize how the AI assistant behaves
      </p>

      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Preferred AI Model
          </label>
          <select
            value={prefs.model}
            onChange={(e) => setPrefs({ ...prefs, model: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Creativity Level: {prefs.creativity}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={prefs.creativity}
            onChange={(e) =>
              setPrefs({ ...prefs, creativity: Number(e.target.value) })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Writing Style
          </label>
          <input
            value={prefs.style}
            onChange={(e) => setPrefs({ ...prefs, style: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Custom System Prompt
          </label>
          <textarea
            value={prefs.systemPrompt}
            onChange={(e) =>
              setPrefs({ ...prefs, systemPrompt: e.target.value })
            }
            rows={4}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white py-2.5 rounded-lg font-medium"
        >
          {saved ? "Saved!" : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
