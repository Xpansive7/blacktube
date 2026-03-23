import api, { assertApiConfigured } from "@/lib/api";
import type { Project } from "@/lib/store";

export interface ApiProject {
  id: string;
  title: string;
  project_type: string;
  status: string;
  narrative_mode: string;
  created_at: string;
  updated_at: string;
  target_duration_minutes: number;
  synopsis?: string | null;
  source_title?: string | null;
  source_year?: number | null;
}

export function mapProject(project: ApiProject): Project {
  return {
    id: project.id,
    title: project.title,
    type: project.project_type,
    status: project.status,
    narrativeMode: project.narrative_mode,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    duration: project.target_duration_minutes,
  };
}

export async function fetchProjects(limit = 50): Promise<Project[]> {
  assertApiConfigured();
  const response = await api.get<ApiProject[]>("/projects", {
    params: { limit },
  });
  return response.data.map(mapProject);
}

export async function fetchProject(id: string): Promise<Project & { synopsis?: string | null }> {
  assertApiConfigured();
  const response = await api.get<ApiProject>(`/projects/${id}`);
  return {
    ...mapProject(response.data),
    synopsis: response.data.synopsis,
  };
}
