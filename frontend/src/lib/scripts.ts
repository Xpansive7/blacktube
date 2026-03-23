import api, { assertApiConfigured } from "@/lib/api";

export interface Chapter {
  id: string;
  project_id: string;
  chapter_number: number;
  title: string;
  chapter_type: string;
  content: string;
  duration_seconds: number | null;
  emotional_intensity: number;
  retention_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeneratedScriptResult {
  message: string;
  metadata: Record<string, unknown>;
  chapters_created: number;
}

export async function fetchChapters(projectId: string): Promise<Chapter[]> {
  assertApiConfigured();
  const response = await api.get<Chapter[]>(`/scripts/${projectId}/chapters`);
  return response.data;
}

export async function generateScript(
  projectId: string
): Promise<GeneratedScriptResult> {
  assertApiConfigured();
  const response = await api.post<GeneratedScriptResult>(
    `/scripts/generate/${projectId}`
  );
  return response.data;
}
