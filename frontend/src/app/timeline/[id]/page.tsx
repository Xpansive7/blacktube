"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  Image as ImageIcon,
  Mic2,
  RefreshCcw,
  Sparkles,
} from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProject } from "@/lib/projects";
import { generateScript } from "@/lib/scripts";
import {
  fetchTimeline,
  fetchTimelineSummary,
  validateTimeline,
  type TimelineData,
  type TimelineSummary,
  type TimelineValidation,
} from "@/lib/timeline";

function formatDuration(seconds: number) {
  if (!seconds) return "--";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return `${minutes}m ${remaining.toString().padStart(2, "0")}s`;
}

export default function TimelinePage({
  params,
}: {
  params: { id: string };
}) {
  const [projectTitle, setProjectTitle] = useState("Projeto");
  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const [summary, setSummary] = useState<TimelineSummary | null>(null);
  const [validation, setValidation] = useState<TimelineValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [generatingScript, setGeneratingScript] = useState(false);

  const loadTimeline = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const project = await fetchProject(params.id);
      setProjectTitle(project.title);

      const [summaryData, validationData, timelineData] = await Promise.allSettled([
        fetchTimelineSummary(params.id),
        validateTimeline(params.id),
        fetchTimeline(params.id),
      ]);

      if (summaryData.status === "fulfilled") setSummary(summaryData.value);
      if (validationData.status === "fulfilled") setValidation(validationData.value);
      if (timelineData.status === "fulfilled") setTimeline(timelineData.value);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Nao foi possivel carregar a timeline."
      );
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  async function handleGenerateScript() {
    try {
      setGeneratingScript(true);
      setMessage("");
      const result = await generateScript(params.id);
      setMessage(`${result.chapters_created} capitulos gerados para a timeline.`);
      await loadTimeline();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Nao foi possivel gerar o roteiro."
      );
    } finally {
      setGeneratingScript(false);
    }
  }

  const hasChapters = (summary?.chapter_count || 0) > 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Timeline</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Visao estrutural do roteiro, voz e ativos de {projectTitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={loadTimeline} className="space-x-2">
              <RefreshCcw size={16} />
              <span>Atualizar</span>
            </Button>
            <Link href={`/voice/${params.id}`}>
              <Button variant="accent">Ir para voz</Button>
            </Link>
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

        {loading ? (
          <Card>
            <CardContent className="py-10 text-center text-text-secondary">
              Carregando timeline...
            </CardContent>
          </Card>
        ) : !hasChapters ? (
          <Card>
            <CardContent className="space-y-4 py-10 text-center">
              <Sparkles className="mx-auto text-accent" size={28} />
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Ainda nao existe roteiro para montar timeline
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  A timeline nasce dos capitulos do roteiro. Gere o script base e
                  depois volte para revisar voz, duracao e validacao.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="accent"
                  onClick={handleGenerateScript}
                  disabled={generatingScript}
                >
                  {generatingScript ? "Gerando roteiro..." : "Gerar roteiro"}
                </Button>
                <Link href={`/projects/${params.id}`}>
                  <Button variant="ghost">Voltar ao projeto</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-text-muted">Capitulos</p>
                  <p className="mt-1 text-2xl font-bold text-text-primary">
                    {summary?.chapter_count || 0}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-text-muted">Duracao total</p>
                  <p className="mt-1 text-2xl font-bold text-text-primary">
                    {formatDuration(summary?.total_duration_seconds || 0)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-text-muted">Assets</p>
                  <p className="mt-1 text-2xl font-bold text-text-primary">
                    {summary?.asset_count || 0}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-text-muted">Vozes</p>
                  <p className="mt-1 text-2xl font-bold text-text-primary">
                    {summary?.voice_segment_count || 0}
                  </p>
                </CardContent>
              </Card>
            </div>

            {validation && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Validacao da Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={validation.ready_to_render ? "success" : "warning"}>
                      {validation.ready_to_render ? "Pronta para render" : "Precisa ajustes"}
                    </Badge>
                    <span className="text-sm text-text-secondary">
                      {validation.chapter_count} capitulos · {validation.asset_count} assets · {validation.voice_count} vozes
                    </span>
                  </div>

                  {validation.issues.length > 0 && (
                    <div className="rounded-xs border border-status-danger/30 bg-status-danger/10 p-4">
                      <div className="mb-2 flex items-center gap-2 text-status-danger">
                        <AlertTriangle size={16} />
                        <span className="font-medium">Pendencias criticas</span>
                      </div>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-text-primary">
                        {validation.issues.map((issue) => (
                          <li key={issue}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validation.warnings.length > 0 && (
                    <div className="rounded-xs border border-status-warning/30 bg-status-warning/10 p-4">
                      <p className="mb-2 font-medium text-status-warning">Avisos</p>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-text-primary">
                        {validation.warnings.map((warning) => (
                          <li key={warning}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {timeline?.chapters.map((chapter) => (
                <Card key={chapter.id}>
                  <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-accent/10 font-bold text-accent">
                          {chapter.number}
                        </div>
                        <div>
                          <h3 className="font-semibold text-text-primary">{chapter.title}</h3>
                          <p className="text-xs text-text-muted">
                            {chapter.type} · {chapter.timecode_in} - {chapter.timecode_out}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary">{chapter.content_preview}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:w-[340px]">
                      <div className="rounded-xs bg-bg-surface-2 p-3">
                        <div className="mb-2 flex items-center gap-2 text-text-muted">
                          <Clock size={14} />
                          <span className="text-xs">Duracao</span>
                        </div>
                        <p className="font-semibold text-text-primary">
                          {formatDuration(chapter.duration_seconds)}
                        </p>
                      </div>
                      <div className="rounded-xs bg-bg-surface-2 p-3">
                        <div className="mb-2 flex items-center gap-2 text-text-muted">
                          <ImageIcon size={14} />
                          <span className="text-xs">Assets</span>
                        </div>
                        <p className="font-semibold text-text-primary">
                          {chapter.assets.length}
                        </p>
                      </div>
                      <div className="col-span-2 rounded-xs bg-bg-surface-2 p-3">
                        <div className="mb-2 flex items-center gap-2 text-text-muted">
                          <Mic2 size={14} />
                          <span className="text-xs">Voz</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-text-primary">
                              {chapter.voice?.model || "Sem voz gerada"}
                            </p>
                            <p className="text-xs text-text-muted">
                              {chapter.voice?.duration
                                ? formatDuration(chapter.voice.duration)
                                : "Geracao pendente"}
                            </p>
                          </div>
                          <Badge variant={chapter.voice?.status === "ready" ? "success" : "default"}>
                            {chapter.voice?.status || "pending"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
