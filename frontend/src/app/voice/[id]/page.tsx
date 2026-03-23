"use client";

import React, { useState } from "react";
import { Play, RotateCcw, Download, Zap } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

const mockChapters = [
  {
    id: "1",
    number: 1,
    title: "Introdução: O Começo do Streaming",
    text: "Há menos de duas décadas, o conceito de assistir vídeos sob demanda era considerado uma ficção científica...",
    duration: 5,
    status: "completed",
    voiceModel: "David - Profissional",
  },
  {
    id: "2",
    number: 2,
    title: "A Revolução das Plataformas",
    text: "Com o surgimento da Netflix em 2007, o mercado começou a se transformar radicalmente...",
    duration: 8,
    status: "completed",
    voiceModel: "Sofia - Natural",
  },
  {
    id: "3",
    number: 3,
    title: "Impacto Global",
    text: "O efeito dessa transformação ultrapassou as fronteiras e chegou a todos os continentes...",
    duration: 6,
    status: "processing",
    voiceModel: "Carlos - Formal",
  },
  {
    id: "4",
    number: 4,
    title: "O Futuro do Entretenimento",
    text: "Qual será o próximo passo nessa evolução que mudou como consumimos conteúdo?...",
    duration: 7,
    status: "pending",
    voiceModel: "Não selecionado",
  },
];

const voiceModels = [
  "David - Profissional",
  "Sofia - Natural",
  "Carlos - Formal",
  "Marina - Entusiasmada",
  "Roberto - Reflexivo",
];

const statusBadgeVariant: Record<string, "success" | "warning" | "default"> = {
  completed: "success",
  processing: "warning",
  pending: "default",
};

const statusLabels: Record<string, string> = {
  completed: "Concluído",
  processing: "Processando",
  pending: "Pendente",
};

export default function VoiceStudioPage({
  params,
}: {
  params: { id: string };
}) {
  const [selectedVoices, setSelectedVoices] = useState<Record<string, string>>({
    "1": "David - Profissional",
    "2": "Sofia - Natural",
    "3": "Carlos - Formal",
    "4": "Não selecionado",
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Studio de Voz
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Gere e personalize narração com inteligência artificial
            </p>
          </div>
          <Button variant="accent" className="space-x-2">
            <Zap size={18} />
            <span>Gerar Todas as Vozes</span>
          </Button>
        </div>

        {/* Voice Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configurações de Voz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Idioma
                </label>
                <Select defaultValue="pt-BR">
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="pt-PT">Português (Portugal)</option>
                  <option value="en-US">English</option>
                  <option value="es-ES">Español</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Velocidade
                </label>
                <Select defaultValue="normal">
                  <option value="slow">Lenta</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Rápida</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Tom Emocional
                </label>
                <Select defaultValue="neutral">
                  <option value="neutral">Neutro</option>
                  <option value="enthusiastic">Entusiasmado</option>
                  <option value="calm">Calmo</option>
                  <option value="dramatic">Dramático</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chapters */}
        <div className="space-y-3">
          {mockChapters.map((chapter) => (
            <Card key={chapter.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg font-bold text-accent w-8 text-center">
                      {chapter.number}
                    </span>
                    <div>
                      <h3 className="font-semibold text-text-primary">
                        {chapter.title}
                      </h3>
                      <p className="text-xs text-text-muted">
                        {chapter.duration} minutos estimados
                      </p>
                    </div>
                  </div>

                  {/* Text Preview */}
                  <p className="text-sm text-text-secondary mb-3 ml-11 line-clamp-2">
                    {chapter.text}
                  </p>

                  {/* Voice Model Selection */}
                  <div className="ml-11 space-y-2">
                    <label className="block text-xs text-text-muted">
                      Selecionar modelo de voz:
                    </label>
                    <Select
                      value={selectedVoices[chapter.id]}
                      onChange={(e) =>
                        setSelectedVoices((prev) => ({
                          ...prev,
                          [chapter.id]: e.target.value,
                        }))
                      }
                    >
                      {voiceModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  {/* Status Badge */}
                  <Badge variant={statusBadgeVariant[chapter.status]}>
                    {statusLabels[chapter.status]}
                  </Badge>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    {chapter.status === "completed" ? (
                      <>
                        <Button variant="ghost" size="sm" className="space-x-2">
                          <Play size={16} />
                          <span>Ouvir</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="space-x-2">
                          <Download size={16} />
                          <span>Baixar</span>
                        </Button>
                      </>
                    ) : chapter.status === "processing" ? (
                      <Button variant="ghost" size="sm" disabled>
                        Processando...
                      </Button>
                    ) : (
                      <Button variant="accent" size="sm" className="space-x-2">
                        <Zap size={16} />
                        <span>Gerar</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo de Geração</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="bg-bg-surface-2 rounded-xs p-3 text-center">
              <p className="text-text-muted text-xs mb-1">Concluídos</p>
              <p className="text-2xl font-bold text-status-success">2/4</p>
            </div>
            <div className="bg-bg-surface-2 rounded-xs p-3 text-center">
              <p className="text-text-muted text-xs mb-1">Processando</p>
              <p className="text-2xl font-bold text-status-warning">1/4</p>
            </div>
            <div className="bg-bg-surface-2 rounded-xs p-3 text-center">
              <p className="text-text-muted text-xs mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-status-danger">1/4</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
