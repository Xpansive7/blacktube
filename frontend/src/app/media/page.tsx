"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Check, ExternalLink, Loader2, Plus, Search, Video, Image as ImageIcon } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchProject, fetchProjects } from "@/lib/projects";
import { createProjectAsset, searchPexelsAssets, ExternalAssetResult } from "@/lib/assets";
import { fetchChapters, type Chapter } from "@/lib/scripts";
import type { Project } from "@/lib/store";

type ProjectContext = Project & {
  synopsis?: string | null;
  sourceTitle?: string | null;
  sources?: Array<{
    source_type?: string;
    title?: string | null;
    url?: string | null;
    metadata_json?: Record<string, unknown> | null;
  }>;
};

const STOP_WORDS = new Set([
  "a",
  "o",
  "os",
  "as",
  "de",
  "do",
  "da",
  "dos",
  "das",
  "e",
  "em",
  "para",
  "por",
  "na",
  "no",
  "nas",
  "nos",
  "the",
  "of",
  "and",
  "to",
  "um",
  "uma",
]);

function extractKeywords(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function buildKeywordSuggestions(project: ProjectContext | null, mediaType: "image" | "video") {
  if (!project) return [];

  const sourceMetadata = project.sources?.[0]?.metadata_json || {};
  const sourceTitle =
    project.sourceTitle ||
    project.sources?.[0]?.title ||
    (typeof sourceMetadata.channel_title === "string" ? sourceMetadata.channel_title : "");

  const baseText = [project.title, project.synopsis, project.sourceTitle, sourceTitle]
    .filter(Boolean)
    .join(" ");
  const keywords = Array.from(new Set(extractKeywords(baseText))).slice(0, 4);
  const seed = keywords.slice(0, 2).join(" ") || project.title;

  const suffixes =
    mediaType === "video"
      ? ["cinematic footage", "documentary", "news footage", "b-roll", "dramatic"]
      : ["cinematic", "documentary", "news", "dramatic", "editorial"];

  return Array.from(
    new Set([
      project.title,
      sourceTitle,
      seed,
      ...suffixes.map((suffix) => `${seed} ${suffix}`.trim()),
      ...keywords.map((keyword) => `${keyword} ${mediaType === "video" ? "footage" : "photo"}`),
    ].filter(Boolean)),
  ).slice(0, 8);
}

export default function MediaPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectContext, setProjectContext] = useState<ProjectContext | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [query, setQuery] = useState("cinematic city");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [results, setResults] = useState<ExternalAssetResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingAssetId, setSavingAssetId] = useState<string | number | null>(null);
  const [savedAssetIds, setSavedAssetIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await fetchProjects();
        setProjects(data);
        if (data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err) {
        setError("Nao foi possivel carregar os projetos.");
      }
    }

    loadProjects();
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProjectContext() {
      if (!selectedProjectId) {
        setProjectContext(null);
        setChapters([]);
        setSelectedChapterId("");
        return;
      }

      try {
        const [data, chapterData] = await Promise.all([
          fetchProject(selectedProjectId),
          fetchChapters(selectedProjectId),
        ]);
        if (!active) return;
        setProjectContext(data as ProjectContext);
        setChapters(chapterData);
        setSelectedChapterId((currentValue) =>
          currentValue && chapterData.some((chapter) => chapter.id === currentValue)
            ? currentValue
            : chapterData[0]?.id || ""
        );
      } catch {
        if (!active) return;
        setProjectContext(null);
        setChapters([]);
        setSelectedChapterId("");
      }
    }

    loadProjectContext();
    return () => {
      active = false;
    };
  }, [selectedProjectId]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || null,
    [projects, selectedProjectId],
  );

  const keywordSuggestions = useMemo(
    () => buildKeywordSuggestions(projectContext, mediaType),
    [projectContext, mediaType],
  );

  const handleSearch = async () => {
    if (!selectedProjectId || !query.trim()) {
      setError("Escolha um projeto e digite uma busca.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await searchPexelsAssets(selectedProjectId, query.trim(), mediaType);
      setResults(data.results);
    } catch (err: any) {
      setResults([]);
      setError(err?.response?.data?.detail || "Falha ao buscar assets no Pexels.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTimeline = async (item: ExternalAssetResult) => {
    if (!selectedProjectId) {
      setError("Escolha um projeto antes de adicionar ativos.");
      return;
    }

    try {
      setSavingAssetId(item.id);
      setError("");
      setMessage("");

      const metadata = {
        preview: item.preview,
        width: item.width,
        height: item.height,
        author: item.author,
        pexels_url: item.pexels_url,
        external_id: item.id,
        trim_start: 0,
        trim_end: item.duration ?? null,
        transition: "cut",
        source_query: query,
      };

      const asset = await createProjectAsset(selectedProjectId, {
        chapter_id: selectedChapterId || null,
        asset_type: item.type,
        source: "pexels",
        url: item.url,
        duration_seconds: item.type === "image" ? 5 : item.duration ?? 10,
        metadata_json: metadata,
      });

      setSavedAssetIds((current) => Array.from(new Set([...current, asset.id, String(item.id)])));
      setMessage(
        selectedChapterId
          ? "Asset adicionado ao capitulo e pronto para aparecer na timeline."
          : "Asset salvo no projeto. Agora voce pode vincular na timeline."
      );
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Nao foi possivel adicionar esse asset.");
    } finally {
      setSavingAssetId(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Biblioteca de Midia</h1>
            <p className="text-text-secondary text-sm mt-1">
              Busque imagens e videos do Pexels para abastecer seus projetos.
            </p>
          </div>
          {selectedProject && <Badge variant="accent">Projeto atual: {selectedProject.title}</Badge>}
        </div>

        <div className="bg-bg-surface border border-border rounded-xs p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <select
              value={selectedProjectId}
              onChange={(event) => setSelectedProjectId(event.target.value)}
              className="px-3 py-2 text-sm text-text-primary bg-bg-surface border border-border rounded-xs outline-none"
            >
              <option value="">Escolha um projeto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>

            <div className="relative lg:col-span-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <Input
                placeholder="Buscar asset no Pexels..."
                className="pl-10"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <select
              value={mediaType}
              onChange={(event) => setMediaType(event.target.value as "image" | "video")}
              className="px-3 py-2 text-sm text-text-primary bg-bg-surface border border-border rounded-xs outline-none"
            >
              <option value="image">Imagens</option>
              <option value="video">Videos</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <select
              value={selectedChapterId}
              onChange={(event) => setSelectedChapterId(event.target.value)}
              className="px-3 py-2 text-sm text-text-primary bg-bg-surface border border-border rounded-xs outline-none"
              disabled={!selectedProjectId || chapters.length === 0}
            >
              <option value="">Salvar apenas na biblioteca do projeto</option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  Capitulo {chapter.chapter_number}: {chapter.title}
                </option>
              ))}
            </select>
            <div className="flex items-center rounded-xs border border-border bg-bg-surface-2 px-3 py-2 text-xs text-text-secondary">
              {selectedChapterId
                ? "Novos assets entram diretamente nesse capitulo da timeline."
                : "Sem capitulo selecionado: o asset entra na biblioteca do projeto."}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="accent" onClick={handleSearch} disabled={loading || !selectedProjectId}>
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Search size={16} className="mr-2" />}
              Buscar no Pexels
            </Button>
          </div>

          {selectedProjectId && keywordSuggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-text-muted">
                PALAVRAS-CHAVE SUGERIDAS A PARTIR DO PROJETO
              </p>
              <div className="flex flex-wrap gap-2">
                {keywordSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="rounded-xs border border-border px-3 py-1 text-xs text-text-secondary transition-colors hover:border-border-active hover:text-text-primary"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {message && <p className="text-sm text-status-success">{message}</p>}
          {error && <p className="text-sm text-status-danger">{error}</p>}
        </div>

        {loading && (
          <Card>
            <CardContent className="pt-8 pb-8 flex items-center justify-center gap-2 text-text-secondary">
              <Loader2 size={18} className="animate-spin" />
              Buscando assets...
            </CardContent>
          </Card>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map((item) => (
              <Card key={`${item.type}-${item.id}`}>
                <CardContent className="pt-4 space-y-4">
                  <div className="aspect-video bg-bg-surface-2 rounded-xs overflow-hidden border border-border">
                    {item.preview ? (
                      <img
                        src={item.preview}
                        alt={`Preview ${item.id}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        Sem preview
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="default">
                      <span className="flex items-center gap-1">
                        {item.type === "video" ? <Video size={12} /> : <ImageIcon size={12} />}
                        {item.type === "video" ? "Video" : "Imagem"}
                      </span>
                    </Badge>
                    {item.author && (
                      <span className="text-xs text-text-secondary truncate">por {item.author}</span>
                    )}
                  </div>

                  <div className="text-xs text-text-muted space-y-1">
                    <p>
                      {item.width || "-"} x {item.height || "-"}
                    </p>
                    {item.duration ? <p>{item.duration}s</p> : null}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={savedAssetIds.includes(String(item.id)) ? "accent" : "ghost"}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToTimeline(item)}
                      disabled={savingAssetId === item.id}
                    >
                      {savingAssetId === item.id ? (
                        <>
                          <Loader2 size={14} className="mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : savedAssetIds.includes(String(item.id)) ? (
                        <>
                          <Check size={14} className="mr-2" />
                          Na timeline
                        </>
                      ) : (
                        <>
                          <Plus size={14} className="mr-2" />
                          Enviar para timeline
                        </>
                      )}
                    </Button>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="sm" className="w-full">
                          Abrir asset
                        </Button>
                      </a>
                    )}
                    {item.pexels_url && (
                      <a href={item.pexels_url} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="sm">
                          <ExternalLink size={14} />
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && results.length === 0 && !error && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="mb-4 text-4xl">Midia</div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Sua busca do Pexels aparece aqui
              </h3>
              <p className="text-text-secondary">
                Escolha um projeto, salve a chave do Pexels em Configuracoes e rode a busca.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
