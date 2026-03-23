"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2, Save, Zap } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  APIServiceId,
  APIServiceSetting,
  fetchApiSettings,
  saveApiSetting,
  testApiSetting,
} from "@/lib/api-settings";

const serviceCatalog: Array<{
  id: APIServiceId;
  name: string;
  description: string;
}> = [
  { id: "tmdb", name: "TMDb", description: "Dados sobre filmes e series" },
  { id: "youtube", name: "YouTube Data API", description: "Dados de videos e canais do YouTube" },
  { id: "pexels", name: "Pexels API", description: "Busca de imagens e videos cinematicos" },
  { id: "openai", name: "OpenAI API", description: "Geracao de conteudo e automacoes com IA" },
  { id: "elevenlabs", name: "ElevenLabs API", description: "Studio de voz e narracao com IA" },
];

const emptyState: Record<APIServiceId, APIServiceSetting> = {
  tmdb: { service: "tmdb", api_key: "", is_active: false, configured: false, source: "unset", updated_at: null },
  youtube: { service: "youtube", api_key: "", is_active: false, configured: false, source: "unset", updated_at: null },
  pexels: { service: "pexels", api_key: "", is_active: false, configured: false, source: "unset", updated_at: null },
  openai: { service: "openai", api_key: "", is_active: false, configured: false, source: "unset", updated_at: null },
  elevenlabs: { service: "elevenlabs", api_key: "", is_active: false, configured: false, source: "unset", updated_at: null },
};

function statusVariant(setting: APIServiceSetting): "success" | "warning" | "default" {
  if (setting.configured) return "success";
  return "warning";
}

function statusLabel(setting: APIServiceSetting): string {
  if (!setting.configured) return "Nao configurada";
  return setting.source === "env" ? "Vindo do ambiente" : "Configurada no usuario";
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<APIServiceId, APIServiceSetting>>(emptyState);
  const [drafts, setDrafts] = useState<Record<APIServiceId, string>>({
    tmdb: "",
    youtube: "",
    pexels: "",
    openai: "",
    elevenlabs: "",
  });
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<APIServiceId | null>(null);
  const [testingId, setTestingId] = useState<APIServiceId | null>(null);
  const [messages, setMessages] = useState<Record<string, { ok: boolean; text: string }>>({});

  const apiBaseUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_URL || "backend nao configurado no frontend";
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchApiSettings();
        const merged = { ...emptyState, ...data } as Record<APIServiceId, APIServiceSetting>;
        setSettings(merged);
        setDrafts({
          tmdb: merged.tmdb.api_key || "",
          youtube: merged.youtube.api_key || "",
          pexels: merged.pexels.api_key || "",
          openai: merged.openai.api_key || "",
          elevenlabs: merged.elevenlabs.api_key || "",
        });
      } catch (error) {
        setMessages({
          page: { ok: false, text: "Nao foi possivel carregar as configuracoes da conta." },
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const toggleKeyVisibility = (id: APIServiceId) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateDraft = (id: APIServiceId, value: string) => {
    setDrafts((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id: APIServiceId) => {
    setSavingId(id);
    try {
      const saved = await saveApiSetting(id, drafts[id]);
      setSettings((prev) => ({ ...prev, [id]: saved }));
      setMessages((prev) => ({
        ...prev,
        [id]: { ok: true, text: "Chave salva com sucesso." },
      }));
    } catch (error) {
      setMessages((prev) => ({
        ...prev,
        [id]: { ok: false, text: "Falha ao salvar a chave." },
      }));
    } finally {
      setSavingId(null);
    }
  };

  const handleTest = async (id: APIServiceId) => {
    setTestingId(id);
    try {
      const result = await testApiSetting(id);
      setMessages((prev) => ({
        ...prev,
        [id]: { ok: result.ok, text: result.message },
      }));
    } catch (error) {
      setMessages((prev) => ({
        ...prev,
        [id]: { ok: false, text: "Falha ao testar a conexao." },
      }));
    } finally {
      setTestingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Configuracoes</h1>
          <p className="text-text-secondary text-sm mt-1">
            Conecte as APIs que alimentam mineracao, assets, voz e exportacao.
          </p>
        </div>

        {messages.page && (
          <Card className="border-status-danger/30">
            <CardContent className="pt-6 text-sm text-status-danger">
              {messages.page.text}
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {serviceCatalog.map((service) => {
            const setting = settings[service.id];
            const message = messages[service.id];

            return (
              <Card key={service.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-text-primary">{service.name}</h3>
                      <p className="text-sm text-text-secondary mt-1">{service.description}</p>
                    </div>
                    <Badge variant={statusVariant(setting)}>{statusLabel(setting)}</Badge>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-text-secondary">
                      Chave da API
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type={visibleKeys[service.id] ? "text" : "password"}
                        value={drafts[service.id]}
                        onChange={(event) => updateDraft(service.id, event.target.value)}
                        placeholder={`Cole a chave de ${service.name}`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(service.id)}
                        title={visibleKeys[service.id] ? "Ocultar chave" : "Mostrar chave"}
                      >
                        {visibleKeys[service.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => handleSave(service.id)}
                        disabled={savingId === service.id || !drafts[service.id].trim()}
                      >
                        {savingId === service.id ? <Loader2 size={14} className="animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
                        Salvar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTest(service.id)}
                        disabled={testingId === service.id || !drafts[service.id].trim()}
                      >
                        {testingId === service.id ? <Loader2 size={14} className="animate-spin mr-2" /> : <Zap size={14} className="mr-2" />}
                        Testar conexao
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-text-muted space-y-1">
                    <p>Origem atual: {setting.source}</p>
                    {setting.updated_at && <p>Ultima atualizacao: {new Date(setting.updated_at).toLocaleString("pt-BR")}</p>}
                  </div>

                  {message && (
                    <div className={`flex items-start gap-2 text-sm ${message.ok ? "text-status-success" : "text-status-danger"}`}>
                      {message.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                      <span>{message.text}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ambiente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                URL da API usada pelo frontend
              </label>
              <Input type="text" value={apiBaseUrl} disabled className="bg-bg-surface-2" />
            </div>
            <p className="text-sm text-text-secondary">
              Para o app funcionar em producao, o frontend precisa apontar para um backend publicado e autenticado.
            </p>
          </CardContent>
        </Card>

        <Card className="border-status-danger/30">
          <CardHeader>
            <CardTitle className="text-status-danger">Zona de perigo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-text-secondary">
              Ainda falta separar backend de producao, endurecer segredos e conectar servicos reais de voz e render.
            </p>
          </CardContent>
        </Card>

        {loading && (
          <div className="text-sm text-text-secondary flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Carregando configuracoes...
          </div>
        )}
      </div>
    </AppLayout>
  );
}

