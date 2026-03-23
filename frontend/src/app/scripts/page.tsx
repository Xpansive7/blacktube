"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FileText, PlayCircle, RefreshCw } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { fetchProjects } from "@/lib/projects";
import { fetchChapters, generateScript, type Chapter } from "@/lib/scripts";
import { useProjectStore, type Project } from "@/lib/store";

export default function ScriptsPage() {
  const { projects, setProjects, currentProject, setCurrentProject } = useProjectStore();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        setLoadingProjects(true);
        setError("");
        const data = await fetchProjects(50);
        if (!active) return;
        setProjects(data);

        const initialProjectId = currentProject?.id || data[0]?.id || "";
        setSelectedProjectId(initialProjectId);

        if (initialProjectId) {
          const selected =
            data.find((project) => project.id === initialProjectId) || null;
          if (selected) setCurrentProject(selected);
        }
      } catch (err: any) {
        if (!active) return;
        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Nao foi possivel carregar os projetos."
        );
      } finally {
        if (active) setLoadingProjects(false);
      }
    }

    loadProjects();
    return () => {
      active = false;
    };
  }, [currentProject?.id, setCurrentProject, setProjects]);

  useEffect(() => {
    let active = true;

    async function loadChapters() {
      if (!selectedProjectId) {
        setChapters([]);
        return;
      }

      try {
        setLoadingChapters(true);
        setError("");
        const data = await fetchChapters(selectedProjectId);
        if (!active) return;
        setChapters(data);
      } catch (err: any) {
        if (!active) return;
        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Nao foi possivel carregar os capitulos."
        );
        setChapters([]);
      } finally {
        if (active) setLoadingChapters(false);
      }
    }

    loadChapters();
    return () => {
      active = false;
    };
  }, [selectedProjectId]);

  const selectedProject = useMemo<Project | null>(() => {
    return projects.find((project) => project.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  async function handleGenerate() {
    if (!selectedProjectId) return;

    try {
      setGenerating(true);
      setError("");
      setMessage("");
      const result = await generateScript(selectedProjectId);
      setMessage(
        `${result.message}. Capitulos gerados: ${result.chapters_created}.`
      );
      const updatedChapters = await fetchChapters(selectedProjectId);
      setChapters(updatedChapters);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Nao foi possivel gerar o roteiro."
      );
    } finally {
      setGenerating(false);
    }
  }

  function handleProjectChange(projectId: string) {
    setSelectedProjectId(projectId);
    const project = projects.find((item) => item.id === projectId) || null;
    setCurrentProject(project);
    setMessage("");
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Editor de Scripts
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Gere e revise capitulos reais dos seus projetos.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedProjectId && (
              <Link href={`/projects/${selectedProjectId}`}>
                <Button variant="ghost">Abrir Projeto</Button>
              </Link>
            )}
            <Button
              variant="accent"
              className="space-x-2"
              onClick={handleGenerate}
              disabled={!selectedProjectId || generating || loadingProjects}
            >
              {generating ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <PlayCircle size={18} />
              )}
              <span>{generating ? "Gerando..." : "Gerar Script"}</span>
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xs border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xs border border-status-success/30 bg-status-success/10 px-4 py-3 text-sm text-status-success">
            {message}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Projeto Base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedProjectId}
              onChange={(e) => handleProjectChange(e.target.value)}
              disabled={loadingProjects}
            >
              <option value="">
                {loadingProjects ? "Carregando projetos..." : "Selecione um projeto"}
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </Select>

            {selectedProject && (
              <div className="rounded-xs bg-bg-surface-2 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="accent">{selectedProject.type}</Badge>
                  <Badge>{selectedProject.narrativeMode}</Badge>
                  <Badge variant="success">{selectedProject.status}</Badge>
                </div>
                <p className="text-sm text-text-secondary">
                  Duracao alvo: {selectedProject.duration} min
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capitulos do Roteiro</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingChapters ? (
              <p className="text-sm text-text-muted">Carregando capitulos...</p>
            ) : chapters.length > 0 ? (
              <div className="space-y-3">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="rounded-xs border border-border bg-bg-surface-2 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="accent" size="sm">
                          {chapter.chapter_number}
                        </Badge>
                        <h3 className="font-semibold text-text-primary">
                          {chapter.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge size="sm">{chapter.chapter_type}</Badge>
                        <span className="text-xs text-text-muted">
                          {chapter.duration_seconds || 0}s
                        </span>
                      </div>
                    </div>
                    <p className="mb-2 text-sm text-text-secondary">
                      {chapter.content}
                    </p>
                    {chapter.retention_notes && (
                      <p className="text-xs text-text-muted">
                        Retencao: {chapter.retention_notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mb-4 text-6xl">📝</div>
                <h3 className="mb-2 text-2xl font-bold text-text-primary">
                  Nenhum roteiro gerado ainda
                </h3>
                <p className="mb-6 text-text-secondary">
                  Escolha um projeto e clique em gerar script para criar os capitulos.
                </p>
                <Button
                  variant="accent"
                  className="space-x-2"
                  onClick={handleGenerate}
                  disabled={!selectedProjectId || generating || loadingProjects}
                >
                  <FileText size={18} />
                  <span>Gerar Roteiro Agora</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
