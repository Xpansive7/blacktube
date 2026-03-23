"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  Download,
  Film,
  FolderOpen,
  Image,
  LayoutDashboard,
  LogOut,
  Mic2,
  Palette,
  Settings,
  Wand2,
  Zap,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthStore, useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navSections = [
  {
    title: "Visao Geral",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/" },
      { icon: FolderOpen, label: "Projetos", href: "/projects" },
    ],
  },
  {
    title: "Producao",
    items: [
      { icon: Zap, label: "Mineracao", href: "/mining" },
      { icon: Wand2, label: "Mecanismo Narrativo", href: "/narrative" },
      { icon: FileText, label: "Editor de Scripts", href: "/scripts" },
    ],
  },
  {
    title: "Ativos",
    items: [
      { icon: Image, label: "Biblioteca de Midia", href: "/media" },
      { icon: Mic2, label: "Studio de Voz", href: "/voice" },
      { icon: Palette, label: "Presets Visuais", href: "/presets" },
    ],
  },
  {
    title: "Saida",
    items: [
      { icon: Film, label: "Timeline", href: "/timeline" },
      { icon: Download, label: "Exportar", href: "/export" },
    ],
  },
  {
    title: "Sistema",
    items: [{ icon: Settings, label: "Configuracoes", href: "/settings" }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { user, logout } = useAuthStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-bg-surface transition-all duration-300",
        sidebarOpen ? "w-60" : "w-20"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {sidebarOpen && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-gradient-to-br from-accent to-accent-glow">
              <span className="text-lg font-bold text-white">B</span>
            </div>
            <span className="hidden font-bold text-text-primary md:inline">
              BlackTube
            </span>
          </Link>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-xs p-1 text-text-secondary transition-colors hover:bg-bg-surface-2 hover:text-text-primary"
          title={sidebarOpen ? "Recolher" : "Expandir"}
        >
          <ChevronLeft
            size={20}
            className={cn("transition-transform", !sidebarOpen && "rotate-180")}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navSections.map((section) => (
          <div key={section.title} className="mb-6">
            {sidebarOpen && (
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 border-l-2 border-transparent px-4 py-2.5 text-sm transition-all duration-200 hover:border-border-active hover:bg-bg-surface-2",
                      isActive
                        ? "border-l-accent bg-bg-surface-2 text-accent shadow-lg shadow-accent/10"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-3 border-t border-border p-4">
        {sidebarOpen && user && (
          <div className="rounded-xs bg-bg-surface-2 px-2 py-2">
            <p className="truncate text-sm font-medium text-text-primary">
              {user.name}
            </p>
            <p className="truncate text-xs text-text-secondary">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-center space-x-2"
        >
          <LogOut size={16} />
          {sidebarOpen && <span>Sair</span>}
        </Button>
      </div>
    </aside>
  );
}
