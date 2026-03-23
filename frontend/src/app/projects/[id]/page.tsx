"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Edit, MoreVertical, Share2 } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchProject } from "@/lib/projects";
import { useProjectStore } from "@/lib/store";

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projectSynopsis, setProjectSynopsis] = useState<string | null>(null);
  const { currentProject, setCurrentProject } = useProjectStore();

  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProject(params.id);
        if (!active) return;
        setProjectSynopsis(data.synopsis || "");
        setCurrentProject({
          id: data.id,
          title: data.title,
          type: data.type,
          status: data.status,
          narrativeMode: data.narrativeMode,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          duration: data.duration,
        });
      } catch (err: any) {
        if (!active) return;
        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Nao foi possivel carregar o projeto."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProject();
    return () => {
      active = false;
    };
  }, [params.id, setCurrentProject]);

  const project = currentProject && currentProject.id === params.id ? currentProject : null;

  return (
    <AppLayout>
      <div className="space-y-6">
        {error && (
          <div className="rounded-xs border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
            {error}
          </div>
        )}

        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-text-primary">
              {loading ? "Carregando projeto..." : project?.title || "Projeto"}
            </h1>
            <p className="text-text-secondary">
              {projectSynopsis || "Sem sinopse cadastrada."}
            </p>
            {project && (
              <div className="mt-3 flex items-center space-x-2">
                <Badge variant="accent">{project.type}</Badge>
                <Badge variant="success">{project.status}</Badge>
                <Badge>{project.narrativeMode}</Badge>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Share2 size={18} />
            </Button>
            <Button variant="ghost" size="sm">
              <Edit size={18} />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical size={18} />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Visao Geral</TabsTrigger>
            <TabsTrigger value="script">Roteiro</TabsTrigger>
            <TabsTrigger value="assets">Ativos</TabsTrigger>
            <TabsTrigger value="voice">Voz</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Progresso Geral</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-text-secondary">
                          Projeto Completo
                        </span>
                        <span className="text-sm font-mono text-text-primary">
                          {project ? (project.status === "exported" ? 100 : 40) : 0}%
                        </span>
                      </div>
                      <Progress value={project ? (project.status === "exported" ? 100 : 40) : 0} />
                    </div>

                    {project && (
                      <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
                        <div>
                          <p className="mb-1 text-xs text-text-muted">Criado em</p>
                          <p className="text-sm font-bold text-text-primary">
                            {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs text-text-muted">Duracao alvo</p>
                          <p className="text-sm font-bold text-text-primary">
                            {project.duration} min
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs text-text-muted">Status</p>
                          <p className="text-sm font-bold text-text-primary">
                            {project.status}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Acoes Rapidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href={`/scripts`}>
                      <Button variant="accent" className="w-full justify-center">
                        Editar Roteiro
                      </Button>
                    </Link>
                    <Link href={`/voice/${params.id}`}>
                      <Button variant="ghost" className="w-full justify-center">
                        Abrir Studio de Voz
                      </Button>
                    </Link>
                    <Link href={`/timeline/${params.id}`}>
                      <Button variant="ghost" className="w-full justify-center">
                        Abrir Timeline
                      </Button>
                    </Link>
                    <Link href={`/export/${params.id}`}>
                      <Button variant="ghost" className="w-full justify-center">
                        Exportar
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="script">
            <Card>
              <CardHeader>
                <CardTitle>Roteiro</CardTitle>
                <CardDescription>Acesse o editor completo de roteiro</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/scripts">
                  <Button variant="accent" className="space-x-2">
                    <span>Abrir Editor de Roteiro</span>
                    <Edit size={16} />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets">
            <Card>
              <CardHeader>
                <CardTitle>Ativos e Midia</CardTitle>
              </CardHeader>
              <CardContent className="py-8 text-center">
                <p className="mb-4 text-text-muted">
                  Vincule assets reais a este projeto pela biblioteca de midia.
                </p>
                <Link href="/media">
                  <Button variant="accent">Abrir Biblioteca</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice">
            <Card>
              <CardHeader>
                <CardTitle>Studio de Voz</CardTitle>
              </CardHeader>
              <CardContent className="py-8 text-center">
                <p className="mb-4 text-text-muted">
                  Abra o studio de voz conectado a este projeto.
                </p>
                <Link href={`/voice/${params.id}`}>
                  <Button variant="accent">Ir para Studio de Voz</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="py-8 text-center">
                <p className="mb-4 text-text-muted">
                  Visualize a timeline estruturada deste projeto.
                </p>
                <Link href={`/timeline/${params.id}`}>
                  <Button variant="accent">Abrir Timeline</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Exportar</CardTitle>
              </CardHeader>
              <CardContent className="py-8 text-center">
                <p className="mb-4 text-text-muted">
                  Gere arquivos de saida para este projeto.
                </p>
                <Link href={`/export/${params.id}`}>
                  <Button variant="accent" className="space-x-2">
                    <Download size={16} />
                    <span>Ir para Exportacao</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
