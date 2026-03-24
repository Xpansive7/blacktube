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
  sources?: ApiProjectSource[];
}

export interface ApiProjectSource {
  id?: string;
  project_id?: string;
  source_type: string;
  external_id?: string | null;
  title?: string | null;
  url?: string | null;
  metadata_json?: Record<string, unknown> | null;
}

export interface CreateProjectPayload {
  title: string;
  project_type:
    | "movie_analysis"
    | "series_analysis"
    | "documentary"
    | "essay"
    | "theory"
    | "reaction";
  source_title?: string | null;
  source_year?: number | null;
  synopsis?: string | null;
  notes?: string | null;
  output_language?: string;
  target_duration_minutes?: number;
  narrative_mode?:
    | "padrao"
    | "retencao_maxima"
    | "investigativo"
    | "psicologico"
    | "filosofico"
    | "analise_poder"
    | "teoria"
    | "explicado_simples"
    | "autoridade";
  audience_awareness_level?:
    | "unaware"
    | "problem_aware"
    | "solution_aware"
    | "product_aware";
  sources?: ApiProjectSource[];
}

export interface ProjectDetails extends Project {
  synopsis?: string | null;
  sourceTitle?: string | null;
  sources?: ApiProjectSource[];
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

export async function fetchProject(id: string): Promise<ProjectDetails> {
  assertApiConfigured();
  const response = await api.get<ApiProject>(`/projects/${id}`);
  return {
    ...mapProject(response.data),
    synopsis: response.data.synopsis,
    sourceTitle: response.data.source_title,
    sources: response.data.sources || [],
  };
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  assertApiConfigured();
  const response = await api.post<ApiProject>("/projects", payload);
  return mapProject(response.data);
}
