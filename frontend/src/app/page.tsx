"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Play, TrendingUp, Zap } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fetchProjects } from "@/lib/projects";
import { useProjectStore } from "@/lib/store";

const quickActions = [
  { icon: "📋", label: "Novo Projeto", href: "/projects/new" },
  { icon: "⚡", label: "Minerar Oportunidades", href: "/mining" },
  { icon: "✍️", label: "Gerar Script", href: "/scripts" },
  { icon: "📤", label: "Exportar", href: "/export" },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { projects, setProjects, setCurrentProject } = useProjectStore();

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProjects(10);
        if (!active) return;
        setProjects(data);
      } catch (err: any) {
        if (!active) return;
        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Nao foi possivel carregar o dashboard."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProjects();
    return () => {
      active = false;
    };
  }, [setProjects]);

  const stats = useMemo(
    () => [
      { label: "Projetos Totais", value: String(projects.length), icon: TrendingUp },
      {
        label: "Scripts Ativos",
        value: String(projects.filter((p) => p.status !== "exported").length),
        icon: Play,
      },
      {
        label: "Em Producao",
        value: String(projects.filter((p) => p.status === "producing").length),
        icon: Zap,
      },
      {
        label: "Exportados",
        value: String(projects.filter((p) => p.status === "exported").length),
        icon: Download,
      },
    ],
    [projects]
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-text-primary">
            Bem-vindo ao BlackTube
          </h2>
          <p className="text-text-secondary">
            Sua plataforma de mineracao e criacao de narrativas com IA
          </p>
        </div>

        {error && (
          <div className="rounded-xs border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 transition-opacity hover:opacity-100" />
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="mb-2 text-sm text-text-muted">{stat.label}</p>
                      <p className="text-3xl font-bold text-text-primary">
                        {loading ? "..." : stat.value}
                      </p>
                    </div>
                    <Icon size={24} className="text-accent opacity-60" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-text-primary">Acoes Rapidas</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Card
                  interactive
                  className="flex h-24 flex-col items-center justify-center text-center"
                >
                  <div className="mb-2 text-2xl">{action.icon}</div>
                  <p className="text-sm font-medium text-text-primary">
                    {action.label}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary">
              Projetos Recentes
            </h3>
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                Ver Tudo
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                onClick={() => setCurrentProject(project)}
              >
                <Card interactive className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-3">
                        <h4 className="font-semibold text-text-primary">
                          {project.title}
                        </h4>
                        <Badge variant="accent" size="sm">
                          {project.type}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-text-secondary">
                        <span className="flex items-center space-x-1">
                          <span className="h-2 w-2 rounded-full bg-status-success" />
                          <span>{project.status}</span>
                        </span>
                        <span>{project.narrativeMode}</span>
                        <span className="font-mono">{project.duration}min</span>
                        <span className="text-text-muted">
                          {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}

            {!loading && projects.length === 0 && !error && (
              <Card className="p-6 text-center">
                <p className="mb-4 text-text-muted">
                  Voce ainda nao tem projetos criados.
                </p>
                <Link href="/projects/new">
                  <Button variant="accent">Criar Primeiro Projeto</Button>
                </Link>
              </Card>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-text-primary">
            Resumo de Atividade
          </h3>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      Projetos em Producao
                    </span>
                    <span className="text-sm font-mono text-text-primary">
                      {projects.filter((p) => p.status === "producing").length}/{projects.length || 1}
                    </span>
                  </div>
                  <Progress
                    value={
                      projects.length
                        ? (projects.filter((p) => p.status === "producing").length /
                            projects.length) *
                          100
                        : 0
                    }
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      Projetos Exportados
                    </span>
                    <span className="text-sm font-mono text-text-primary">
                      {projects.filter((p) => p.status === "exported").length}/{projects.length || 1}
                    </span>
                  </div>
                  <Progress
                    value={
                      projects.length
                        ? (projects.filter((p) => p.status === "exported").length /
                            projects.length) *
                          100
                        : 0
                    }
                    variant="success"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
