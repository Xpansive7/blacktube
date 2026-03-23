import api, { assertApiConfigured } from "@/lib/api";

export interface ExportJob {
  id: string;
  export_type: string;
  status: string;
  output_path?: string | null;
  created_at: string;
  completed_at?: string | null;
}

export interface ExportStats {
  chapter_count: number;
  asset_count: number;
  voice_segment_count: number;
  total_duration_seconds: number;
  total_duration_minutes: number;
  word_count: number;
  avg_words_per_chapter: number;
  estimated_reading_time_minutes: number;
  project_title: string;
  project_type: string;
  narrative_mode: string;
  status: string;
}

export async function fetchExportJobs(projectId: string): Promise<ExportJob[]> {
  assertApiConfigured();
  const response = await api.get<ExportJob[]>(`/export/${projectId}/jobs`);
  return response.data;
}

export async function fetchExportStats(projectId: string): Promise<ExportStats> {
  assertApiConfigured();
  const response = await api.get<ExportStats>(`/export/${projectId}/stats`);
  return response.data;
}

export async function runExport(
  projectId: string,
  exportType: "json" | "txt" | "render-plan"
): Promise<ExportJob> {
  assertApiConfigured();
  const response = await api.post<ExportJob>(`/export/${projectId}/${exportType}`);
  return response.data;
}
