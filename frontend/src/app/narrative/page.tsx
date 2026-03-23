"use client";

import React from "react";
import { Wand2 } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NarrativePage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Mecanismo Narrativo
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Configure e personalize os padrões narrativos de seus projetos
          </p>
        </div>

        {/* Coming Soon */}
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mb-4 text-6xl">✨</div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              Em Breve
            </h3>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              O Mecanismo Narrativo está sendo desenvolvido. Esta ferramenta permite configurar padrões avançados de narrativa para seus projetos.
            </p>
            <Button variant="accent" className="space-x-2">
              <Wand2 size={18} />
              <span>Voltar para Dashboard</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
