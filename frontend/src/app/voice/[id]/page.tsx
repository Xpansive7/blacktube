"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Download, RefreshCcw, Sparkles, Waves } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { fetchProject } from "@/lib/projects";
import { fetchChapters, generateScript, type Chapter } from "@/lib/scripts";
import {
  fetchVoiceModels,
  fetchVoiceSegments,
  generateVoiceForChapter,
  type VoiceModel,
  type VoiceSegment,
} from "@/lib/voice";

const statusBadgeVariant: Record<string, "success" | "warning" | "default" | "danger"> = {
  ready: "success",
  generating: "warning",
  pending: "default",
  error: "danger",
};

const statusLabels: Record<string, string> = {
  ready: "Gerada",
  generating: "Gerando",
  pending: "Pendente",
  error: "Erro",
};

function formatDuration(seconds?: number | null) {
  if (!seconds) return "--";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return `${minutes}m ${remaining.toString().padStart(2, "0")}s`;
}

export default function VoiceStudioPage() {
  const params = useParams<{ id: string }>();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [projectTitle, setProjectTitle] = useState("Projeto");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [segments, setSegments] = useState<VoiceSegment[]>([]);
  const [voiceModels, setVoiceModels] = useState<VoiceModel[]>([]);
  const [selectedVoices, setSelectedVoices] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [pendingChapterId, setPendingChapterId] = useState<string | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [generatingScript, setGeneratingScript] = useState(false);

  const loadVoiceStudio = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!projectId) return;

      const [project, models, chapterList, segmentList] = await Promise.all([
        fetchProject(projectId),
        fetchVoiceModels(),
        fetchChapters(projectId),
        fetchVoiceSegments(projectId),
      ]);

      setProjectTitle(project.title);
      setVoiceModels(models);
      setChapters(chapterList);
      setSegments(segmentList);
      setSelectedVoices((current) => {
        const next: Record<string, string> = { ...current };
        for (const chapter of chapterList) {
          const existing = segmentList.find((segment) => segment.chapter_id === chapter.id);
          next[chapter.id] =
            current[chapter.id] ||
            existing?.voice_model ||
            models[0]?.model_id ||
            "lucas_pt";
        }
        return next;
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Nao foi possivel carregar o studio de voz."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadVoiceStudio();
  }, [loadVoiceStudio]);

  const chapterRows = useMemo(() => {
    return chapters.map((chapter) => {
      const segment = segments.find((item) => item.chapter_id === chapter.id);
      return {
        chapter,
        segment,
        selectedVoice:
          selectedVoices[chapter.id] ||
          segment?.voice_model ||
          voiceModels[0]?.model_id ||
          "lucas_pt",
      };
    });
  }, [chapters, segments, selectedVoices, voiceModels]);

  const stats = useMemo(() => {
    const ready = segments.filter((segment) => segment.status === "ready").length;
    const generating = segments.filter((segment) => segment.status === "generating").length;
    const pending = Math.max(chapters.length - ready - generating, 0);
    return { ready, generating, pending };
  }, [chapters.length, segments]);

  async function handleGenerateScript() {
    try {
      setGeneratingScript(true);
      setActionMessage("");
      if (!projectId) return;
      const result = await generateScript(projectId);
      setActionMessage(`${result.chapters_created} capitulos gerados com sucesso.`);
      await loadVoiceStudio();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Nao foi possivel gerar o roteiro base."
      );
    } finally {
      setGeneratingScript(false);
    }
  }

  async function handleGenerateChapter(chapterId: string) {
    try {
      setPendingChapterId(chapterId);
      setActionMessage("");
      const segment = await generateVoiceForChapter(
        chapterId,
        selectedVoices[chapterId] || voiceModels[0]?.model_id || "lucas_pt"
      );
      setSegments((current) => {
        const others = current.filter((item) => item.chapter_id !== chapterId);
        return [...others, segment];
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Nao foi possivel gerar a voz desse capitulo."
      );
    } finally {
      setPendingChapterId(null);
    }
  }

  async function handleGenerateAll() {
    try {
      setGeneratingAll(true);
      setActionMessage("");
      for (const row of chapterRows) {
        await handleGenerateChapter(row.chapter.id);
      }
      setActionMessage("Studio de voz atualizado para todos os capitulos.");
    } finally {
      setGeneratingAll(false);
      await loadVoiceStudio();
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Studio de Voz</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Geracao de locucao por capitulo para {projectTitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={loadVoiceStudio} className="space-x-2">
              <RefreshCcw size={16} />
              <span>Atualizar</span>
            </Button>
            <Button
              variant="accent"
              onClick={handleGenerateAll}
              disabled={loading || generatingAll || chapters.length === 0}
              className="space-x-2"
            >
              <Sparkles size={16} />
              <span>{generatingAll ? "Gerando..." : "Gerar Todas"}</span>
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xs border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
            {error}
          </div>
        )}

        {actionMessage && (
          <div className="rounded-xs border border-status-success/30 bg-status-success/10 px-4 py-3 text-sm text-status-success">
            {actionMessage}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo de Voz</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-xs bg-bg-surface-2 p-4">
              <p className="text-xs text-text-muted">Capitulos</p>
              <p className="mt-1 text-2xl font-bold text-text-primary">{chapters.length}</p>
            </div>
            <div className="rounded-xs bg-bg-surface-2 p-4">
              <p className="text-xs text-text-muted">Geradas</p>
              <p className="mt-1 text-2xl font-bold text-status-success">{stats.ready}</p>
            </div>
            <div className="rounded-xs bg-bg-surface-2 p-4">
              <p className="text-xs text-text-muted">Processando</p>
              <p className="mt-1 text-2xl font-bold text-status-warning">{stats.generating}</p>
            </div>
            <div className="rounded-xs bg-bg-surface-2 p-4">
              <p className="text-xs text-text-muted">Pendentes</p>
              <p className="mt-1 text-2xl font-bold text-text-primary">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="py-10 text-center text-text-secondary">
              Carregando capitulos e vozes...
            </CardContent>
          </Card>
        ) : chapters.length === 0 ? (
          <Card>
            <CardContent className="space-y-4 py-10 text-center">
              <Waves className="mx-auto text-accent" size={28} />
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Este projeto ainda nao tem roteiro
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Gere os capitulos primeiro. Depois o studio de voz consegue criar
                  uma locucao para cada parte do roteiro.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="accent"
                  onClick={handleGenerateScript}
                  disabled={generatingScript}
                >
                  {generatingScript ? "Gerando roteiro..." : "Gerar roteiro agora"}
                </Button>
                <Link href={`/projects/${projectId}`}>
                  <Button variant="ghost">Voltar ao projeto</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {chapterRows.map(({ chapter, segment, selectedVoice }) => (
              <Card key={chapter.id}>
                <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-accent/10 font-bold text-accent">
                        {chapter.chapter_number}
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{chapter.title}</h3>
                        <p className="text-xs text-text-muted">
                          {chapter.chapter_type} · {formatDuration(chapter.duration_seconds)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">{chapter.content}</p>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs text-text-muted">
                          Modelo de voz
                        </label>
                        <Select
                          value={selectedVoice}
                          onChange={(event) =>
                            setSelectedVoices((current) => ({
                              ...current,
                              [chapter.id]: event.target.value,
                            }))
                          }
                        >
                          {voiceModels.map((voice) => (
                            <option key={voice.model_id} value={voice.model_id}>
                              {voice.name} · {voice.gender} · {voice.accent}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="rounded-xs bg-bg-surface-2 p-3">
                        <p className="text-xs text-text-muted">Saida atual</p>
                        <p className="mt-1 text-sm text-text-primary">
                          {segment?.audio_path || "Nenhum audio gerado ainda"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2 lg:w-48">
                    <Badge variant={statusBadgeVariant[segment?.status || "pending"]}>
                      {statusLabels[segment?.status || "pending"]}
                    </Badge>
                    <div className="text-xs text-text-muted">
                      Duracao final: {formatDuration(segment?.duration_seconds)}
                    </div>
                    <Button
                      variant="accent"
                      onClick={() => handleGenerateChapter(chapter.id)}
                      disabled={pendingChapterId === chapter.id}
                    >
                      {pendingChapterId === chapter.id ? "Gerando..." : "Gerar voz"}
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={!segment?.audio_path}
                      className="space-x-2"
                    >
                      <Download size={16} />
                      <span>Baixar</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
