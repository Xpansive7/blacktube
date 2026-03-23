import api, { assertApiConfigured } from "@/lib/api";

export interface VoiceModel {
  model_id: string;
  name: string;
  gender: string;
  accent: string;
}

export interface VoiceSegment {
  id: string;
  project_id: string;
  chapter_id: string;
  text: string;
  audio_path?: string | null;
  duration_seconds?: number | null;
  voice_model: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface VoiceModelsResponse {
  language: string;
  voices: VoiceModel[];
}

export async function fetchVoiceModels(language = "pt-BR"): Promise<VoiceModel[]> {
  assertApiConfigured();
  const response = await api.get<VoiceModelsResponse>("/voice/available-models", {
    params: { language },
  });
  return response.data.voices;
}

export async function fetchVoiceSegments(
  projectId: string
): Promise<VoiceSegment[]> {
  assertApiConfigured();
  const response = await api.get<VoiceSegment[]>(`/voice/${projectId}/segments`);
  return response.data;
}

export async function generateVoiceForChapter(
  chapterId: string,
  voiceModel: string
): Promise<VoiceSegment> {
  assertApiConfigured();
  const response = await api.post<VoiceSegment>(`/voice/generate/${chapterId}`, null, {
    params: { voice_model: voiceModel },
  });
  return response.data;
}
