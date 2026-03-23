"use client";

import React from "react";
import { Upload, Search, Filter } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function MediaPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Biblioteca de Mídia
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Organize e gerencie todos os seus ativos de mídia
            </p>
          </div>
          <Button variant="accent" className="space-x-2">
            <Upload size={18} />
            <span>Upload de Mídia</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-bg-surface border border-border rounded-xs p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <Input
                placeholder="Buscar mídia..."
                className="pl-10"
              />
            </div>
            <select className="px-3 py-2 text-sm text-text-primary bg-bg-surface border border-border rounded-xs outline-none">
              <option>Todos os Tipos</option>
              <option>Imagens</option>
              <option>Vídeos</option>
              <option>Áudio</option>
            </select>
            <select className="px-3 py-2 text-sm text-text-primary bg-bg-surface border border-border rounded-xs outline-none">
              <option>Ordenar por</option>
              <option>Data (Recente)</option>
              <option>Nome (A-Z)</option>
              <option>Tamanho</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mb-4 text-4xl">📁</div>
            <h3 className="text-lg font-bold text-text-primary mb-2">
              Nenhuma mídia ainda
            </h3>
            <p className="text-text-secondary mb-6">
              Comece a adicionar imagens, vídeos e áudio para seus projetos
            </p>
            <Button variant="accent">Adicionar Primeira Mídia</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
