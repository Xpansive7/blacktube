"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const mockPresets = [
  {
    id: "1",
    name: "Cinematográfico",
    style: "Cores quentes, contraste alto",
    colors: ["#FF6B35", "#004E89", "#1B6CA8"],
    intensity: 8,
    usage: 12,
  },
  {
    id: "2",
    name: "Minimalista",
    style: "Simplicidade e elegância",
    colors: ["#F5F5F5", "#2C2C2C", "#666666"],
    intensity: 3,
    usage: 5,
  },
  {
    id: "3",
    name: "Cyberpunk",
    style: "Neon e futurista",
    colors: ["#FF006E", "#8338EC", "#3A86FF"],
    intensity: 9,
    usage: 8,
  },
  {
    id: "4",
    name: "Naturalista",
    style: "Tons terra e orgânicos",
    colors: ["#8B7355", "#D2B48C", "#228B22"],
    intensity: 5,
    usage: 6,
  },
  {
    id: "5",
    name: "Retrô",
    style: "Estética clássica",
    colors: ["#C41E3A", "#FFD700", "#8B4513"],
    intensity: 6,
    usage: 9,
  },
  {
    id: "6",
    name: "Sombrio",
    style: "Cores escuras e melancólicas",
    colors: ["#1A1A1A", "#4A4A4A", "#2C2C54"],
    intensity: 7,
    usage: 15,
  },
];

const getIntensityVariant = (intensity: number) => {
  if (intensity <= 3) return "success" as const;
  if (intensity <= 6) return "warning" as const;
  return "danger" as const;
};

export default function PresetsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Presets Visuais
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Paletas de cores e estilos visuais para seus projetos
            </p>
          </div>
          <Button variant="accent" className="space-x-2">
            <Plus size={18} />
            <span>Novo Preset</span>
          </Button>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockPresets.map((preset) => (
            <Card key={preset.id} interactive>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Color Palette */}
                  <div className="flex space-x-2">
                    {preset.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex-1 h-16 rounded-xs shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Title and Style */}
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">
                      {preset.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {preset.style}
                    </p>
                  </div>

                  {/* Intensity */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-text-muted">
                        Intensidade Dramática
                      </span>
                      <Badge variant={getIntensityVariant(preset.intensity)}>
                        {preset.intensity}/10
                      </Badge>
                    </div>
                    <Progress
                      value={preset.intensity * 10}
                      variant={getIntensityVariant(preset.intensity)}
                    />
                  </div>

                  {/* Usage Stats */}
                  <div className="bg-bg-surface-2 rounded-xs p-2 text-center">
                    <p className="text-xs text-text-muted mb-1">Usado em</p>
                    <p className="text-sm font-bold text-text-primary">
                      {preset.usage} projetos
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Edit size={16} />
                    </Button>
                    <Button variant="danger" size="sm" className="flex-1">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
