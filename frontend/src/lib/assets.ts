"use client";

import api from "./api";

export interface ExternalAssetResult {
  id: number | string;
  type: "image" | "video";
  source: "pexels";
  url: string | null;
  preview: string | null;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  author?: string | null;
  pexels_url?: string | null;
}

export interface PexelsSearchResponse {
  query: string;
  media_type: "image" | "video";
  total_results: number;
  results: ExternalAssetResult[];
}

export interface ProjectAsset {
  id: string;
  project_id: string;
  chapter_id?: string | null;
  asset_type: "image" | "video" | "overlay" | "transition";
  source: "pexels" | "upload" | "ai_generated" | "placeholder";
  file_path?: string | null;
  url?: string | null;
  prompt_used?: string | null;
  duration_seconds?: number | null;
  metadata_json?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectAssetPayload {
  chapter_id?: string | null;
  asset_type: "image" | "video" | "overlay" | "transition";
  source: "pexels" | "upload" | "ai_generated" | "placeholder";
  file_path?: string | null;
  url?: string | null;
  prompt_used?: string | null;
  duration_seconds?: number | null;
  metadata_json?: Record<string, unknown> | null;
}

export interface UpdateProjectAssetPayload {
  chapter_id?: string | null;
  file_path?: string | null;
  url?: string | null;
  prompt_used?: string | null;
  duration_seconds?: number | null;
  metadata_json?: Record<string, unknown> | null;
}

export async function searchPexelsAssets(
  projectId: string,
  query: string,
  mediaType: "image" | "video" = "image",
  perPage = 12,
): Promise<PexelsSearchResponse> {
  const response = await api.get(`/assets/${projectId}/search/pexels`, {
    params: {
      query,
      media_type: mediaType,
      per_page: perPage,
    },
  });

  return response.data;
}

export async function createProjectAsset(
  projectId: string,
  payload: CreateProjectAssetPayload,
): Promise<ProjectAsset> {
  const response = await api.post<ProjectAsset>(`/assets/${projectId}`, payload);
  return response.data;
}

export async function listProjectAssets(projectId: string): Promise<ProjectAsset[]> {
  const response = await api.get<ProjectAsset[]>(`/assets/${projectId}`);
  return response.data;
}

export async function updateProjectAsset(
  assetId: string,
  payload: UpdateProjectAssetPayload,
): Promise<ProjectAsset> {
  const response = await api.patch<ProjectAsset>(`/assets/asset/${assetId}`, payload);
  return response.data;
}
