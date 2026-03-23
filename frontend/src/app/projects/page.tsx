"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Search } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { fetchProjects } from "@/lib/projects";
import { useProjectStore } from "@/lib/store";

const statusBadgeVariant: Record<
  string,
  "default" | "success" | "warning" | "danger" | "accent"
> = {
  draft: "default",
  writing: "warning",
  editing: "warning",
  producing: "accent",
  exported: "success",
};

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { projects, setProjects, setCurrentProject } = useProjectStore();

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProjects();
        if (!active) return;
        setProjects(data);
      } catch (err: any) {
        if (!active) return;
        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Nao foi possivel carregar os projetos."
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

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Meus Projetos</h1>
            <p className="mt-1 text-sm text-text-secondary">
              {loading ? "Carregando..." : `${filteredProjects.length} projetos encontrados`}
            </p>
          </div>
          <Link href="/projects/new">
            <Button variant="accent">+ Novo Projeto</Button>
          </Link>
        </div>

        <div className="rounded-xs border border-border bg-bg-surface p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <Input
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os Status</option>
              <option value="draft">Rascunho</option>
              <option value="writing">Escrita</option>
              <option value="editing">Edicao</option>
              <option value="producing">Producao</option>
              <option value="exported">Exportado</option>
            </Select>
          </div>
        </div>

        {error && (
          <div className="rounded-xs border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              onClick={() => setCurrentProject(project)}
            >
              <Card
                interactive
                className="h-full transition-all hover:border-border-active"
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-text-primary">
                        {project.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="accent" size="sm">
                          {project.type}
                        </Badge>
                        <Badge
                          variant={statusBadgeVariant[project.status] || "default"}
                          size="sm"
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-sm text-text-muted">Modo Narrativo</p>
                      <p className="text-sm font-medium text-text-primary">
                        {project.narrativeMode}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-border pt-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock size={16} className="text-text-muted" />
                        <span className="text-text-secondary">
                          {project.duration}
                          <span className="text-text-muted">min</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar size={16} className="text-text-muted" />
                        <span className="text-xs text-text-secondary">
                          {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" className="w-full justify-center">
                      Abrir Projeto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {!loading && filteredProjects.length === 0 && !error && (
          <div className="py-12 text-center">
            <p className="mb-4 text-text-muted">Nenhum projeto encontrado</p>
            <Link href="/projects/new">
              <Button variant="accent">Criar Primeiro Projeto</Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
