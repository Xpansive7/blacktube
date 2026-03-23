"use client";

import React from "react";
import { Zap, TrendingUp, Play, Download } from "lucide-react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const mockStats = [
  { label: "Projetos Totais", value: "12", icon: TrendingUp },
  { label: "Scripts Ativos", value: "8", icon: Play },
  { label: "Oportunidades Mineradas", value: "145", icon: Zap },
  { label: "Exportações", value: "34", icon: Download },
];

const mockProjects = [
  {
    id: "1",
    title: "A Revolução do Streaming",
    type: "Documentary",
    status: "Em Produção",
    mode: "Épico",
    duration: 45,
    date: "2024-03-15",
  },
  {
    id: "2",
    title: "Inovação Tecnológica",
    type: "Series",
    status: "Roteiro",
    mode: "Dramatizado",
    duration: 120,
    date: "2024-03-10",
  },
  {
    id: "3",
    title: "Jornada do Empreendedor",
    type: "Documentary",
    status: "Publicado",
    mode: "Inspirador",
    duration: 60,
    date: "2024-02-28",
  },
];

const quickActions = [
  { icon: "📋", label: "Novo Projeto", href: "/projects/new" },
  { icon: "⚡", label: "Minerar Oportunidades", href: "/mining" },
  { icon: "✍️", label: "Gerar Script", href: "/scripts" },
  { icon: "📤", label: "Exportar", href: "/export" },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            Bem-vindo ao BlackTube
          </h2>
          <p className="text-text-secondary">
            Sua plataforma de mineração e criação de narrativas com IA
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-text-muted text-sm mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-text-primary">
                        {stat.value}
                      </p>
                    </div>
                    <Icon size={24} className="text-accent opacity-60" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-4">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Card interactive className="h-24 flex flex-col items-center justify-center text-center">
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <p className="text-sm text-text-primary font-medium">
                    {action.label}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
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
            {mockProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card interactive className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-text-primary font-semibold">
                          {project.title}
                        </h4>
                        <Badge variant="accent" size="sm">
                          {project.type}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-text-secondary">
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-status-success"></span>
                          <span>{project.status}</span>
                        </span>
                        <span>{project.mode}</span>
                        <span className="font-mono">{project.duration}min</span>
                        <span className="text-text-muted">
                          {new Date(project.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Summary */}
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-4">
            Resumo de Atividade
          </h3>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">
                      Scripts Gerados (Semana)
                    </span>
                    <span className="text-sm font-mono text-text-primary">
                      7/10
                    </span>
                  </div>
                  <Progress value={70} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">
                      Exportações Concluídas
                    </span>
                    <span className="text-sm font-mono text-text-primary">
                      34/40
                    </span>
                  </div>
                  <Progress value={85} variant="success" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">
                      Taxa de Sucesso (Mineração)
                    </span>
                    <span className="text-sm font-mono text-text-primary">
                      92%
                    </span>
                  </div>
                  <Progress value={92} variant="success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
