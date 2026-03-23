"use client";

import React from "react";
import { GripVertical, Clock, Mic2, Image as ImageIcon, MoreVertical } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mockTimeline = [
  {
    id: "1",
    number: 1,
    title: "Introdução: O Começo do Streaming",
    type: "intro",
    duration: 5,
    voiceStatus: "completed",
    assetCount: 3,
    color: "bg-accent",
  },
  {
    id: "2",
    number: 2,
    title: "A Revolução das Plataformas",
    type: "narrative",
    duration: 8,
    voiceStatus: "completed",
    assetCount: 5,
    color: "bg-status-warning",
  },
  {
    id: "3",
    number: 3,
    title: "Impacto Global",
    type: "narrative",
    duration: 6,
    voiceStatus: "processing",
    assetCount: 4,
    color: "bg-status-danger",
  },
  {
    id: "4",
    number: 4,
    title: "O Futuro do Entretenimento",
    type: "conclusion",
    duration: 7,
    voiceStatus: "pending",
    assetCount: 2,
    color: "bg-status-success",
  },
];

const totalDuration = mockTimeline.reduce((sum, ch) => sum + ch.duration, 0);

const typeLabels: Record<string, string> = {
  intro: "Introdução",
  narrative: "Narrativa",
  conclusion: "Conclusão",
};

const voiceStatusLabels: Record<string, string> = {
  completed: "✓ Concluído",
  processing: "⏳ Processando",
  pending: "○ Pendente",
};

const voiceStatusColors: Record<string, string> = {
  completed: "text-status-success",
  processing: "text-status-warning",
  pending: "text-text-muted",
};

export default function TimelinePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Timeline</h1>
            <p className="text-text-secondary text-sm mt-1">
              Organize e visualize os capítulos do seu projeto
            </p>
          </div>
          <Button variant="accent">+ Adicionar Capítulo</Button>
        </div>

        {/* Total Duration */}
        <Card className="bg-gradient-to-r from-accent/10 to-accent-glow/10 border-accent/30">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Clock size={24} className="text-accent" />
              <div>
                <p className="text-text-muted text-sm">Duração Total</p>
                <p className="text-2xl font-bold text-text-primary">
                  {totalDuration} minutos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horizontal Timeline View */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visualização Horizontal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end space-x-2 overflow-x-auto pb-4">
              {mockTimeline.map((chapter) => (
                <div
                  key={chapter.id}
                  className="flex-shrink-0 flex flex-col items-center space-y-2"
                  title={chapter.title}
                >
                  <div className="relative group">
                    <div
                      className={cn(
                        "w-12 transition-all hover:w-16 cursor-pointer rounded-xs shadow-lg",
                        chapter.color
                      )}
                      style={{
                        height: `${chapter.duration * 10}px`,
                      }}
                    />
                    <div className="absolute left-0 -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-surface-3 border border-border rounded-xs p-2 whitespace-nowrap text-xs text-text-primary z-10">
                      <p className="font-semibold">{chapter.title}</p>
                      <p className="text-text-muted">{chapter.duration}min</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-text-secondary">
                    {chapter.number}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Timeline */}
        <div className="space-y-3">
          {mockTimeline.map((chapter, idx) => (
            <Card key={chapter.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Left Side */}
                <div className="flex items-center space-x-4 flex-1">
                  <GripVertical
                    size={20}
                    className="text-text-muted cursor-grab active:cursor-grabbing flex-shrink-0"
                  />

                  <div
                    className={cn(
                      "w-3 h-3 rounded-full flex-shrink-0",
                      chapter.color
                    )}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-bold text-accent w-8">
                        {chapter.number}
                      </span>
                      <h3 className="font-semibold text-text-primary truncate">
                        {chapter.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-text-secondary ml-10">
                      <Badge variant="default" size="sm">
                        {typeLabels[chapter.type]}
                      </Badge>
                      <span className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{chapter.duration}min</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center space-x-4">
                  {/* Voice Status */}
                  <div className="text-right">
                    <div className="flex items-center space-x-1 justify-end mb-1">
                      <Mic2 size={14} className="text-text-muted" />
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          voiceStatusColors[chapter.voiceStatus]
                        )}
                      >
                        {voiceStatusLabels[chapter.voiceStatus]}
                      </span>
                    </div>
                    <span className="text-xs text-text-muted">Narração</span>
                  </div>

                  {/* Asset Count */}
                  <div className="text-right">
                    <div className="flex items-center space-x-1 justify-end mb-1">
                      <ImageIcon size={14} className="text-text-muted" />
                      <span className="text-xs font-semibold text-text-primary">
                        {chapter.assetCount}
                      </span>
                    </div>
                    <span className="text-xs text-text-muted">Ativos</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-20 h-1.5 bg-bg-surface-2 rounded-xs overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{
                        width: `${chapter.voiceStatus === "completed" ? 100 : chapter.voiceStatus === "processing" ? 50 : 0}%`,
                      }}
                    />
                  </div>

                  {/* Menu */}
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Legenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full" />
                <span className="text-text-secondary">Introdução</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-status-warning rounded-full" />
                <span className="text-text-secondary">Narrativa</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-status-danger rounded-full" />
                <span className="text-text-secondary">Narrativa 2</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-status-success rounded-full" />
                <span className="text-text-secondary">Conclusão</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
