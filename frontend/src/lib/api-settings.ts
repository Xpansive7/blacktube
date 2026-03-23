"use client";

import api from "./api";

export type APIServiceId =
  | "tmdb"
  | "youtube"
  | "pexels"
  | "openai"
  | "elevenlabs";

export interface APIServiceSetting {
  service: APIServiceId;
  api_key: string;
  is_active: boolean;
  configured: boolean;
  source: "user" | "env" | "unset";
  updated_at?: string | null;
}

export interface APITestResponse {
  service: APIServiceId;
  ok: boolean;
  message: string;
}

export async function fetchApiSettings(): Promise<Record<string, APIServiceSetting>> {
  const response = await api.get("/settings/apis");
  return response.data;
}

export async function saveApiSetting(
  service: APIServiceId,
  apiKey: string,
  isActive = true,
): Promise<APIServiceSetting> {
  const response = await api.put(`/settings/apis/${service}`, {
    api_key: apiKey,
    is_active: isActive,
  });
  return response.data;
}

export async function testApiSetting(service: APIServiceId): Promise<APITestResponse> {
  const response = await api.post(`/settings/apis/${service}/test`);
  return response.data;
}
