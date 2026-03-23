"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/projects": "Projetos",
  "/mining": "Mineração",
  "/scripts": "Editor de Scripts",
  "/presets": "Presets Visuais",
  "/settings": "Configurações",
  "/media": "Biblioteca de Mídia",
  "/voice": "Studio de Voz",
  "/timeline": "Timeline",
  "/export": "Exportar",
};

const getBreadcrumbs = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = [{ label: "Dashboard", href: "/" }];

  if (parts.length > 0) {
    const key = `/${parts[0]}`;
    const label = pageTitles[key] || parts[0];
    if (key !== "/") {
      crumbs.push({ label, href: key });
    }
  }

  return crumbs;
};

export function Header() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="bg-bg-surface border-b border-border h-16 flex items-center justify-between px-6 fixed top-0 right-0 left-60 z-30 transition-all duration-300 lg:left-60">
      <div className="flex items-center space-x-8">
        {/* Title and Breadcrumbs */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
          <div className="flex items-center space-x-2 text-sm text-text-secondary mt-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={16} />}
                <Link href={crumb.href} className="hover:text-text-primary transition-colors">
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center space-x-3">
        <button className="p-2 hover:bg-bg-surface-2 rounded-xs transition-colors text-text-secondary hover:text-text-primary relative group">
          <Bell size={20} />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-status-danger rounded-full"></div>
          <div className="absolute right-0 mt-2 w-48 bg-bg-surface-2 border border-border rounded-xs shadow-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <p className="text-xs text-text-secondary">Nenhuma notificação</p>
          </div>
        </button>
        {pathname === "/projects" && (
          <Button variant="accent" size="sm" className="space-x-2">
            <Plus size={16} />
            <span>Novo Projeto</span>
          </Button>
        )}
      </div>
    </header>
  );
}
