import {
  Draft,
  DashboardStats,
  AIPreferences,
  GenerateContentInput,
} from "../types";

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// Point this at your Express backend. Override via a .env file if needed:
// VITE_API_BASE_URL=http://localhost:5000/api
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.error || `Request failed: ${res.status} ${res.statusText}`,
    );
  }

  // DELETE endpoints return { success: true } with no body content otherwise
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  // GET /api/dashboard
  getDashboard(): Promise<DashboardStats> {
    return request<DashboardStats>("/dashboard");
  },

  // POST /api/generate
  generateContent(input: GenerateContentInput): Promise<Draft> {
    return request<Draft>("/generate", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  // GET /api/drafts?search=
  getDrafts(query?: string): Promise<Draft[]> {
    const qs = query ? `?search=${encodeURIComponent(query)}` : "";
    return request<Draft[]>(`/drafts${qs}`);
  },

  // GET /api/drafts/:id
  getDraft(id: string): Promise<Draft> {
    return request<Draft>(`/drafts/${id}`);
  },

  // POST /api/drafts/:id/refine
  refineContent(id: string, action: string): Promise<Draft> {
    return request<Draft>(`/drafts/${id}/refine`, {
      method: "POST",
      body: JSON.stringify({ action }),
    });
  },

  // PATCH /api/drafts/:id
  updateDraft(
    id: string,
    updates: Partial<Pick<Draft, "content" | "title">>,
  ): Promise<Draft> {
    return request<Draft>(`/drafts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  // DELETE /api/drafts/:id
  deleteDraft(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/drafts/${id}`, { method: "DELETE" });
  },

  // GET /api/preferences
  getPreferences(): Promise<AIPreferences> {
    return request<AIPreferences>("/preferences");
  },

  // PUT /api/preferences
  updatePreferences(prefs: AIPreferences): Promise<AIPreferences> {
    return request<AIPreferences>("/preferences", {
      method: "PUT",
      body: JSON.stringify(prefs),
    });
  },
};
