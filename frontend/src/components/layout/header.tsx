"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/projects": "Projetos",
  "/projects/new": "Novo Projeto",
  "/mining": "Mineracao",
  "/scripts": "Editor de Scripts",
  "/presets": "Presets Visuais",
  "/settings": "Configuracoes",
  "/media": "Biblioteca de Midia",
  "/voice": "Studio de Voz",
  "/timeline": "Timeline",
  "/export": "Exportar",
};

const getBreadcrumbs = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = [{ label: "Dashboard", href: "/" }];

  if (parts.length > 0) {
    const key = `/${parts[0]}`;
    crumbs.push({ label: pageTitles[key] || parts[0], href: key });
  }

  return crumbs;
};

export function Header() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const title =
    pageTitles[pathname] ||
    pageTitles[`/${pathname.split("/").filter(Boolean)[0] || ""}`] ||
    "Dashboard";

  return (
    <header className="fixed left-60 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-bg-surface px-6 transition-all duration-300 lg:left-60">
      <div className="flex items-center space-x-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
          <div className="mt-1 flex items-center space-x-2 text-sm text-text-secondary">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={`${crumb.href}-${idx}`}>
                {idx > 0 && <ChevronRight size={16} />}
                <Link href={crumb.href} className="transition-colors hover:text-text-primary">
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button className="group relative rounded-xs p-2 text-text-secondary transition-colors hover:bg-bg-surface-2 hover:text-text-primary">
          <Bell size={20} />
          <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-status-danger" />
          <div className="invisible absolute right-0 z-50 mt-2 w-48 rounded-xs border border-border bg-bg-surface-2 p-3 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
            <p className="text-xs text-text-secondary">Nenhuma notificacao</p>
          </div>
        </button>
        {pathname === "/projects" && (
          <Link href="/projects/new">
            <Button variant="accent" size="sm" className="space-x-2">
              <Plus size={16} />
              <span>Novo Projeto</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
