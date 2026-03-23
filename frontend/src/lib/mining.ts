import api, { assertApiConfigured } from "@/lib/api";

export interface MiningSearchParams {
  query: string;
  genre?: string;
  year_from?: number;
  year_to?: number;
  content_type?: string;
}

export interface MiningResult {
  id: string;
  user_id: string;
  query: string;
  genre?: string | null;
  year_from?: number | null;
  year_to?: number | null;
  content_type?: string | null;
  title: string;
  year?: number | null;
  synopsis?: string | null;
  tmdb_id?: string | null;
  tmdb_rating?: number | null;
  yt_video_count?: number | null;
  yt_avg_views?: number | null;
  yt_avg_comments?: number | null;
  opportunity_score: number;
  created_at: string;
}

export async function searchMining(
  params: MiningSearchParams
): Promise<MiningResult[]> {
  assertApiConfigured();
  const response = await api.post<MiningResult[]>("/mining/search", params);
  return response.data;
}

export async function fetchMiningResults(limit = 20): Promise<MiningResult[]> {
  assertApiConfigured();
  const response = await api.get<MiningResult[]>("/mining/results", {
    params: { limit },
  });
  return response.data;
}
