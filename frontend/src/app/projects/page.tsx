"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Clock,
  Calendar,
  User,
  MoreVertical,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const mockProjects = [
  {
    id: "1",
    title: "A Revolução do Streaming",
    type: "Documentário",
    status: "Em Produção",
    mode: "Épico",
    duration: 45,
    date: "2024-03-15",
    creator: "João Silva",
    color: "accent",
  },
  {
    id: "2",
    title: "Inovação Tecnológica",
    type: "Série",
    status: "Roteiro",
    mode: "Dramatizado",
    duration: 120,
    date: "2024-03-10",
    creator: "Maria Santos",
    color: "success",
  },
  {
    id: "3",
    title: "Jornada do Empreendedor",
    type: "Documentário",
    status: "Publicado",
    mode: "Inspirador",
    duration: 60,
    date: "2024-02-28",
    creator: "Pedro Costa",
    color: "default",
  },
  {
    id: "4",
    title: "Histórias de Impacto Social",
    type: "Documentário",
    status: "Revisão",
    mode: "Emocional",
    duration: 30,
    date: "2024-03-01",
    creator: "Ana Lima",
    color: "warning",
  },
  {
    id: "5",
    title: "Futuros Possíveis",
    type: "Série",
    status: "Planejamento",
    mode: "Especulativo",
    duration: 180,
    date: "2024-03-12",
    creator: "Carlos Oliveira",
    color: "danger",
  },
  {
    id: "6",
    title: "Vidas que Mudam",
    type: "Documentário",
    status: "Em Produção",
    mode: "Comovente",
    duration: 50,
    date: "2024-03-08",
    creator: "Fernanda Dias",
    color: "accent",
  },
];

const statusBadgeVariant: Record<string, "default" | "success" | "warning" | "danger" | "accent"> = {
  "Em Produção": "accent",
  "Roteiro": "warning",
  "Publicado": "success",
  "Revisão": "warning",
  "Planejamento": "danger",
};

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    const matchesType = !typeFilter || project.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header with New Project Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Meus Projetos</h1>
            <p className="text-text-secondary text-sm mt-1">
              {filteredProjects.length} projetos encontrados
            </p>
          </div>
          <Link href="/projects/new">
            <Button variant="accent">+ Novo Projeto</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-bg-surface border border-border rounded-xs p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
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

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os Status</option>
              <option value="Em Produção">Em Produção</option>
              <option value="Roteiro">Roteiro</option>
              <option value="Publicado">Publicado</option>
              <option value="Revisão">Revisão</option>
              <option value="Planejamento">Planejamento</option>
            </Select>

            {/* Type Filter */}
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Todos os Tipos</option>
              <option value="Documentário">Documentário</option>
              <option value="Série">Série</option>
              <option value="Curta">Curta</option>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card
                interactive
                className="h-full hover:border-border-active transition-all"
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Title and Type */}
                    <div>
                      <h3 className="text-lg font-bold text-text-primary mb-2">
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

                    {/* Mode */}
                    <div>
                      <p className="text-sm text-text-muted mb-1">Modo Narrativo</p>
                      <p className="text-sm font-medium text-text-primary">
                        {project.mode}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock size={16} className="text-text-muted" />
                        <span className="text-text-secondary">
                          {project.duration}
                          <span className="text-text-muted">min</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar size={16} className="text-text-muted" />
                        <span className="text-text-secondary text-xs">
                          {new Date(project.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <User size={16} className="text-text-muted" />
                        <span className="text-text-secondary text-xs truncate">
                          {project.creator}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button variant="ghost" size="sm" className="w-full justify-center">
                      Abrir Projeto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted mb-4">Nenhum projeto encontrado</p>
            <Link href="/projects/new">
              <Button variant="accent">Criar Primeiro Projeto</Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
