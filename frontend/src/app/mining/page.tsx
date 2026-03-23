"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, Zap, Plus } from "lucide-react";
import Link from "next/link";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fetchMiningResults, searchMining, type MiningResult } from "@/lib/mining";

const genreOptions = [
  "Tecnologia",
  "Ciencia",
  "Negocios",
  "Ambiental",
  "Comportamento",
  "Financas",
];

const contentTypeOptions = [
  { label: "Todos", value: "" },
  { label: "Filmes", value: "movie" },
  { label: "Series", value: "series" },
];

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-status-success";
  if (score >= 80) return "text-status-warning";
  return "text-status-danger";
};

function formatCompactNumber(value?: number | null) {
  if (!value) return "0";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}

function buildProjectQuery(result: MiningResult) {
  const params = new URLSearchParams();
  params.set("title", result.title);
  if (result.year) params.set("year", String(result.year));
  if (result.synopsis) params.set("synopsis", result.synopsis);
  params.set("type", result.content_type === "series" ? "series" : "documentary");
  params.set("source", result.query || "youtube");
  return `/projects/new?${params.toString()}`;
}

export default function MiningPage() {
  const [searchTerm, setSearchTerm] = useState("power");
  const [genreFilter, setGenreFilter] = useState("");
  const [contentType, setContentType] = useState("");
  const [results, setResults] = useState<MiningResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRecentResults() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchMiningResults(12);
      setResults(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Nao foi possivel carregar os resultados de mineracao."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    try {
      setLoading(true);
      setError("");
      const data = await searchMining({
        query: searchTerm.trim() || "power",
        genre: genreFilter || undefined,
        content_type: contentType || undefined,
      });
      setResults(data);
      if (data.length === 0) {
        setError(
          "Nenhuma oportunidade encontrada para essa busca. Tente termos como power, dark, matrix ou psychology."
        );
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Nao foi possivel executar a mineracao."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecentResults();
  }, []);

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const matchesSearch =
        !searchTerm.trim() ||
        result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (result.synopsis || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre =
        !genreFilter ||
        (result.genre || "").toLowerCase() === genreFilter.toLowerCase();
      const matchesType =
        !contentType || (result.content_type || "").toLowerCase() === contentType;
      return matchesSearch && matchesGenre && matchesType;
    });
  }, [results, searchTerm, genreFilter, contentType]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Mineracao de Oportunidades
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Busque temas e transforme resultados em projetos reais.
            </p>
          </div>
          <Button
            variant="accent"
            className="space-x-2"
            onClick={handleSearch}
            disabled={loading}
          >
            <Zap size={18} />
            <span>{loading ? "Minerando..." : "Minerar Agora"}</span>
          </Button>
        </div>

        {error && (
          <div className="rounded-xs border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
            {error}
          </div>
        )}

        <div className="rounded-xs border border-border bg-bg-surface p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <Input
                placeholder="Ex: power, matrix, psychology..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            >
              <option value="">Todos os Generos</option>
              {genreOptions.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </Select>

            <Select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              {contentTypeOptions.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredResults.map((opp) => (
            <Card key={opp.id} interactive>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 line-clamp-2 text-base font-bold text-text-primary">
                      {opp.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="accent" size="sm">
                        {opp.content_type || "unknown"}
                      </Badge>
                      {opp.year && <Badge size="sm">{opp.year}</Badge>}
                    </div>
                  </div>

                  <p className="line-clamp-3 text-sm text-text-secondary">
                    {opp.synopsis || "Sem sinopse disponivel para esta oportunidade."}
                  </p>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        Score de Oportunidade
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(opp.opportunity_score)}`}>
                        {Math.round(opp.opportunity_score)}
                      </span>
                    </div>
                    <Progress
                      value={Math.round(opp.opportunity_score)}
                      variant={
                        opp.opportunity_score >= 90
                          ? "success"
                          : opp.opportunity_score >= 80
                            ? "warning"
                            : "danger"
                      }
                    />
                  </div>

                  <div className="rounded-xs bg-bg-surface-2 p-3 space-y-2">
                    <p className="text-xs font-semibold text-text-muted">
                      ESTATISTICAS
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Rating</span>
                      <span className="font-mono text-text-primary">
                        {opp.tmdb_rating?.toFixed(1) || "n/a"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Videos YouTube</span>
                      <span className="font-mono text-text-primary">
                        {formatCompactNumber(opp.yt_video_count)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Views medias</span>
                      <span className="font-mono text-text-primary">
                        {formatCompactNumber(opp.yt_avg_views)}
                      </span>
                    </div>
                  </div>

                  <Link href={buildProjectQuery(opp)}>
                    <Button
                      variant="accent"
                      size="sm"
                      className="w-full justify-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Criar Projeto</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!loading && filteredResults.length === 0 && !error && (
          <div className="py-12 text-center">
            <p className="mb-4 text-text-muted">
              Nenhuma oportunidade encontrada.
            </p>
            <Button variant="accent" onClick={handleSearch}>
              Buscar novamente
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
