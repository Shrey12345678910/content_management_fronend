export type ContentType = 'linkedin' | 'blog' | 'email' | 'newsletter';

export interface Draft {
  _id: string;
  type: ContentType;
  title: string;
  content: string;
  topic: string;
  audience: string;
  tone: string;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  action: string;
  draftId: string;
  draftTitle: string;
  createdAt: string;
}

export interface DashboardStats {
  totalGenerated: number;
  totalDrafts: number;
  recentDrafts: Draft[];
  recentActivity: Activity[];
}

export interface AIPreferences {
  model: string;
  creativity: number;
  style: string;
  systemPrompt: string;
}

export interface GenerateContentInput {
  type: ContentType;
  topic: string;
  audience: string;
  tone: string;
  instructions?: string;
}
