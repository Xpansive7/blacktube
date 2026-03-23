"use client";

import React, { useState } from "react";
import {
  Search,
  Zap,
  TrendingUp,
  Plus,
  Filter,
  Calendar,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const mockOpportunities = [
  {
    id: "1",
    title: "A Inteligência Artificial Vai Substituir Empregos?",
    year: 2024,
    type: "Tendência",
    synopsis:
      "Debate profundo sobre o impacto da IA no mercado de trabalho e habilidades futuras.",
    score: 94,
    ytStats: { views: 2500000, likes: 45000, comments: 8900 },
    genre: "Tecnologia",
  },
  {
    id: "2",
    title: "Como a Neurociência Explica a Felicidade",
    year: 2024,
    type: "Educacional",
    synopsis:
      "Análise científica dos mecanismos cerebrais por trás do bem-estar psicológico.",
    score: 87,
    ytStats: { views: 1800000, likes: 32000, comments: 6200 },
    genre: "Ciência",
  },
  {
    id: "3",
    title: "O Futuro dos Negócios Digitais",
    year: 2024,
    type: "Análise",
    synopsis:
      "Previsões sobre transformação digital e novas oportunidades de mercado.",
    score: 91,
    ytStats: { views: 3200000, likes: 58000, comments: 12100 },
    genre: "Negócios",
  },
  {
    id: "4",
    title: "Sustentabilidade: Ficção ou Realidade?",
    year: 2024,
    type: "Investigação",
    synopsis:
      "Investigação crítica sobre práticas sustentáveis nas grandes corporações.",
    score: 85,
    ytStats: { views: 1500000, likes: 28000, comments: 5400 },
    genre: "Ambiental",
  },
  {
    id: "5",
    title: "A Psicologia do Consumo Digital",
    year: 2024,
    type: "Pesquisa",
    synopsis: "Como as redes sociais influenciam nossas decisões de compra.",
    score: 89,
    ytStats: { views: 2100000, likes: 39000, comments: 7800 },
    genre: "Comportamento",
  },
  {
    id: "6",
    title: "Cripto: Investimento ou Especulação?",
    year: 2024,
    type: "Análise",
    synopsis: "Análise técnica e fundamental sobre o mercado de criptomoedas.",
    score: 82,
    ytStats: { views: 2800000, likes: 52000, comments: 9800 },
    genre: "Finanças",
  },
];

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-status-success";
  if (score >= 80) return "text-status-warning";
  return "text-status-danger";
};

export default function MiningPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [yearRange, setYearRange] = useState("");

  const filteredOpportunities = mockOpportunities.filter((opp) => {
    const matchesSearch = opp.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGenre = !genreFilter || opp.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Mineração de Oportunidades
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Descubra tendências e histórias para criar narrativas poderosas
            </p>
          </div>
          <Button variant="accent" className="space-x-2">
            <Zap size={18} />
            <span>Minerar Agora</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-bg-surface border border-border rounded-xs p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <Input
                placeholder="Buscar oportunidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Genre Filter */}
            <Select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            >
              <option value="">Todos os Gêneros</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Ciência">Ciência</option>
              <option value="Negócios">Negócios</option>
              <option value="Ambiental">Ambiental</option>
              <option value="Comportamento">Comportamento</option>
              <option value="Finanças">Finanças</option>
            </Select>

            {/* Year Range */}
            <Select value={yearRange} onChange={(e) => setYearRange(e.target.value)}>
              <option value="">Qualquer Ano</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </Select>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpportunities.map((opp) => (
            <Card key={opp.id} interactive>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Title and Genre */}
                  <div>
                    <h3 className="text-base font-bold text-text-primary mb-2 line-clamp-2">
                      {opp.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="accent" size="sm">
                        {opp.type}
                      </Badge>
                      <Badge size="sm">{opp.genre}</Badge>
                    </div>
                  </div>

                  {/* Synopsis */}
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {opp.synopsis}
                  </p>

                  {/* Opportunity Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-text-muted">
                        Score de Oportunidade
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(opp.score)}`}>
                        {opp.score}
                      </span>
                    </div>
                    <Progress
                      value={opp.score}
                      variant={opp.score >= 90 ? "success" : opp.score >= 80 ? "warning" : "danger"}
                    />
                  </div>

                  {/* YouTube Stats */}
                  <div className="bg-bg-surface-2 rounded-xs p-3 space-y-2">
                    <p className="text-xs text-text-muted font-semibold">
                      ESTATÍSTICAS YOUTUBE
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">
                        👁️ Visualizações
                      </span>
                      <span className="font-mono text-text-primary">
                        {(opp.ytStats.views / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">👍 Curtidas</span>
                      <span className="font-mono text-text-primary">
                        {(opp.ytStats.likes / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">💬 Comentários</span>
                      <span className="font-mono text-text-primary">
                        {(opp.ytStats.comments / 1000).toFixed(1)}K
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/projects/new`}>
                    <Button variant="accent" size="sm" className="w-full justify-center space-x-2">
                      <Plus size={16} />
                      <span>Criar Projeto</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted mb-4">
              Nenhuma oportunidade encontrada
            </p>
            <Button variant="accent">Tentar Novamente</Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
