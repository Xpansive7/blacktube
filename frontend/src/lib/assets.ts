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

