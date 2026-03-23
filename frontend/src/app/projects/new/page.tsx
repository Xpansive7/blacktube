"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const narrativeModes = [
  {
    id: "epic",
    name: "Épico",
    description: "Narrativa grandiosa e monumental",
    intensity: 9,
  },
  {
    id: "dramatic",
    name: "Dramatizado",
    description: "Foco em conflito e emoção",
    intensity: 8,
  },
  {
    id: "documentary",
    name: "Documental",
    description: "Fatos e informações precisas",
    intensity: 5,
  },
  {
    id: "inspiring",
    name: "Inspirador",
    description: "Motivação e esperança",
    intensity: 7,
  },
  {
    id: "emotional",
    name: "Emocional",
    description: "Conexão profunda com sentimentos",
    intensity: 8,
  },
  {
    id: "educational",
    name: "Educacional",
    description: "Aprendizado e esclarecimento",
    intensity: 4,
  },
  {
    id: "humorous",
    name: "Humorístico",
    description: "Leveza e entretenimento",
    intensity: 6,
  },
  {
    id: "suspenseful",
    name: "Suspensivo",
    description: "Mistério e tensão",
    intensity: 9,
  },
  {
    id: "contemplative",
    name: "Contemplativo",
    description: "Reflexão e filosofia",
    intensity: 6,
  },
];

const visualPresets = [
  {
    id: "cinematic",
    name: "Cinematográfico",
    style: "Cores quentes, contraste alto",
    colors: ["#FF6B35", "#004E89", "#1B6CA8"],
    intensity: 8,
  },
  {
    id: "minimalist",
    name: "Minimalista",
    style: "Simplicidade e elegância",
    colors: ["#F5F5F5", "#2C2C2C", "#666666"],
    intensity: 3,
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    style: "Neon e futurista",
    colors: ["#FF006E", "#8338EC", "#3A86FF"],
    intensity: 9,
  },
  {
    id: "naturalistic",
    name: "Naturalista",
    style: "Tons terra e orgânicos",
    colors: ["#8B7355", "#D2B48C", "#228B22"],
    intensity: 5,
  },
  {
    id: "vintage",
    name: "Retrô",
    style: "Estética clássica",
    colors: ["#C41E3A", "#FFD700", "#8B4513"],
    intensity: 6,
  },
  {
    id: "dark",
    name: "Sombrio",
    style: "Cores escuras e melancólicas",
    colors: ["#1A1A1A", "#4A4A4A", "#2C2C54"],
    intensity: 7,
  },
];

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    type: "documentary",
    source: "youtube",
    year: new Date().getFullYear(),
    synopsis: "",
    narrativeMode: "epic",
    awarenessLevel: 5,
    targetDuration: 60,
    visualPreset: "cinematic",
  });

  const [selectedMode, setSelectedMode] = useState("epic");
  const [selectedPreset, setSelectedPreset] = useState("cinematic");

  const handleInputChange = (
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    console.log("Creating project:", formData);
    // API call would go here
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return "text-status-success";
    if (intensity <= 6) return "text-status-warning";
    return "text-status-danger";
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Criar Novo Projeto
          </h1>
          <p className="text-text-secondary">Passo {step} de 3</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={cn(
                  "w-10 h-10 rounded-xs flex items-center justify-center font-bold transition-all",
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
                    "flex-1 h-1 rounded-xs transition-all",
                    step > s ? "bg-status-success" : "bg-bg-surface-2"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Título do Projeto
                    </label>
                    <Input
                      placeholder="Ex: A Revolução do Streaming"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Tipo de Conteúdo
                      </label>
                      <Select
                        value={formData.type}
                        onChange={(e) =>
                          handleInputChange("type", e.target.value)
                        }
                      >
                        <option value="documentary">Documentário</option>
                        <option value="series">Série</option>
                        <option value="short">Curta</option>
                        <option value="special">Especial</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Ano de Referência
                      </label>
                      <Input
                        type="number"
                        value={formData.year}
                        onChange={(e) =>
                          handleInputChange("year", parseInt(e.target.value))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Fonte Principal
                    </label>
                    <Select
                      value={formData.source}
                      onChange={(e) =>
                        handleInputChange("source", e.target.value)
                      }
                    >
                      <option value="youtube">YouTube</option>
                      <option value="article">Artigo</option>
                      <option value="podcast">Podcast</option>
                      <option value="social">Rede Social</option>
                      <option value="news">Notícia</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Sinopse
                    </label>
                    <Textarea
                      placeholder="Descrição breve do projeto..."
                      value={formData.synopsis}
                      onChange={(e) =>
                        handleInputChange("synopsis", e.target.value)
                      }
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Narrative Config */}
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
                          onClick={() => {
                            setSelectedMode(mode.id);
                            handleInputChange("narrativeMode", mode.id);
                          }}
                          className={cn(
                            "p-4 rounded-xs border-2 transition-all text-left",
                            selectedMode === mode.id
                              ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                              : "border-border bg-bg-surface hover:border-border-active"
                          )}
                        >
                          <h4 className="font-semibold text-text-primary mb-1">
                            {mode.name}
                          </h4>
                          <p className="text-xs text-text-secondary mb-2">
                            {mode.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 h-1 bg-bg-surface-2 rounded-xs overflow-hidden">
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
                            <span className="text-xs font-mono text-text-muted">
                              {mode.intensity}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Avançadas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-text-secondary">
                          Nível de Consciência
                        </label>
                        <Badge variant="accent">
                          {formData.awarenessLevel}/10
                        </Badge>
                      </div>
                      <Slider
                        min={1}
                        max={10}
                        value={formData.awarenessLevel}
                        onChange={(val) =>
                          handleInputChange("awarenessLevel", val)
                        }
                      />
                      <p className="text-xs text-text-muted mt-2">
                        De inconsciente (1) a totalmente consciente (10)
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-text-secondary">
                          Duração-Alvo
                        </label>
                        <Badge variant="accent">{formData.targetDuration}min</Badge>
                      </div>
                      <Slider
                        min={10}
                        max={300}
                        step={10}
                        value={formData.targetDuration}
                        onChange={(val) =>
                          handleInputChange("targetDuration", val)
                        }
                      />
                      <p className="text-xs text-text-muted mt-2">
                        Duração estimada do conteúdo final
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Visual Preset */}
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
                        onClick={() => {
                          setSelectedPreset(preset.id);
                          handleInputChange("visualPreset", preset.id);
                        }}
                        className={cn(
                          "p-4 rounded-xs border-2 transition-all text-left",
                          selectedPreset === preset.id
                            ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                            : "border-border bg-bg-surface hover:border-border-active"
                        )}
                      >
                        {/* Color Preview */}
                        <div className="flex space-x-1 mb-3">
                          {preset.colors.map((color, idx) => (
                            <div
                              key={idx}
                              className="flex-1 h-8 rounded-xs"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <h4 className="font-semibold text-text-primary mb-1">
                          {preset.name}
                        </h4>
                        <p className="text-xs text-text-secondary mb-2">
                          {preset.style}
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-1 bg-bg-surface-2 rounded-xs overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-xs",
                                preset.intensity > 6
                                  ? "bg-status-danger"
                                  : preset.intensity > 3
                                    ? "bg-status-warning"
                                    : "bg-status-success"
                              )}
                              style={{ width: `${(preset.intensity / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-text-muted">
                            {preset.intensity}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Panel */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-base">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {formData.title && (
                  <div>
                    <p className="text-text-muted mb-1">Título</p>
                    <p className="text-text-primary font-medium">
                      {formData.title}
                    </p>
                  </div>
                )}

                {step >= 1 && (
                  <>
                    <div>
                      <p className="text-text-muted mb-1">Tipo</p>
                      <p className="text-text-primary capitalize">
                        {formData.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-muted mb-1">Ano</p>
                      <p className="text-text-primary">{formData.year}</p>
                    </div>
                  </>
                )}

                {step >= 2 && (
                  <>
                    <div>
                      <p className="text-text-muted mb-1">Modo Narrativo</p>
                      <Badge variant="accent" size="sm">
                        {
                          narrativeModes.find((m) => m.id === formData.narrativeMode)
                            ?.name
                        }
                      </Badge>
                    </div>
                    <div>
                      <p className="text-text-muted mb-1">Duração-Alvo</p>
                      <p className="text-text-primary">
                        {formData.targetDuration} minutos
                      </p>
                    </div>
                  </>
                )}

                {step >= 3 && (
                  <div>
                    <p className="text-text-muted mb-2">Preset Visual</p>
                    <div className="flex space-x-1">
                      {visualPresets
                        .find((p) => p.id === formData.visualPreset)
                        ?.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="flex-1 h-6 rounded-xs"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                    </div>
                    <p className="text-text-primary mt-2">
                      {
                        visualPresets.find((p) => p.id === formData.visualPreset)
                          ?.name
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
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
              <Button variant="accent" onClick={handleNext} className="space-x-2">
                <span>Próximo</span>
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button
                variant="accent"
                onClick={handleCreate}
                className="space-x-2"
              >
                <Sparkles size={16} />
                <span>Criar Projeto</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
