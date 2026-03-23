"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, MoreVertical, Share2, Download } from "lucide-react";

const mockProject = {
  id: "1",
  title: "A Revolução do Streaming",
  type: "Documentário",
  status: "Em Produção",
  mode: "Épico",
  duration: 45,
  date: "2024-03-15",
  synopsis:
    "Uma exploração profunda da transformação digital no entretenimento e como as plataformas de streaming estão redefinindo a indústria.",
  narrativeMode: "epic",
  awarenessLevel: 8,
  targetDuration: 45,
  visualPreset: "cinematic",
  progress: 65,
  chapters: 8,
  voiceStatus: "5 de 8 completo",
  assistsCount: 24,
  stats: {
    scriptWords: 8234,
    estimatedDuration: "42 minutos",
    retentionScore: 92,
    emotionalIntensity: 8,
  },
};

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {mockProject.title}
            </h1>
            <p className="text-text-secondary">{mockProject.synopsis}</p>
            <div className="flex items-center space-x-2 mt-3">
              <Badge variant="accent">{mockProject.type}</Badge>
              <Badge variant="success">{mockProject.status}</Badge>
              <Badge>{mockProject.mode}</Badge>
            </div>
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

        {/* Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="script">Roteiro</TabsTrigger>
            <TabsTrigger value="assets">Ativos</TabsTrigger>
            <TabsTrigger value="voice">Voz</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Progresso Geral</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-secondary">
                          Projeto Completo
                        </span>
                        <span className="text-sm font-mono text-text-primary">
                          {mockProject.progress}%
                        </span>
                      </div>
                      <Progress value={mockProject.progress} />
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-text-muted text-xs mb-1">Capítulos</p>
                        <p className="text-lg font-bold text-text-primary">
                          {mockProject.chapters}
                        </p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs mb-1">
                          Status de Voz
                        </p>
                        <p className="text-lg font-bold text-text-primary">
                          {mockProject.voiceStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs mb-1">Ativos</p>
                        <p className="text-lg font-bold text-text-primary">
                          {mockProject.assistsCount}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Project Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Informações do Projeto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-text-muted text-sm mb-1">
                          Tipo Narrativo
                        </p>
                        <p className="text-text-primary font-medium">
                          {mockProject.narrativeMode}
                        </p>
                      </div>
                      <div>
                        <p className="text-text-muted text-sm mb-1">
                          Nível de Consciência
                        </p>
                        <p className="text-text-primary font-medium">
                          {mockProject.awarenessLevel}/10
                        </p>
                      </div>
                      <div>
                        <p className="text-text-muted text-sm mb-1">
                          Duração-Alvo
                        </p>
                        <p className="text-text-primary font-medium">
                          {mockProject.targetDuration} minutos
                        </p>
                      </div>
                      <div>
                        <p className="text-text-muted text-sm mb-1">
                          Preset Visual
                        </p>
                        <p className="text-text-primary font-medium">
                          {mockProject.visualPreset}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-bg-surface-2 rounded-xs">
                        <span className="text-sm text-text-secondary">
                          Palavras no Script
                        </span>
                        <span className="font-mono font-bold text-text-primary">
                          {mockProject.stats.scriptWords.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-bg-surface-2 rounded-xs">
                        <span className="text-sm text-text-secondary">
                          Duração Estimada
                        </span>
                        <span className="font-mono font-bold text-text-primary">
                          {mockProject.stats.estimatedDuration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-bg-surface-2 rounded-xs">
                        <span className="text-sm text-text-secondary">
                          Score de Retenção
                        </span>
                        <span className="font-mono font-bold text-status-success">
                          {mockProject.stats.retentionScore}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-bg-surface-2 rounded-xs">
                        <span className="text-sm text-text-secondary">
                          Intensidade Emocional
                        </span>
                        <span className="font-mono font-bold text-status-danger">
                          {mockProject.stats.emotionalIntensity}/10
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="accent" className="w-full justify-center">
                      ✍️ Editar Roteiro
                    </Button>
                    <Button variant="ghost" className="w-full justify-center">
                      🎙️ Gerar Voz
                    </Button>
                    <Button variant="ghost" className="w-full justify-center">
                      📤 Exportar
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Atividade Recente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2 pb-2 border-b border-border">
                      <span className="text-text-muted">• </span>
                      <div>
                        <p className="text-text-primary">Capítulo 3 Finalizado</p>
                        <p className="text-text-muted text-xs">há 2 horas</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 pb-2 border-b border-border">
                      <span className="text-text-muted">• </span>
                      <div>
                        <p className="text-text-primary">Voz Gerada (Cap 1-2)</p>
                        <p className="text-text-muted text-xs">há 4 horas</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-text-muted">• </span>
                      <div>
                        <p className="text-text-primary">Projeto Criado</p>
                        <p className="text-text-muted text-xs">há 2 dias</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Script Tab */}
          <TabsContent value="script">
            <Card>
              <CardHeader>
                <CardTitle>Roteiro</CardTitle>
                <CardDescription>Acesse o editor completo de roteiro</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="accent" className="space-x-2">
                  <span>Abrir Editor de Roteiro</span>
                  <Edit size={16} />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets">
            <Card>
              <CardHeader>
                <CardTitle>Ativos e Mídia</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-text-muted mb-4">
                  Nenhum ativo vinculado ainda
                </p>
                <Button variant="accent">+ Adicionar Ativo</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voice Tab */}
          <TabsContent value="voice">
            <Card>
              <CardHeader>
                <CardTitle>Studio de Voz</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-text-muted mb-4">
                  Acesse o studio de voz para gerar narração
                </p>
                <Button variant="accent">Ir para Studio de Voz</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-text-muted mb-4">
                  Visualize e organize seus capítulos na timeline
                </p>
                <Button variant="accent">Abrir Timeline</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Exportar</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-text-muted mb-4">
                  Exporte seu projeto em diferentes formatos
                </p>
                <Button variant="accent" className="space-x-2">
                  <Download size={16} />
                  <span>Ir para Exportação</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
