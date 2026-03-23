"use client";

import React from "react";
import { FileText, Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ScriptsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Editor de Scripts
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Crie e edite roteiros para seus projetos
            </p>
          </div>
          <Button variant="accent" className="space-x-2">
            <Plus size={18} />
            <span>Novo Script</span>
          </Button>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mb-4 text-6xl">📝</div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              Nenhum Script Ainda
            </h3>
            <p className="text-text-secondary mb-6">
              Crie seu primeiro script através da criação de um novo projeto
            </p>
            <Button variant="accent" className="space-x-2">
              <FileText size={18} />
              <span>Criar Novo Script</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
