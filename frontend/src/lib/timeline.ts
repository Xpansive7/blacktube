import api, { assertApiConfigured } from "@/lib/api";

export interface TimelineVoice {
  id: string;
  model: string;
  duration: number | null;
  status: string;
  audio_path?: string | null;
}

export interface TimelineAsset {
  id: string;
  type: string;
  source: string;
  duration: number | null;
  url?: string | null;
}

export interface TimelineChapter {
  id: string;
  number: number;
  title: string;
  type: string;
  content_preview: string;
  duration_seconds: number;
  timecode_in: string;
  timecode_out: string;
  emotional_intensity: number;
  retention_notes?: string | null;
  assets: TimelineAsset[];
  voice?: TimelineVoice | null;
}

export interface TimelineData {
  project_id: string;
  title: string;
  total_duration_seconds: number;
  chapters: TimelineChapter[];
}

export interface TimelineSummary {
  project_id: string;
  title: string;
  chapter_count: number;
  asset_count: number;
  voice_segment_count: number;
  total_duration_seconds: number;
  total_duration_minutes: number;
  total_words: number;
  avg_words_per_chapter: number;
  narrative_mode: string;
  status: string;
}

export interface TimelineValidation {
  valid: boolean;
  issues: string[];
  warnings: string[];
  chapter_count: number;
  asset_count: number;
  voice_count: number;
  ready_to_render: boolean;
}

export async function fetchTimeline(projectId: string): Promise<TimelineData> {
  assertApiConfigured();
  const response = await api.get<TimelineData>(`/timeline/${projectId}`);
  return response.data;
}

export async function fetchTimelineSummary(
  projectId: string
): Promise<TimelineSummary> {
  assertApiConfigured();
  const response = await api.get<TimelineSummary>(`/timeline/${projectId}/summary`);
  return response.data;
}

export async function validateTimeline(
  projectId: string
): Promise<TimelineValidation> {
  assertApiConfigured();
  const response = await api.post<TimelineValidation>(
    `/timeline/${projectId}/validate`
  );
  return response.data;
}
