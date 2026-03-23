"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import api, { assertApiConfigured } from "@/lib/api";
import { mapProject } from "@/lib/projects";
import { useProjectStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const narrativeModes = [
  { id: "padrao", name: "Padrao", description: "Narrativa equilibrada", intensity: 5 },
  { id: "retencao_maxima", name: "Retencao Maxima", description: "Foco em retenção", intensity: 9 },
  { id: "investigativo", name: "Investigativo", description: "Conducao analitica", intensity: 7 },
  { id: "psicologico", name: "Psicologico", description: "Enfase comportamental", intensity: 8 },
  { id: "filosofico", name: "Filosofico", description: "Leitura reflexiva", intensity: 6 },
  { id: "analise_poder", name: "Analise de Poder", description: "Estruturas e influencia", intensity: 8 },
  { id: "teoria", name: "Teoria", description: "Construcao conceitual", intensity: 6 },
  { id: "explicado_simples", name: "Explicado Simples", description: "Didatico e direto", intensity: 4 },
  { id: "autoridade", name: "Autoridade", description: "Tom seguro e professoral", intensity: 7 },
];

const visualPresets = [
  { id: "cinematic", name: "Cinematografico", style: "Cores quentes, contraste alto", colors: ["#FF6B35", "#004E89", "#1B6CA8"], intensity: 8 },
  { id: "minimalist", name: "Minimalista", style: "Simplicidade e elegancia", colors: ["#F5F5F5", "#2C2C2C", "#666666"], intensity: 3 },
  { id: "cyberpunk", name: "Cyberpunk", style: "Neon e futurista", colors: ["#FF006E", "#8338EC", "#3A86FF"], intensity: 9 },
  { id: "naturalistic", name: "Naturalista", style: "Tons terra e organicos", colors: ["#8B7355", "#D2B48C", "#228B22"], intensity: 5 },
];

const projectTypeMap: Record<string, string> = {
  documentary: "documentary",
  series: "series_analysis",
  short: "essay",
  special: "reaction",
};

const awarenessLevelMap: Record<number, string> = {
  1: "unaware",
  2: "unaware",
  3: "problem_aware",
  4: "problem_aware",
  5: "solution_aware",
  6: "solution_aware",
  7: "product_aware",
  8: "product_aware",
  9: "product_aware",
  10: "product_aware",
};

export default function NewProjectPage() {
  const router = useRouter();
  const { setCurrentProject, addProject } = useProjectStore();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    type: "documentary",
    source: "youtube",
    year: new Date().getFullYear(),
    synopsis: "",
    narrativeMode: "padrao",
    awarenessLevel: 5,
    targetDuration: 60,
    visualPreset: "cinematic",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      setError("");
      assertApiConfigured();

      const payload = {
        title: formData.title,
        project_type: projectTypeMap[formData.type] || "documentary",
        source_title: formData.source,
        source_year: formData.year,
        synopsis: formData.synopsis,
        output_language: "pt-BR",
        target_duration_minutes: formData.targetDuration,
        narrative_mode: formData.narrativeMode,
        audience_awareness_level:
          awarenessLevelMap[formData.awarenessLevel] || "solution_aware",
      };

      const response = await api.post("/projects", payload);
      const project = mapProject(response.data);
      addProject(project);
      setCurrentProject(project);
      router.push(`/projects/${project.id}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Nao foi possivel criar o projeto."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-text-primary">
            Criar Novo Projeto
          </h1>
          <p className="text-text-secondary">Passo {step} de 3</p>
        </div>

        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xs font-bold transition-all",
                  step === s
                    ? "bg-accent text-white shadow-lg shadow-accent-glow/30"
                    : step > s
                      ? "bg-status-success text-white"
                      : "bg-bg-surface-2 text-text-muted"
                )}
              >
                {step > s ? "✓" : s}
              </div>
              {s < 3 && (
                <div
                  className={cn(
                    "h-1 flex-1 rounded-xs transition-all",
                    step > s ? "bg-status-success" : "bg-bg-surface-2"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {error && (
          <div className="rounded-xs border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Informacoes Basicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-secondary">
                      Titulo do Projeto
                    </label>
                    <Input
                      placeholder="Ex: A Revolucao do Streaming"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-secondary">
                        Tipo de Conteudo
                      </label>
                      <Select
                        value={formData.type}
                        onChange={(e) => handleInputChange("type", e.target.value)}
                      >
                        <option value="documentary">Documentario</option>
                        <option value="series">Serie</option>
                        <option value="short">Curta</option>
                        <option value="special">Especial</option>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-secondary">
                        Ano de Referencia
                      </label>
                      <Input
                        type="number"
                        value={formData.year}
                        onChange={(e) => handleInputChange("year", parseInt(e.target.value, 10))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-secondary">
                      Fonte Principal
                    </label>
                    <Select
                      value={formData.source}
                      onChange={(e) => handleInputChange("source", e.target.value)}
                    >
                      <option value="youtube">YouTube</option>
                      <option value="article">Artigo</option>
                      <option value="podcast">Podcast</option>
                      <option value="social">Rede Social</option>
                      <option value="news">Noticia</option>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-secondary">
                      Sinopse
                    </label>
                    <Textarea
                      placeholder="Descricao breve do projeto..."
                      value={formData.synopsis}
                      onChange={(e) => handleInputChange("synopsis", e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Modo Narrativo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {narrativeModes.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => handleInputChange("narrativeMode", mode.id)}
                          className={cn(
                            "rounded-xs border-2 p-4 text-left transition-all",
                            formData.narrativeMode === mode.id
                              ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                              : "border-border bg-bg-surface hover:border-border-active"
                          )}
                        >
                          <h4 className="mb-1 font-semibold text-text-primary">{mode.name}</h4>
                          <p className="mb-2 text-xs text-text-secondary">{mode.description}</p>
                          <div className="flex items-center space-x-2">
                            <div className="h-1 flex-1 overflow-hidden rounded-xs bg-bg-surface-2">
                              <div
                                className={cn(
                                  "h-full rounded-xs",
                                  mode.intensity > 6
                                    ? "bg-status-danger"
                                    : mode.intensity > 3
                                      ? "bg-status-warning"
                                      : "bg-status-success"
                                )}
                                style={{ width: `${(mode.intensity / 10) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-mono text-text-muted">{mode.intensity}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configuracoes Avancadas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <label className="text-sm font-medium text-text-secondary">
                          Nivel de Consciencia
                        </label>
                        <Badge variant="accent">{formData.awarenessLevel}/10</Badge>
                      </div>
                      <Slider
                        min={1}
                        max={10}
                        value={formData.awarenessLevel}
                        onChange={(val) => handleInputChange("awarenessLevel", val)}
                      />
                    </div>

                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <label className="text-sm font-medium text-text-secondary">
                          Duracao-Alvo
                        </label>
                        <Badge variant="accent">{formData.targetDuration}min</Badge>
                      </div>
                      <Slider
                        min={10}
                        max={300}
                        step={10}
                        value={formData.targetDuration}
                        onChange={(val) => handleInputChange("targetDuration", val)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Selecione um Preset Visual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {visualPresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleInputChange("visualPreset", preset.id)}
                        className={cn(
                          "rounded-xs border-2 p-4 text-left transition-all",
                          formData.visualPreset === preset.id
                            ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                            : "border-border bg-bg-surface hover:border-border-active"
                        )}
                      >
                        <div className="mb-3 flex space-x-1">
                          {preset.colors.map((color, idx) => (
                            <div
                              key={idx}
                              className="h-8 flex-1 rounded-xs"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <h4 className="mb-1 font-semibold text-text-primary">{preset.name}</h4>
                        <p className="mb-2 text-xs text-text-secondary">{preset.style}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-base">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {formData.title && (
                  <div>
                    <p className="mb-1 text-text-muted">Titulo</p>
                    <p className="font-medium text-text-primary">{formData.title}</p>
                  </div>
                )}

                <div>
                  <p className="mb-1 text-text-muted">Tipo</p>
                  <p className="capitalize text-text-primary">{formData.type}</p>
                </div>

                <div>
                  <p className="mb-1 text-text-muted">Ano</p>
                  <p className="text-text-primary">{formData.year}</p>
                </div>

                <div>
                  <p className="mb-1 text-text-muted">Modo Narrativo</p>
                  <Badge variant="accent" size="sm">
                    {narrativeModes.find((m) => m.id === formData.narrativeMode)?.name}
                  </Badge>
                </div>

                <div>
                  <p className="mb-1 text-text-muted">Duracao-Alvo</p>
                  <p className="text-text-primary">{formData.targetDuration} minutos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="space-x-2"
          >
            <ChevronLeft size={16} />
            <span>Anterior</span>
          </Button>

          <div className="flex items-center space-x-3">
            <Link href="/projects">
              <Button variant="ghost">Cancelar</Button>
            </Link>

            {step < 3 ? (
              <Button
                variant="accent"
                onClick={() => setStep((s) => Math.min(3, s + 1))}
                className="space-x-2"
              >
                <span>Proximo</span>
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button
                variant="accent"
                onClick={handleCreate}
                className="space-x-2"
                disabled={submitting || !formData.title.trim()}
              >
                <Sparkles size={16} />
                <span>{submitting ? "Criando..." : "Criar Projeto"}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
