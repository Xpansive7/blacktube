"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Download,
  Eye,
  FileJson,
  FileText,
  RefreshCcw,
  Sparkles,
} from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchExportJobs,
  fetchExportStats,
  runExport,
  type ExportJob,
  type ExportStats,
} from "@/lib/exports";
import { fetchProject } from "@/lib/projects";
import { generateScript } from "@/lib/scripts";

const exportTypes = [
  {
    id: "json" as const,
    name: "Exportar como JSON",
    icon: FileJson,
    description: "Estrutura completa do projeto para integracoes e auditoria.",
  },
  {
    id: "txt" as const,
    name: "Exportar roteiro TXT",
    icon: FileText,
    description: "Versao textual formatada para leitura e revisao.",
  },
  {
    id: "render-plan" as const,
    name: "Plano de renderizacao",
    icon: Eye,
    description: "Resumo tecnico para timeline e edicao externa.",
  },
];

const statusVariant: Record<string, "success" | "warning" | "default" | "danger"> = {
  completed: "success",
  processing: "warning",
  pending: "default",
  failed: "danger",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR");
}

export default function ExportPage() {
  const params = useParams<{ id: string }>();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [projectTitle, setProjectTitle] = useState("Projeto");
  const [stats, setStats] = useState<ExportStats | null>(null);
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [runningExport, setRunningExport] = useState<string | null>(null);
  const [generatingScript, setGeneratingScript] = useState(false);

  const loadExportData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!projectId) return;
      const project = await fetchProject(projectId);
      setProjectTitle(project.title);

      const [statsData, jobsData] = await Promise.all([
        fetchExportStats(projectId),
        fetchExportJobs(projectId),
      ]);

      setStats(statsData);
      setJobs(jobsData);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Nao foi possivel carregar a central de exportacao."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadExportData();
  }, [loadExportData]);

  async function handleGenerateScript() {
    try {
      setGeneratingScript(true);
      setMessage("");
      if (!projectId) return;
      const result = await generateScript(projectId);
      setMessage(`${result.chapters_created} capitulos gerados. Agora voce pode exportar.`);
      await loadExportData();
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

  async function handleRunExport(exportType: "json" | "txt" | "render-plan") {
    try {
      setRunningExport(exportType);
      setMessage("");
      if (!projectId) return;
      await runExport(projectId, exportType);
      setMessage(`Exportacao ${exportType} disparada com sucesso.`);
      await loadExportData();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Nao foi possivel iniciar a exportacao."
      );
    } finally {
      setRunningExport(null);
    }
  }

  const hasScript = useMemo(() => (stats?.chapter_count || 0) > 0, [stats]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Exportar Projeto</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Gere saidas estruturadas para {projectTitle}
            </p>
          </div>
          <Button variant="ghost" onClick={loadExportData} className="space-x-2">
            <RefreshCcw size={16} />
            <span>Atualizar</span>
          </Button>
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
              Carregando dados de exportacao...
            </CardContent>
          </Card>
        ) : !hasScript ? (
          <Card>
            <CardContent className="space-y-4 py-10 text-center">
              <Sparkles className="mx-auto text-accent" size={28} />
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Ainda nao ha roteiro para exportar
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Gere os capitulos primeiro. Depois o BlackTube pode produzir
                  JSON, TXT e plano de renderizacao para esse projeto.
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
                <Link href={`/projects/${projectId}`}>
                  <Button variant="ghost">Voltar ao projeto</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {stats && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-text-muted">Capitulos</p>
                    <p className="mt-1 text-2xl font-bold text-text-primary">{stats.chapter_count}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-text-muted">Palavras</p>
                    <p className="mt-1 text-2xl font-bold text-text-primary">{stats.word_count}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-text-muted">Duracao estimada</p>
                    <p className="mt-1 text-2xl font-bold text-text-primary">
                      {stats.total_duration_minutes.toFixed(1)} min
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-text-muted">Segmentos de voz</p>
                    <p className="mt-1 text-2xl font-bold text-text-primary">
                      {stats.voice_segment_count}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {exportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card key={type.id}>
                    <CardContent className="space-y-4 p-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xs bg-accent/10 text-accent">
                        <Icon size={22} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{type.name}</h3>
                        <p className="mt-1 text-sm text-text-secondary">{type.description}</p>
                      </div>
                      <Button
                        variant="accent"
                        className="w-full"
                        onClick={() => handleRunExport(type.id)}
                        disabled={runningExport === type.id}
                      >
                        {runningExport === type.id ? "Exportando..." : "Gerar arquivo"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Historico de exportacoes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {jobs.length === 0 ? (
                  <div className="rounded-xs bg-bg-surface-2 px-4 py-6 text-center text-sm text-text-secondary">
                    Nenhuma exportacao gerada ainda.
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex flex-col gap-3 rounded-xs border border-border p-4 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-text-primary">{job.export_type}</p>
                          <Badge variant={statusVariant[job.status] || "default"}>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-text-muted">
                          Criado em {formatDate(job.created_at)}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          Saida registrada: {job.output_path || "nao informada"}
                        </p>
                      </div>
                      <Button variant="ghost" disabled className="space-x-2">
                        <Download size={16} />
                        <span>Download indisponivel</span>
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
