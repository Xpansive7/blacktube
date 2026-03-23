"use client";

import React, { useState } from "react";
import { Download, FileJson, FileText, Eye, Trash2, Clock, CheckCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const exportTypes = [
  {
    id: "json",
    name: "Exportar como JSON",
    icon: FileJson,
    description: "Estrutura completa do projeto em formato JSON",
    size: "2.4 MB",
    format: ".json",
  },
  {
    id: "txt",
    name: "Exportar como TXT",
    icon: FileText,
    description: "Roteiro completo em texto simples",
    size: "850 KB",
    format: ".txt",
  },
  {
    id: "render",
    name: "Plano de Renderização",
    icon: Eye,
    description: "Especificações técnicas para renderização de vídeo",
    size: "1.2 MB",
    format: ".pdf",
  },
];

const mockExportHistory = [
  {
    id: "1",
    name: "A Revolução do Streaming - JSON",
    type: "JSON",
    status: "completed",
    date: "2024-03-15 14:30",
    size: "2.4 MB",
    duration: "2min 34s",
  },
  {
    id: "2",
    name: "A Revolução do Streaming - TXT",
    type: "TXT",
    status: "completed",
    date: "2024-03-15 14:15",
    size: "850 KB",
    duration: "45s",
  },
  {
    id: "3",
    name: "A Revolução do Streaming - Render Plan",
    type: "PDF",
    status: "processing",
    date: "2024-03-15 14:00",
    size: "—",
    duration: "Processando...",
  },
  {
    id: "4",
    name: "A Revolução do Streaming - JSON",
    type: "JSON",
    status: "completed",
    date: "2024-03-14 09:20",
    size: "2.3 MB",
    duration: "2min 12s",
  },
];

const statusBadgeVariant: Record<string, "success" | "warning" | "default" | "danger"> = {
  completed: "success",
  processing: "warning",
  failed: "danger",
};

const statusLabels: Record<string, string> = {
  completed: "Concluído",
  processing: "Processando",
  failed: "Falhou",
};

export default function ExportPage({ params }: { params: { id: string } }) {
  const [selectedType, setSelectedType] = useState("");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Exportar Projeto</h1>
          <p className="text-text-secondary text-sm mt-1">
            Exporte seu projeto em diferentes formatos para distribuição e processamento
          </p>
        </div>

        {/* Export Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.id}
                interactive
                className={selectedType === type.id ? "border-border-active" : ""}
                onClick={() => setSelectedType(type.id)}
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-accent/20 rounded-xs flex items-center justify-center">
                      <Icon size={24} className="text-accent" />
                    </div>

                    {/* Title and Description */}
                    <div>
                      <h3 className="font-bold text-text-primary mb-1">
                        {type.name}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {type.description}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="bg-bg-surface-2 rounded-xs p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted">Formato</span>
                        <code className="font-mono text-text-primary">
                          {type.format}
                        </code>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted">Tamanho Estimado</span>
                        <span className="font-mono text-text-primary">
                          {type.size}
                        </span>
                      </div>
                    </div>

                    {/* Export Button */}
                    <Button
                      variant={selectedType === type.id ? "accent" : "ghost"}
                      className="w-full justify-center space-x-2"
                    >
                      <Download size={16} />
                      <span>Exportar</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Export Settings */}
        {selectedType && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Opções de Exportação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded-xs border border-border bg-bg-surface cursor-pointer accent-accent"
                  />
                  <span className="text-sm text-text-primary">
                    Incluir Metadados Completos
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded-xs border border-border bg-bg-surface cursor-pointer accent-accent"
                  />
                  <span className="text-sm text-text-primary">
                    Incluir Histórico de Versões
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-xs border border-border bg-bg-surface cursor-pointer accent-accent"
                  />
                  <span className="text-sm text-text-primary">
                    Comprimir Arquivo
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export History */}
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-4">
            Histórico de Exportações
          </h3>

          <div className="space-y-3">
            {mockExportHistory.map((export_) => (
              <Card key={export_.id} className="p-4">
                <div className="flex items-center justify-between">
                  {/* Left Side */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-text-primary">
                        {export_.name}
                      </h4>
                      <Badge variant="default" size="sm">
                        {export_.type}
                      </Badge>
                      <Badge
                        variant={statusBadgeVariant[export_.status] || "default"}
                        size="sm"
                      >
                        {statusLabels[export_.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                      <span>{export_.date}</span>
                      <span className="font-mono">{export_.size}</span>
                      <span className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{export_.duration}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center space-x-2">
                    {export_.status === "completed" && (
                      <>
                        <Button variant="ghost" size="sm">
                          <Download size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye size={16} />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
