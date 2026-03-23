"use client";

import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const apiServices = [
  {
    id: "tmdb",
    name: "TMDb (The Movie Database)",
    description: "Dados sobre filmes e séries",
    status: "connected",
    apiKey: "••••••••••••••••••••••••••••••••••••••",
    testStatus: "success",
  },
  {
    id: "youtube",
    name: "YouTube Data API",
    description: "Acesso a dados de vídeos do YouTube",
    status: "connected",
    apiKey: "••••••••••••••••••••••••••••••••••••••",
    testStatus: "success",
  },
  {
    id: "pexels",
    name: "Pexels API",
    description: "Banco de imagens de alta qualidade",
    status: "connected",
    apiKey: "••••••••••••••••••••••••••••••••••••••",
    testStatus: "success",
  },
  {
    id: "openai",
    name: "OpenAI API",
    description: "Inteligência artificial para geração de conteúdo",
    status: "connected",
    apiKey: "••••••••••••••••••••••••••••••••••••••",
    testStatus: "success",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs API",
    description: "Geração de voz realista com IA",
    status: "pending",
    apiKey: "",
    testStatus: "pending",
  },
];

const statusBadgeVariant: Record<string, "success" | "warning" | "default" | "danger"> = {
  connected: "success",
  pending: "warning",
  failed: "danger",
};

const statusLabels: Record<string, string> = {
  connected: "Conectado",
  pending: "Pendente",
  failed: "Falhou",
};

export default function SettingsPage() {
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Configurações</h1>
          <p className="text-text-secondary text-sm mt-1">
            Gerencie suas chaves de API e integrações
          </p>
        </div>

        {/* API Services */}
        <div className="space-y-4">
          {apiServices.map((service) => (
            <Card key={service.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-text-primary mb-1">
                        {service.name}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {service.description}
                      </p>
                    </div>
                    <Badge
                      variant={statusBadgeVariant[service.status] || "default"}
                    >
                      {statusLabels[service.status]}
                    </Badge>
                  </div>

                  <Separator />

                  {/* API Key Input */}
                  {editingKey === service.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Chave de API
                        </label>
                        <Input
                          type="password"
                          placeholder="Cole sua chave de API aqui"
                          defaultValue={service.apiKey}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={() => setEditingKey(null)}
                        >
                          Salvar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingKey(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-bg-surface-2 rounded-xs p-3">
                      <div className="flex items-center space-x-2 flex-1">
                        <code className="text-sm text-text-secondary font-mono">
                          {visibleKeys[service.id]
                            ? service.apiKey.replace(/•/g, "*")
                            : service.apiKey}
                        </code>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleKeyVisibility(service.id)}
                          className="p-1 hover:bg-bg-surface rounded-xs transition-colors"
                          title={
                            visibleKeys[service.id]
                              ? "Ocultar chave"
                              : "Mostrar chave"
                          }
                        >
                          {visibleKeys[service.id] ? (
                            <EyeOff size={16} className="text-text-muted" />
                          ) : (
                            <Eye size={16} className="text-text-muted" />
                          )}
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingKey(service.id)}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Test Connection */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {service.testStatus === "success" ? (
                        <>
                          <CheckCircle size={16} className="text-status-success" />
                          <span className="text-sm text-status-success">
                            Conexão Testada com Sucesso
                          </span>
                        </>
                      ) : service.testStatus === "pending" ? (
                        <>
                          <AlertCircle size={16} className="text-status-warning" />
                          <span className="text-sm text-status-warning">
                            Aguardando Configuração
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={16} className="text-status-danger" />
                          <span className="text-sm text-status-danger">
                            Falha na Conexão
                          </span>
                        </>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="space-x-2"
                      disabled={service.status === "pending"}
                    >
                      <Zap size={14} />
                      <span>Testar Conexão</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle>Variáveis de Ambiente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                URL da API
              </label>
              <Input
                type="text"
                defaultValue="http://localhost:8000"
                disabled
                className="bg-bg-surface-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Ambiente
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-primary font-mono">
                  development
                </span>
                <Badge variant="warning">Desenvolvimento</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded-xs border border-border bg-bg-surface cursor-pointer accent-accent"
              />
              <span className="text-sm text-text-primary">
                Notificações de Progresso
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded-xs border border-border bg-bg-surface cursor-pointer accent-accent"
              />
              <span className="text-sm text-text-primary">
                Salvar Automaticamente
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded-xs border border-border bg-bg-surface cursor-pointer accent-accent"
              />
              <span className="text-sm text-text-primary">
                Enviar Relatórios de Erro
              </span>
            </label>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-status-danger/30">
          <CardHeader>
            <CardTitle className="text-status-danger">Zona de Perigo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-text-secondary">
              Estas ações são permanentes e não podem ser desfeitas.
            </p>
            <Button variant="danger" className="w-full justify-center">
              Limpar Cache Local
            </Button>
            <Button variant="danger" className="w-full justify-center">
              Redefinir Todas as Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
